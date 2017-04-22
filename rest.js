
var exec = require('child_process').exec; 


function getBrowserStackSessionIdsByBuildIdPromise(buildId){
	var p = new Promise(function(resolve, reject){
		 var cmd =  'curl -u "patricgren2:WF3ChxyK2xss3TEQA7DR" https://www.browserstack.com/automate/builds/'+buildId+'/sessions.json';
		 console.log(cmd);

		 var child = exec(cmd, function(error, stdout, stderr) {
		 	var sessionIds = [];
		 
		    if (error) {
		      console.error(error);
		      reject();
		      return;
		    }
		    var sessions = JSON.parse(stdout);
		 
		    console.log(stdout);
		    console.log(stderr);

		    sessions.forEach(function(session){
		    	var as = session['automation_session']; 
				sessionIds.push(as.hashed_id);
		    });

		    console.log(sessionIds);
			resolve(sessionIds);
		})
	});

	return p;
}

function markSessionAsFailed(sessionId, reason){
	console.log('inne');

	var cmd = 'curl -u "patricgren2:WF3ChxyK2xss3TEQA7DR" -X PUT -H "Content-Type: application/json" -d "{\\"status\\":\\"failed\\", \\"reason\\":\\"'+ reason+'\\"}" https://www.browserstack.com/automate/sessions/'+sessionId+'.json';
	console.log(cmd);

	var child = exec(cmd, function(error, stdout, stderr) {
		if (error) {
		  console.error(error);
		  return;
		}
		console.log(stdout);
		console.log(stderr);
	});	
}

function markSessionsAsFailedByBuildName(buildName, reason){
	getBrowserStackBuildIdByNamePromise(buildName)
		.then(getBrowserStackSessionIdsByBuildIdPromise)
		.then(function(sessionIds){
			console.log('will mark following sessions as failed');
			console.log(sessionIds);
			sessionIds.forEach(function(sessionId){
				console.log('will mark as failed;' )
				console.log(sessionId)
				markSessionAsFailed(sessionId, reason);
			});
		});
}


function getBrowserStackBuildIdByNamePromise(buildName){
	var p = new Promise(function(resolve, reject){
		 var cmd =  'curl -u "patricgren2:WF3ChxyK2xss3TEQA7DR" https://www.browserstack.com/automate/builds.json';

		 console.log(cmd);

		 var child = exec(cmd, function(error, stdout, stderr) {
		 	var builds = JSON.parse(stdout);
		    var buildId = 'notFound';


		    if (error) {
		      console.error(error);
		      reject();
		      return;
		    }
		    console.log(stdout);
		    console.log(stderr);

		    builds.forEach(function(build){
		    	var as = build['automation_build']; 

		    	if(as.name === buildName){
		    		buildId = as.hashed_id;
		    	}
		    });

		    console.log(buildId);
			resolve(buildId);
		})
	});

	return p;
}

function deleteBrowserStackBuild(buildName){

	getBrowserStackBuildIdByNamePromise(buildName).then(function(buildId){
		var cmd = 'curl -u "patricgren2:WF3ChxyK2xss3TEQA7DR" -X DELETE https://www.browserstack.com/automate/builds/' + buildId +'.json';

		console.log(cmd);

		var child = exec(cmd, function(error, stdout, stderr) {
			if (error) {
			  console.error(error);
			  return;
			}
			console.log(stdout);
			console.log(stderr);
		});	
	});
}

module.exports  = {
	deleteBrowserStackBuild: deleteBrowserStackBuild,
	markSessionsAsFailedByBuildName: markSessionsAsFailedByBuildName 
};

