var request = require('request');
var utility = require('../../utility/utility');
var amApi = require('../../utility/amApi');
var low = require('lowdb')

var db = low('db.json')

// Set some defaults if your JSON file is empty
db.defaults({ paymentUuidsToCancel: [] })
  .write();



var testCases = {},
  cacheWindowAdoption = false,
  cacheWindowMin = 17,
  amountOfDifferentTimeslotsToBuy = 5,
  joinUrl;

if (typeof process.env.paymentUuidsToCancel === 'undefined') {
  process.env.paymentUuidsToCancel = JSON.stringify([]);
}

for(var i = 1; i<=amountOfDifferentTimeslotsToBuy ; i++){
 addConvertFlowCase(i);
}





function navigateToBookableTimeslot(browser, iteration){
  var dateAttempts = 1;
  var targetededOverviewIndex = iteration - 1; //based on the fact that we book the first date and time in every slot


  function tryToFindBookableTimeslot(){
    browser.execute(function (targetededOverviewIndex, dateAttemptsInside) {

        // var bookableSelector = '.timeSlotOverview.isCanceled-false:not(.participantsNr-0)';
        var bookableSelector = '.timeSlotOverview';
        var scrolled = false;
        var triedToScroll = false;
        // if(dateAttemptsInside === 1){
        //   jQuery(bookableSelector).remove(); //Simulates all booked while testing this algoritm
        // }

        var amountBookable  = jQuery(bookableSelector).length;
        if(amountBookable){
          jQuery(bookableSelector).eq(targetededOverviewIndex).addClass('isTargetDetailedViewSelenium');

          return {addedClass: true, switchedSeed: false, scrolled: false, triedToScroll: false};
        } else{
            triedToScroll = true;
            if(jQuery('.timeSlotWrapper').length){
              scrolled = true;
              jQuery(window).scrollTop(jQuery('.timeSlotWrapper').eq(-1).offset().top + jQuery('.timeSlotWrapper').eq(-1).height());
              scrolled = true;
            }
          return {addedClass: false, scrolled: scrolled, triedToScroll: triedToScroll};
        }
    }, [targetededOverviewIndex, dateAttempts], function(result){
      browser.perform(function() {
        console.log('Attemt with targetededOverviewIndex:' + targetededOverviewIndex);
        console.log(result);
      });

      if(!result.value.addedClass){
          browser.perform(function() {
            console.log("Did not add class");
          });
        if(result.value.scrolled){
          browser.perform(function() {
            console.log("Able to scroll");
          });
        } else {
          browser.pause(500);
          browser.perform(function() {
            console.log("Will switch dates... ");
          });
          if(browser.globals.screenLimits.gte768 && dateAttempts <= 5){
            console.log("not implemented date and time switch in new design");
          }
          dateAttempts++;

        }

        // if(dateAttempts <= 5 && browser.globals.screenLimits.gte768){
        //   browser.perform(function() {
        //     console.log("Date attempts allow new attempt... " + 'it is ' +dateAttempts);
        //   });
        //   browser.pause(20000);
        //   targetededOverviewIndex++;
        //   tryToFindBookableTimeslot();
        // } else {
        //   browser.perform(function() {
        //     console.log("Date attempts to many or lte768, will quit trying finding bookable timeslot... ");
        //   });
        // }

      } else {
          browser.perform(function() {
            console.log("Did add class");
          });
      }
    });
  }



  tryToFindBookableTimeslot();

  browser.waitForElementVisible('.isTargetDetailedViewSelenium .timeSlotLayersBlock', 120000);
  browser.pause(15000);
  browser.execute(function () {
     jQuery(window).scrollTop(jQuery('.isTargetDetailedViewSelenium .timeSlotLayersBlock').eq(0).offset().top - (jQuery(window).height()));
  }, []);
  browser.pause(browser.globals.generalScrollTime);
  browser.pause(25000);

  utility.snapshotInIteration('convert-0.png', iteration);
  browser.waitForElementVisible('.isTargetDetailedViewSelenium', browser.globals.generalWaitingTime);
  browser.click(".isTargetDetailedViewSelenium .timeSlotLayersBlock");
}


function buy(browser, i, isJoinBooking){
  var imageDifference = isJoinBooking ? "join-": "";
  var userTestName = isJoinBooking ? "Patric Von Joinarsson": "Kristoffer Initialusersson";
  var userTestEmail = isJoinBooking ? "patric.ogren@hotmail.com": "krippa.hogberg@hotmail.com";

    browser.execute(function () {
      jQuery(window).scrollTop(jQuery('.userEmailWrapper').offset().top - (jQuery(window).height() / 2));
    }, []);
    if (isJoinBooking) {
      browser.click(".emailChangeWrapper a");
    }
    browser.pause(5000); //wait for user name to be preset so can overwride
    browser.setValue('.userEmailWrapper input[type=email]', userTestEmail);
    browser.setValue('input.userName', userTestName);
    browser.pause(browser.globals.generalScrollTime);
    browser.expect.element('.userEmailWrapper input[type=email]').to.have.value.that.equals(userTestEmail);
    if (!isJoinBooking) {
      browser.execute(function () {
          $("select[name='timeSlot']").find("option[value='0']").prop('selected',true).trigger('change'); //trigger a change instead of click
      }, []);
      browser.pause(4000);
    }
    browser.click(".buyButton");

    browser.waitForElementVisible('.guaranteeModalContent', browser.globals.generalWaitingTime);
    utility.snapshotInIteration('gurantee-'+imageDifference+'.png', browser, i);
    browser.click(".guaranteeModalContent .btn-primary");


    browser.execute(function () {
         jQuery("iframe.stripe_checkout_app").attr("id", "stripe_checkout_id_for_selenium");
    }, []);
    browser.waitForElementVisible('#stripe_checkout_id_for_selenium', browser.globals.generalWaitingTime); //stripe pop up
    browser.frame('stripe_checkout_id_for_selenium');
    browser.expect.element('.Checkout').to.be.present.before(browser.globals.generalWaitingTime);
    utility.snapshotInIteration('convert-'+imageDifference+'8.png', browser, i);
    browser.execute(function () {
        document.querySelector("input[placeholder='Card number']").setAttribute("id", "stripe_selenium_card");
        document.querySelector("input[placeholder='MM / YY']").setAttribute("id", "stripe_selenium_date");
        document.querySelector("input[placeholder='CVC']").setAttribute("id", "stripe_selenium_cvc");
    }, []);

    browser.waitForElementVisible('#stripe_selenium_cvc', browser.globals.generalWaitingTime);
    browser.setValue('#stripe_selenium_card', '4242424242424242');
    browser.setValue('#stripe_selenium_date', '1024');
    browser.setValue('#stripe_selenium_cvc', '333');
    browser.click("button[type=submit]");
    browser.frame(null);
    browser.pause(3000);
    browser.waitForElementVisible('.bookingDetailsPayment', browser.globals.generalWaitingTime); //wait for success
    browser.pause(3000);
    browser.url(function(result) {
      console.log(result);
      var urlWithPaymentUUid = result.value;
      console.log(urlWithPaymentUUid);
      var found = urlWithPaymentUUid.match(/payment\/(.{36})/);
      var foundUuid = found[1];
      console.log(foundUuid);
      db.get('paymentUuidsToCancel')
        .push(foundUuid)
        .write();
        var tmp = db.get('paymentUuidsToCancel').value();

        console.log('after buy tmp from db');
        console.log(tmp);

    });
    browser.pause(20000);


}

function doIntroModel(browser){
    browser.waitForElementVisible('.introModalContent', browser.globals.generalWaitingTime);
    browser.click(".introModalContent .btn-primary");
    browser.pause(browser.globals.domGenerationTime);
    browser.click(".introModalContent .btn-primary");
    browser.click(".introModalContent .btn-primary");
    browser.click(".introModalContent .btn-primary");
    browser.waitForElementNotPresent('.introModalContent', browser.globals.generalWaitingTime);

}

function addConvertFlowCase (i){

  testCases[utility.testNamePrefix() +'Go to start page, iteration: ' + i] = function (browser) {
    if(cacheWindowAdoption){
      var msWindow = cacheWindowMin * 60 * 1000;
      browser.perform(function() {
        console.log("Will wait... due to cache window amount of min: " +cacheWindowMin);
      });
      browser.pause(msWindow);
    }

    browser.resizeWindow(browser.globals.win.width, browser.globals.win.height);

    browser.url(browser.globals.siteDomain +"?tester=" +browser.globals.testerName);
    browser.waitForElementVisible('.cc-window', browser.globals.generalWaitingTime);
    browser.execute(function () {
       jQuery('.cc-window').remove();
    }, []);
    browser.pause(5000);
    browser.deleteCookies(function() {});//for stripe
    browser.execute(function () {
       jQuery(window).scrollTop(jQuery('.timeSlotWrapper').eq(1).offset().top - (jQuery(window).height() / 2));
    }, []);
    browser.pause(browser.globals.generalScrollTime);
    utility.snapshotInIteration('firstTimeslot.png', i);
  };

  testCases[utility.testNamePrefix() +'Go to and will scroll through detail view, iteration: ' + i] = function (browser) {
    navigateToBookableTimeslot(browser, i);

    //todo new desing   //TODO USE CLICK i
    browser.waitForElementVisible('.rockstarDetailedWrapper', browser.globals.generalWaitingTime);
    if(i  === 1){
     utility.snapshotInIteration('convert-start.png', i);
      browser.execute(function () {
        jQuery(window).scrollTop(jQuery('.detailedTopBar').offset().top - (jQuery(window).height() / 2));
      }, []);
      browser.pause(browser.globals.generalScrollTime);
      utility.snapshotInIteration('convert-a.png', i);
      browser.execute(function () {
         jQuery(window).scrollTop(jQuery('.deal .ingress').offset().top - (jQuery(window).height() / 2));
      }, []);
      utility.snapshotInIteration('convert-b.png', i);
      browser.pause(browser.globals.generalScrollTime);
      browser.execute(function () {
         jQuery(window).scrollTop(jQuery('.buy .ticketsTitle').offset().top - (jQuery(window).height() / 2));
      }, []);
      browser.pause(browser.globals.generalScrollTime);
      utility.snapshotInIteration('convert-c.png', i);
      browser.execute(function () {
        jQuery(window).scrollTop(jQuery('.userEmailWrapper').offset().top - (jQuery(window).height() / 2));
      }, []);
      browser.pause(browser.globals.generalScrollTime);
      utility.snapshotInIteration('convert-d.png', i);
    }

  };

  // testCases[utility.testNamePrefix() +'Reload deal page and survives  , iteration: ' + i] = function (browser) {
  //   console.log('deal realoads');
  //   console.log(browser.globals.testSpecific.convertFlow.amountOfDealUrlreloads);
  //   for(var j = 1; j<=browser.globals.testSpecific.convertFlow.amountOfDealUrlreloads; j++){
  //     browser.perform(function() {
  //         console.log('Reload deal');
  //     });
  //
  //     browser.execute(function () {
  //      window.location.href = window.location.href;
  //     }, []);
  //     browser.pause(browser.globals.waitAfterNewUrlTime);
  //     browser.waitForElementVisible('.rockstarDetailedWrapper', browser.globals.generalWaitingTime);
  //     // browser.waitForElementVisible('.cc-dismiss', browser.globals.generalWaitingTime);
  //     // browser.click(".cc-dismiss");
  //     // browser.waitForElementNotVisible('.cc-dismiss', browser.globals.generalWaitingTime);
  //     browser.pause(browser.globals.survivesTime);
  //     browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
  //
  //   }
  //
  // };

  testCases[utility.testNamePrefix() +'Buy ticket, and will scroll trough success page, iteration: ' + i] = function (browser) {
    /*if(browser.globals.testSpecific.convertFlow.amountOfDealUrlreloads !== 0){
      doIntroModel(browser);
    }*/

    buy(browser,i, false);
    if(i  === 1){
        browser.saveScreenshot('convert-9.png');
        browser.execute(function () {
           jQuery(window).scrollTop(jQuery('.commitmentStatus').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-10.png');
        browser.execute(function () {
           jQuery(window).scrollTop(jQuery('.inviteBlockWrapper').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-11.png');
        browser.execute(function () {
           jQuery(window).scrollTop(jQuery('.eventInfoBlockContent').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-12.png');
    }

    browser.waitForElementVisible('.inviteFriendsBlock', browser.globals.generalWaitingTime);
    browser.execute(function () {
       jQuery(window).scrollTop(jQuery('.inviteFriendsBlock').offset().top - (jQuery(window).height() / 2));
    }, []);
    browser.click('.btn-linkCopy');
    browser.waitForElementVisible("#shareLinkInputBox", browser.globals.generalWaitingTime);
    browser.expect.element('#shareLinkInputBox').to.have.value.which.contains('join').before(browser.globals.generalWaitingTime);
    browser.getValue("#shareLinkInputBox", function(joinUrlObj) {
      joinUrl = joinUrlObj.value;
    });

  };

  testCases[utility.testNamePrefix() +'Reload, survives and scroll trough join booking url, iteration: ' + i] = function (browser) {
    console.log('reloads join');
    console.log(browser.globals.testSpecific.convertFlow.amountOfJoinBookingUrlReloads);
    for(var k = 1; k<=browser.globals.testSpecific.convertFlow.amountOfJoinBookingUrlReloads; k++){
      browser.perform(function() {
            console.log(joinUrl);
            console.log("Reload join booking");
        });
      browser.url(joinUrl+"?tester=" +browser.globals.testerName);

      browser.pause(browser.globals.waitAfterNewUrlTime);
      // browser.getTagName(".cc-dismiss", function(result) {
      //   console.log(result);
      //   if(result.status ===  'success'){
      //     browser.waitForElementVisible('.cc-dismiss', browser.globals.generalWaitingTime);
      //     browser.click(".cc-dismiss");
      //     browser.waitForElementNotVisible('.cc-dismiss', browser.globals.generalWaitingTime);
      //   }
      // });



      browser.waitForElementVisible(".joinBookingRockstarDetailed", browser.globals.generalWaitingTime);

      if(i  === 1 && k === 1){
        browser.saveScreenshot('convert-join-1.png');
        browser.execute(function () {
          jQuery(window).scrollTop(jQuery('.detailedTopBar').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-join-2.png');
        browser.execute(function () {
          jQuery(window).scrollTop(jQuery('.detailBoxWrapperPrice').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-join-3.png');
        browser.execute(function () {
          jQuery(window).scrollTop(jQuery('.hugeNumberBlock').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-join-4.png');

        browser.execute(function () {
          jQuery(window).scrollTop(jQuery('.userEmailWrapper').offset().top - (jQuery(window).height() / 2));
        }, []);
        browser.pause(browser.globals.generalScrollTime);
        browser.saveScreenshot('convert-join-5.png');
      }
      browser.pause(browser.globals.survivesTime);
      browser.perform(function() {
            console.log("Reload join booking survived at nr: " +k);
        });

      browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
    };

  };
  testCases[utility.testNamePrefix() +'Join event, iteration: ' + i] = function (browser) {
    browser
      .url(joinUrl +"?tester=" +browser.globals.testerName);


    browser.pause(browser.globals.waitAfterNewUrlTime);
    // browser.getTagName(".cc-dismiss", function(result) {
    //   console.log(result);
    //   if(result.status ===  'success'){
    //     browser.waitForElementVisible('.cc-dismiss', browser.globals.generalWaitingTime);
    //     browser.click(".cc-dismiss");
    //     browser.waitForElementNotVisible('.cc-dismiss', browser.globals.generalWaitingTime);
    //   }
    // });


    browser.waitForElementVisible(".joinBookingRockstarDetailed", browser.globals.generalWaitingTime);
    buy(browser, i, true);
    browser.pause(browser.globals.survivesTime);
    browser.expect.element(".bootstrapBlock.error-msg").to.not.be.present;
  };

  testCases[utility.testNamePrefix() +'End browser session, iteration: ' + i] = function (browser) {
    browser.end();
  }

}

testCases[utility.testNamePrefix() +'Cancel all bookings'] = function (browser) {
  amApi.cancelBookings();
};



module.exports  = testCases;
