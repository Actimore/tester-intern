var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')
var exec = require('child_process').exec;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
var childs = {};
var browserstackQueLimit = 1; //have one until buildbs prefix checked.

function buildForNightwatchConfJs(){
  process.env.bsbuild = "autobsbuild" +S4()+S4()+S4()+S4();
  return process.env.bsbuild;
}

function deleteBrowserStackBuild(buildName){

}

function killCmd(pid){
    console.log('Will kill pid: ' +pid)
    childs[pid].childObj.kill()
    deleteBrowserStackBuild(childs[pid].bsBuildName);
    delete childs[pid];
}

function run(cmd){
  var bsBuildName = buildForNightwatchConfJs(); //needs to be set before ecec 
  var child = exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.error(error);
      return;
    }
    killCmd(child.pid);
    console.log(stdout);
    console.log(stderr);
  });
  childs[child.pid] = {
    'childObj': child, 
    'bsBuildName': bsBuildName
  };
}

function validateStart(cmd, res){
  if (Object.keys(childs).length <= browserstackQueLimit){
    run(cmd);
    res.send('started test: ' + cmd);
  } else {
    res.send('Not started test due to browserstack que limit.');
  }
}

app.get('/start-auto', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch";
  validateStart(cmd, res);
});

app.get('/start-all', function(req, res){
  var cmd = "./node_modules/nightwatch/bin/nightwatch";
  validateStart(cmd, res);
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
  var pids = Object.keys(childs);
  pids.forEach(function(pid){
    killCmd(pid);
  });

  res.send('Killed all tests');
});

app.get('/status', function(req, res){
  var pids = Object.keys(childs);
  if(pids.length === 0){
    res.send('No tests are running ');
  } else{
    res.send('Following tests with pid are running ' + JSON.stringify(pids));
  }
   
});

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3001
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});