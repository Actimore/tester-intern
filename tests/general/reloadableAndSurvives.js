var utility = require('../../utility/utility');

var urlPaths = [
  "/", 
  '/sv/about',
  '/sv/contact',
  '/sv/deals-by-brand/stockholm/danderyds-gokart/danderyds-gokartbana', 
  '/sv/deals-by-brand/stockholm/danderys-gokart'
];



var testCases = {};

//  testCases["Prep cookies"] = function (browser) {
//       browser
//         .url(browser.globals.siteDomain + "?tester=" +browser.globals.testerName)
//         .waitForElementVisible('.bootstrap-wrapper .loader', 20000)
//         .setCookie({
//           name     : "dontShowActimoreIntro",
//           value    : "true",
//           domain   : browser.globals.cookieDomain, 
//           path     : "/", 
//           expiry   : 1395002765 
//         });
// };          

urlPaths.forEach(function(e, i, a){
  testCases[(utility.testNamePrefix() +"Load-"+ e)] = function (browser) {
    browser.resizeWindow(browser.globals.win.width, browser.globals.win.height);
    
    browser
        .url(browser.globals.siteDomain + e +"?tester=" +browser.globals.testerName)
        .waitForElementNotPresent('.bootstrap-wrapper .loader', browser.globals.generalWaitingTime);

    utility.snapshot('res' + i + '.png');

  };      
});

urlPaths.forEach(function(e, i, a){
  testCases[(utility.testNamePrefix() +"Survives-"+ e)] = function (browser) {
      browser
        .perform(function() {
            console.log("test logging Survives-2minutes-"+ e);
        })
        .url(browser.globals.siteDomain + e +"?tester=" +browser.globals.testerName)
        .waitForElementNotPresent('.bootstrap-wrapper .loader', browser.globals.generalWaitingTime)
        .pause(browser.globals.survivesTime);
      browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
  };      
});

urlPaths.forEach(function(e, i, a){
  testCases[(utility.testNamePrefix() +"Reload-"+ e)] = function (browser) {
    for(var i = 1; i<=browser.globals.reloadableAndSurvives.amountOfReloadUrls; i++){
      browser
        .perform(function() {
            console.log("Reload index: " +i);
        })
        .url(browser.globals.siteDomain + e +"?tester=" +browser.globals.testerName)
        .waitForElementNotPresent('.bootstrap-wrapper .loader', browser.globals.generalWaitingTime)
        .pause(browser.globals.survivesTime);

      browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
    }

    if(urlPaths.length - 1 === i){
      browser.end()
    }     

  };      
});


module.exports  = testCases;