
var exec = require('child_process').exec; 

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
	deleteBrowserStackBuild: deleteBrowserStackBuild 
};

