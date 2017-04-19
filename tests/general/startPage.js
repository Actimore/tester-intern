var utility = require('../../utility/utility.js');

var filterGte768  = function(browser){

    browser.waitForElementVisible("#boxOne button", browser.globals.generalWaitingTime);
    browser.click("#boxOne button");
    browser.waitForElementVisible('#boxDropdown1', browser.globals.generalWaitingTime);
    browser.pause(browser.globals.domGenerationTime);
    utility.snapshot('Filter-1.png');
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;

    browser.waitForElementVisible(".activityFilterBox button", browser.globals.generalWaitingTime);
    browser.click(".activityFilterBox button");
    browser.waitForElementVisible('#boxDropdown2', browser.globals.generalWaitingTime);
    browser.pause(browser.globals.domGenerationTime);
    utility.snapshot('Filter-2.png');
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;

    browser.waitForElementVisible(".timeFilterBox button", browser.globals.generalWaitingTime);
    browser.click(".timeFilterBox button");
    browser.waitForElementVisible('#boxDropdown3', browser.globals.generalWaitingTime);
    browser.pause(browser.globals.domGenerationTime);
    utility.snapshot('Filter-3.png');
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;

    browser.click("#boxOne button");
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;


    browser.click(".activityFilterBox button");
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;

    browser.click(".timeFilterBox button");
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;

    utility.snapshot('Filter-4.png');

    browser.click(".activityFilterBox button");
    browser.waitForElementVisible('#boxDropdown2', browser.globals.generalWaitingTime);
    browser.pause(browser.globals.domGenerationTime);
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
  
  
  browser.execute(function () {
    [7,8,9,10,11, 12, 13].forEach(function(val){
        jQuery("#boxDropdown2 li:nth-of-type("+val+") a").addClass("bd2-"+val+"-forSelenium");
      }); 
  }, []);
  [7,8,9,10,11, 12, 13].forEach(function(val){    
      browser.waitForElementPresent('.bd2-'+val+'-forSelenium', browser.globals.generalWaitingTime);
     });
  browser.click(".activityFilterBox button");
    [7,8,9,10,11, 12, 13, 11, 8, 9, 7, 11, 11, 9, 8].forEach(function(val){
    browser.click('.bd2-'+val+'-forSelenium');    
    browser.pause(browser.globals.survivesTime);
      browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
  });

  
  browser.execute(function () {
    [7,8,9,10].forEach(function(val){
        jQuery("#boxDropdown3 li:nth-of-type("+val+") a").addClass("bd3-"+val+"-forSelenium");
      });
  }, []);
  [7,8,9,10].forEach(function(val){
      browser.waitForElementPresent('.bd3-'+val+'-forSelenium', browser.globals.generalWaitingTime);
  });
    [7,8,9,10,7,7,9, 8, 7,10,9,10].forEach(function(val){
      browser.click(".timeFilterBox button");
    browser.waitForElementVisible('.bd3-'+val+'-forSelenium', browser.globals.generalWaitingTime);
    browser.click('.bd3-'+val+'-forSelenium');
    browser.waitForElementNotVisible('#boxDropdown3', browser.globals.generalWaitingTime);
    browser.pause(browser.globals.survivesTime);
  });
};

module.exports = {
  (utility.testNamePrefix() + 'Intro') : function (browser) {
    browser.resizeWindow(browser.globals.win.width, browser.globals.win.height);
    browser
      .url(browser.globals.siteDomain +"?tester=" +browser.globals.testerName)
      .waitForElementVisible('.introModalContent', browser.globals.generalWaitingTime);
    utility.snapshot('intro-1.png', browser);
    browser.click(".introModalContent .btn-primary");
    browser.pause(browser.globals.domGenerationTime);
    utility.snapshot('intro-2.png', browser); 
  	browser.click(".introModalContent .btn-primary");
  	browser.click(".introModalContent .btn-primary");
    browser.click(".introModalContent .btn-primary");
    browser.waitForElementNotPresent('.introModalContent', browser.globals.generalWaitingTime);
  },
  (utility.testNamePrefix() +'Overview') : function (browser) {
  	browser.waitForElementVisible('.cc-dismiss', browser.globals.generalWaitingTime);   
    browser.click(".cc-dismiss");
    browser.waitForElementNotVisible('.cc-dismiss', browser.globals.generalWaitingTime);   
    utility.snapshot('overview1.png', browser);
  	browser.waitForElementVisible('.timeSlotWrapper', browser.globals.generalWaitingTime);
    browser.execute(function () {
    	 jQuery(window).scrollTop(jQuery('.timeSlotWrapper').eq(4).offset().top - (jQuery(window).height() / 2));
	}, []);
    browser.pause(browser.globals.domGenerationTime); //Need to populate top fixed menu
    utility.snapshot('overview2.png', browser);
  },
  (utility.testNamePrefix() + 'Filter screen limit gte768') : function (browser) {
    if(browser.globals.screenLimits.gte768){
      for(var j = 1; j<=browser.globals.testSpecific.startPage.amountOfFilterIterations; j++){
        browser.perform(function() {
            console.log('Will redo filtering...');
        });
        filterGte768(browser);    
      }
      
    } else{
        browser.perform(function() {
        console.log("Skips due to non enabled screen limit.");
      });
    }
  },
  (utility.testNamePrefix() +'Filter screen limit lt768') : function (browser) {
    if(browser.globals.screenLimits.lt768){
      for(var j = 1; j<=browser.globals.testSpecific.startPage.amountOfFilterIterations; j++){
        browser.perform(function() {
            console.log('Will redo filtering...');
        });
        //todo filip
        browser.perform(function() {
            console.log('Filter lt768 not implemeted yet.');
        });  
      }
      
    } else{
        browser.perform(function() {
        console.log("Skips due to non enabled screen limit.");
      });
    }
  },
  (utility.testNamePrefix() + 'Inspire and Footer') : function (browser) {
  	browser.execute(function () {
    	 jQuery("#mainTimeSlotsView").css('display', 'none');
  	}, []);
      browser.waitForElementNotVisible('#mainTimeSlotsView', browser.globals.generalWaitingTime);
      browser.execute(function () {
      	 jQuery(window).scrollTop(jQuery('.inspireDeals').offset().top - (jQuery(window).height() / 2));
  	}, []);
  	browser.pause(browser.globals.generalScrollTime);
    utility.snapshot('inspireDeals.png', browser);
  	browser.execute(function () {
      	 jQuery(window).scrollTop(jQuery('.footerLogoWrapper').offset().top - (jQuery(window).height() / 2));
  	}, []);
  	browser.pause(browser.globals.generalScrollTime);
    utility.snapshot('footerLogoWrapper.png', browser);
  	browser.execute(function () {
      	 jQuery(window).scrollTop(jQuery('.footerActivityTypes').offset().top - (jQuery(window).height() / 2));
  	}, []);
  	browser.pause(browser.globals.generalScrollTime);
    utility.snapshot('footerActivityTypes.png', browser);
  	browser.execute(function () {
      	 jQuery(window).scrollTop(jQuery('.footerFacilities').offset().top - (jQuery(window).height() / 2));
  	}, []);
  	browser.pause(browser.globals.generalScrollTime);
    utility.snapshot('footerFacilities.png', browser);
   	browser.end();
  },
};