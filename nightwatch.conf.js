//settings
var commonSettings = {
  siteDomain: "https://demo.actimore.com",
  cookieDomain: "demo.actimore.com",
  generalWaitingTime: 120000, 
  generalScrollTime: 5000, 
  survivesTime: 100,
  domGenerationTime: 3000,
  waitAfterNewUrlTime: 3000,
  snapshotEnabled:  true, 
  testSpecific: {
    convertFlow: {
      amountOfDealUrlreloads: 10,
      amountOfJoinBookingUrlReloads: 10,
    }, 
    startPage: {
      amountOfFilterIterations: 2
    },
    reloadableAndSurvives: {
      amountOfReloadUrls: 2
    }  
  }
};

var commonCapabilities = {
  bsUser: 'patricgren2',
  bsKey: 'WF3ChxyK2xss3TEQA7DR',
  bsDebug: true
};

var projectName = 'actimoreBeta6';


var S4 = function () {
  return (
  ((1 + Math.random()) * 0x10000) || 0).toString(16).substring(0, 4);
};
var testerName = function(){

  var tn = process.env.IS_SERVER ?  'server' : 'local'
  tn += process.env.IS_REAL ?  'Real' : 'Coding' 
  tn += 'NonExpress' + "BsBuild" +S4()+S4()+S4()+S4();

  var res = process.env.BS_BUILD || tn;
  return res;
}();


var nightwatch_config = {


  selenium : {
    "start_process" : false,
    "host" : "hub-cloud.browserstack.com",
    "port" : 80
  },



  test_settings: {
    default: {
      src_folders : [ "tests/general", 'tests/gte768'],
      "globals": {
          siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: true, 
            lt768: false
          } , 
          testerName: testerName,
          win: {
            width: 1800,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
          'os': 'OS X',
          'os_version': 'Yosemite',
          'browserName': 'Chrome',
          'browser_version': '56.0',
          'resolution': '1920x1080', 
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    },
      mac_safari_8: {
        src_folders : [ "tests/general", 'tests/gte768'],
        "globals": {
          siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: true, 
            lt768: false
          } , 
          testerName: testerName,
          win: {
            width: 1800,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
           'browserName' : 'Safari',
           'browser_version' : '8.0',
           'os' : 'OS X',
           'os_version' : 'Yosemite',
           'resolution' : '1920x1080',
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    },
    mac_safari_10: {
        src_folders : [ "tests/general", 'tests/gte768'],
        "globals": {
          siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: true, 
            lt768: false
          } , 
          testerName: testerName,
          win: {
            width: 1800,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
          'browserName' : 'Safari',
          'browser_version' : '10.0',
          'os' : 'OS X',
          'os_version' : 'Sierra',
          'resolution' : '1920x1080',
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    },
    win_ff_52: {
        src_folders : [ "tests/general", 'tests/gte768'],
        "globals": {
          siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: true, 
            lt768: false
          } , 
          testerName: testerName,
          win: {
            width: 1800,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
           'browserName' : 'Firefox',
           'browser_version' : '52.0',
           'os' : 'Windows',
           'os_version' : '10',
           'resolution' : '1920x1080',
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    },
      win_ie_11: {
        src_folders : [ "tests/general", 'tests/gte768'],
        "globals": {
          siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: true, 
            lt768: false
          } , 
          testerName: testerName,
          win: {
            width: 1800,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
           'browserName' : 'IE',
           'browser_version' : '11.0',
           'os' : 'Windows',
           'os_version' : '10',
           'resolution' : '1920x1080',
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    },
    screen_width_lt768: {
      src_folders : [ "tests/general", "test/lt768" ],
      "globals": {
         siteDomain: commonSettings.siteDomain,
          cookieDomain: commonSettings.cookieDomain,
          generalWaitingTime: commonSettings.generalWaitingTime, 
          generalScrollTime: commonSettings.generalScrollTime, 
          survivesTime: commonSettings.survivesTime,
          domGenerationTime: commonSettings.domGenerationTime,
          waitAfterNewUrlTime: commonSettings.waitAfterNewUrlTime,
          snapshotEnabled: commonSettings.snapshotEnabled, 
          testSpecific: {
            convertFlow: {
              amountOfDealUrlreloads: commonSettings.testSpecific.convertFlow.amountOfDealUrlreloads,
              amountOfJoinBookingUrlReloads: commonSettings.testSpecific.convertFlow.amountOfJoinBookingUrlReloads,
            }, 
            startPage: {
              amountOfFilterIterations: commonSettings.testSpecific.startPage.amountOfFilterIterations
            },
            reloadableAndSurvives: {
              amountOfReloadUrls: commonSettings.testSpecific.reloadableAndSurvives.amountOfReloadUrls
            }
          },
          screenLimits: {
            gte768: false, 
            lt768: true
          },  
          testerName: testerName,
          win: {
            width: 700,
            height: 1000
          }, 
      },
      desiredCapabilities: {
          'browserstack.user': commonCapabilities.bsUser,
          'browserstack.key': commonCapabilities.bsKey,
          'os': 'OS X',
          'os_version': 'Yosemite',
          'browser': 'Chrome',
          'browser_version': '56.0',
          'resolution': '1024x1024', 
          'browserstack.debug': commonCapabilities.bsDebug,
          'project': projectName, 
          'build': testerName
      }
    }
    
  }
};

console.log('Broserstack build name and testerName' +testerName);

for(var i in nightwatch_config.test_settings){
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
 