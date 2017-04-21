var express = require("express");
var app = express();
var exec = require('child_process').exec;
var rest = require('./rest');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

var childs = {};
var rerunOnFail = true;
var rerunOnSuccess = true;
var readyAfterDeploy = true;
var limitRerunFailInARow = 20;
var failedInARow = 0;
var decoder = new StringDecoder('utf8');


process.title = 'testerInternApp';

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
  return readyAfterDeploy && failedInARow <= limitRerunFailInARow;
}

function run(cmd){
  var bsBuildName = buildForNightwatchConfJs(); //needs to be set before ecec 
  console.log('Build name: ' + bsBuildName);
  console.log(cmd);
  var child = exec(cmd, function(error, stdout, stderr) {
    delete childs[child.pid];
    
    if (error) {
      failedInARow ++;
      console.error(error);
      fs.writeFile(('./testLogs/error/' + bsBuildName + '.txt'), decoder.write(error), 'utf8', function (err) {
        if (err) return console.log(err);
      });
      if(rerunOnFail && allowedToReload()){
        setTimeout(function(){
          console.log('Wiill rerun on fail in a row nr : ' + failedInARow+ ' with cmd: ' +cmd);
          run(cmd);
        }, 0); 
      }
      return;
    }

    failedInARow = 0;
    console.log(stdout);
    console.log(stderr);
    if(stdout){
      fs.writeFile(('./testLogs/success/stdout/' + bsBuildName + '.txt'), decoder.write(stdout), 'utf8', function (err) {
          if (err) return console.log(err);
      });
      if(stderr){
        fs.writeFile(('./testLogs/success/stderr/' + bsBuildName + '.txt'), decoder.write(stderr), 'utf8', function (err) {
            if (err) return console.log(err);
        });   
      }
    }
    
    if(rerunOnSuccess && allowedToReload()){
      setTimeout(function(){
        console.log('Wiill rerun on success: ' + cmd);
        run(cmd);
      }, 0); 
    }
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
  else if (Object.keys(childs).length < 1){
    run(cmd);
    res.send('started test: ' + cmd);
  } else {
    res.send('Not started test due to max 1 test limit.');
  }
}

app.get('/ready-after-deploy', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/convertFlow.js";
  
  readyAfterDeploy = true;
  validateStart(cmd, res);
});

app.get('/ready-after-deploy-hold-tests', function(req, res){ 
  readyAfterDeploy = true;
});

app.get('/convert-flow', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/convertFlow.js";
  validateStart(cmd, res);
});

app.get('/reloadable-and-survives', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/reloadableAndSurvives.js";
  validateStart(cmd, res);
});

app.get('/reloadable-and-survives', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch --test tests/general/startPage.js";
  validateStart(cmd, res);
});

app.get('/kill', function(req, res){
  readyAfterDeploy = false;

  var pids = Object.keys(childs);
  for (var i = 0; i < pids.length; i++) {
    console.log('Will kill pid index ' + i)
    
    killCmd(pids[i]);
  };
    
  res.send('Killed following tests ' + JSON.stringify(pids));
});

app.get('/status', function(req, res){
  var pids = Object.keys(childs);
  if(pids.length === 0){
    res.send('No tests are running and readyAfterDeploy is ' + readyAfterDeploy);
  } else{
    res.send('Following tests with pid are running ' + JSON.stringify(pids));
  }
   
});

app.use(express.static('testLogs'));



var port = process.env.PORT || 3031;
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});