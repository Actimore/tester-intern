var request = require('request');
var utility = require('../../utility/utility');
var amApi = require('../../utility/amApi');
const Combinatorics = require('js-combinatorics');
var testCases = {};

testCases['Cache filter'] = function (browser) {
  var cmb, a, alternatives = [];

  var amountOfActivities = 2;
  var amountOfAres = 2;
  var amountOfDays = 1;
  var amountOfHourIntervals = 1;

  for (var i = 1; i <= amountOfActivities; i++) {
    alternatives.push('activity-' + i);
  }
  for (var i = 1; i <= amountOfAres; i++) {
    alternatives.push('area-' + i);
  }
  for (var i = 1; i <= amountOfDays; i++) {
    alternatives.push('day-' + i);
  }
  for (var i = 1; i <= amountOfHourIntervals; i++) {
    alternatives.push('hourIntervals' + i);
  }

  console.log(alternatives);

  cmb = Combinatorics.power(alternatives);
  console.log(cmb.length);
  cmb.forEach(function(a){ console.log(a) });
  //  []
  //  ["a"]
  //  ["b"]
  //  ["a", "b"]
  //  ["c"]
  //  ["a", "c"]
  //  ["b", "c"]
  //  ["a", "b", "c"]
};



module.exports  = testCases;
