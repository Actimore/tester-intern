
var snapshot = function (fileName, browser){
	if(browser.globals.snapshotEnabled){
		browser.saveScreenshot(fileName);
	}

}
var snapshotInIteration = function (fileName, browser, iteration){
	if(iteration === 1) {
		snapshot(fileName, browser);
	}

}

function testNamePrefix(){
	
  return 'BsBuild: ' + process.env.bsbuild +' --- ';
}


module.exports  = {
	snapshot: snapshot, 
	snapshotInIteration: snapshotInIteration, 
	testNamePrefix: testNamePrefix
};