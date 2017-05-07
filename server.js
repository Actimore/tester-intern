var express = require("express");
var app = express();
var exec = require('child_process').exec;
var rest = require('./rest');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var amApi = require('./utility/amApi');
var low = require('lowdb')


var childs = {};
var rerunOnFail = true;
var rerunOnSuccess = true;
var readyAfterDeploy = true;
var limitRerunFailInARow = 1000;
var failedInARow = 0;
var decoder = new StringDecoder('utf8');
var watingForRerun = false;
var testsFailedSinceLastDeploy = 0;
var testsSuccessSinceLastDeploy = 0;
var db = low('db.json')
var alternateTests = [
  // "./node_modules/nightwatch/bin/nightwatch --test tests/general/reloadableAndSurvives.js",
  // "./node_modules/nightwatch/bin/nightwatch --env 'mac_safari_8' --test tests/general/reloadableAndSurvives.js",
  // "./node_modules/nightwatch/bin/nightwatch --env 'win_ie_11' --test tests/general/reloadableAndSurvives.js",
  // "./node_modules/nightwatch/bin/nightwatch --env 'win_ff_52' --test tests/general/reloadableAndSurvives.js" 
  "./node_modules/nightwatch/bin/nightwatch --test tests/general/convertFlow.js"
  //  "./node_modules/nightwatch/bin/nightwatch --env 'mac_safari_8' --test tests/general/convertFlow.js",
  //  "./node_modules/nightwatch/bin/nightwatch --env 'win_ie_11' --test tests/general/convertFlow.js",
  //  "./node_modules/nightwatch/bin/nightwatch --env 'win_ff_52' --test tests/general/convertFlow.js"
  // "./node_modules/nightwatch/bin/nightwatch --env 'mac_safari_10' --test tests/general/convertFlow.js"
];
var alternateIndex = 0
var doAlternate = true;

// Set some defaults if your JSON file is empty 
db.defaults({ paymentUuidsToCancel: [] })
  .write();
 

 
process.title = 'testerInternApp';

function getAlternateCmd(){
  alternateIndex++;
  if(alternateIndex >= alternateTests.length){
    alternateIndex = 0;
  }

  var cmd = alternateTests[alternateIndex];

  return cmd;
}

var S4 = function () {
  return (
  ((1 + Math.random()) * 0x10000) || 0).toString(16).substring(0, 4);
};

function buildForNightwatchConfJs(){
  var prefix = process.env.IS_SERVER ?  'server' : 'local'

  prefix += process.env.IS_REAL ?  'Real' : 'Coding' 


  process.env.BS_BUILD = prefix + "BsBuild" +S4()+S4()+S4()+S4();
  return process.env.BS_BUILD;
}

function killCmd(pid){
    console.log('Will kill pid: ' +pid)
    childs[pid].childObj.kill();
    failedInARow = 0;
    console.log('Will kill browserstack build after delay due to 90 sek time to cancel the test: ' +pid)
    setTimeout(function(){
      var cObj = childs[pid];
      var name = cObj.bsBuildName;
      rest.deleteBrowserStackBuild(name);
      delete childs[pid];
    }, 200000);
    
}

function allowedToReload(){
  return readyAfterDeploy && !watingForRerun && failedInARow <= limitRerunFailInARow;
}

function logs(error, stdout, stderr, bsBuildName){
  if(error){
    console.error(error);
    fs.writeFile(('./testLogs/error/' + bsBuildName + '.txt'), decoder.write(error), 'utf8', function (err) {
        if (err) return console.log(err);
      });
  }
  if(stdout){
    console.log(stdout);
    fs.writeFile(('./testLogs/success/stdout/' + bsBuildName + '.txt'), decoder.write(stdout), 'utf8', function (err) {
        if (err) return console.log(err);
    });
  }  
  if(stderr){
    console.log(stderr);

    fs.writeFile(('./testLogs/success/stderr/' + bsBuildName + '.txt'), decoder.write(stderr), 'utf8', function (err) {
        if (err) return console.log(err);
    });   
  }
   
}

function runOnError(cmd){
  failedInARow ++;
  amApi.cancelBookings();
  if(rerunOnFail && allowedToReload()){
    if (doAlternate){
      cmd = getAlternateCmd();
    }
    watingForRerun = true;
    setTimeout(function(){
      watingForRerun = false;
      console.log('Wiill rerun on fail in a row nr : ' + failedInARow+ ' with cmd: ' +cmd);
      run(cmd);
    }, 120000); 
  }
}

function runOnSuccess(cmd){
  failedInARow = 0;
  if(rerunOnSuccess && allowedToReload()){
    if (doAlternate){
      cmd = getAlternateCmd();
    }
    watingForRerun = true;
    setTimeout(function(){
      watingForRerun = false;
      console.log('Wiill rerun on success: ' + cmd);
      run(cmd);
    }, 120000); 
  }
}

function run(cmd){
  var bsBuildName = buildForNightwatchConfJs(); //needs to be set before ecec 
  console.log('Build name: ' + bsBuildName);
  console.log(cmd);
  var child = exec(cmd, function(error, stdout, stderr) {
    delete childs[child.pid];    
    logs(error, stdout, stderr, bsBuildName);
    if (error) {
      testsFailedSinceLastDeploy++;
      rest.markSessionsAsFailedByBuildName(bsBuildName, 'CMD_ERROR')
      runOnError(cmd);
      return;
    }
    testsSuccessSinceLastDeploy++;
    runOnSuccess(cmd); 
  });

  childs[child.pid] = {
    'childObj': child, 
    'bsBuildName': bsBuildName
  };
}

function validateStart(cmd, res){
  if (!readyAfterDeploy){
    res.send('No test started. Not ready after deploy...');
  }
  else if (watingForRerun){
    res.send('No test started. Not ready due to waiting for rerun attampt on previsous test...');
  }
  else if (Object.keys(childs).length < 1){
    run(cmd);
    res.send('started test: ' + cmd);
  } else {
    res.send('Not started test due to max 1 test limit.');
  }
}

app.get('/ready-after-deploy', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/convertFlow.js";
  testsFailedSinceLastDeploy = 0;
  testsSuccesSinceLastDeploy = 0;
  readyAfterDeploy = true;
  validateStart(cmd, res);
});

app.get('/ready-after-deploy-hold-tests', function(req, res){ 
  testsFailedSinceLastDeploy = 0;
  testsSuccesSinceLastDeploy = 0;
  readyAfterDeploy = true;
});

app.get('/convert-flow', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/convertFlow.js";
  validateStart(cmd, res);
});
app.get('/convert-flow/win_ie_11', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --env 'win_ie_11' --test tests/general/convertFlow.js";
  validateStart(cmd, res);
});
app.get('/convert-flow/win_ff_52', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --env 'win_ff_52' --test tests/general/convertFlow.js";
  validateStart(cmd, res);
});
app.get('/convert-flow/mac_safari_8', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --env 'mac_safari_8' --test tests/general/convertFlow.js";
  validateStart(cmd, res);
});


app.get('/reloadable-and-survives', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/reloadableAndSurvives.js";
  validateStart(cmd, res);
});

app.get('/start-page', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/startPage.js";
  validateStart(cmd, res);
});

app.get('/kill', function(req, res){
  readyAfterDeploy = false;
  testsFailedSinceLastDeploy = 0;
  testsSuccesSinceLastDeploy = 0;

  failedInARow = 0;
  var pids = Object.keys(childs);
  for (var i = 0; i < pids.length; i++) {
    console.log('Will kill pid index ' + i)
    
    killCmd(pids[i]);
  };
    
  res.send('Killed following tests ' + JSON.stringify(pids));
});

app.get('/did-i-depoy-shitty-code', function(req, res){
  if(testsFailedSinceLastDeploy === 0 && testsSuccessSinceLastDeploy === 0){
    res.send('wait to know...and rerun qurey');
  }
  else if(testsFailedSinceLastDeploy === 0){
    res.send('NO');
  } else{
    res.send('YES');
  }
   
});

app.get('/status', function(req, res){
  var pids = Object.keys(childs);
  if(pids.length === 0){
    res.send('No tests are running, and readyAfterDeploy is ' + readyAfterDeploy + '  and watingForRerun is ' + watingForRerun + '  and failedInARow is ' + failedInARow + '  and testsFailedSinceLastDeploy is ' + testsFailedSinceLastDeploy + '  and testsSuccessSinceLastDeploy is ' + testsSuccessSinceLastDeploy);
  } else{
    res.send('Following tests with pid are running, ' + JSON.stringify(pids) + '  and watingForRerun is ' + watingForRerun + '  and failedInARow is ' + failedInARow + '  and testsFailedSinceLastDeploy is ' + testsFailedSinceLastDeploy + '  and testsSuccessSinceLastDeploy is ' + testsSuccessSinceLastDeploy);
  }
   
});

app.use(express.static('testLogs'));



var port = process.env.PORT || 3031;
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});