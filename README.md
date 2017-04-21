# tester-intern

# Run tests via express
npm start
see server.js for available urls that start tests.
see test log outbut for a build e.g. localCodingBsBuild114b1b1316c91e3e via success/stdout/localCodingBsBuild114b1b1316c91e3e.txt


# Browserstack nodejs selenium automate tests without test intern express server
1 to run all tests with default enviroment: ./node_modules/nightwatch/bin/nightwatch
2.2 to run single test with default enviroment: ./node_modules/nightwatch/bin/nightwatch --test tests\demo.js --testcase "Test 1"
2.3. nightwatch --env "other_environment"
3. Documentation bs specifics with nightwatch: https://www.browserstack.com/automate/nightwatch
4. Documentation nightwatch: http://nightwatchjs.org/getingstarted#guide

#doc blumix deploy
https://console.ng.bluemix.net/docs/cli/reference/cfcommands/index.html#cf

# Deploy blumix http://test-intern-unsanded-megakaryoblast.eu-gb.mybluemix.net/
kill tests running properliy via url path: /kill .. and wait 300sek
make sure you have bumped package.json version and commited it.
make sure via ui that enviroment the following variables are true:  IS_REAL and IS_SERVER

https://api.eu-gb.bluemix.net
cf login -u patric.a.ogren@gmail.com -o actiMoreBlueMix -s actiMoreSpaceUK
cf app push test-intern

start the testes you want