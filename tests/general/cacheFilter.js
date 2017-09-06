var https = require('https');
var utility = require('../../utility/utility');
var amApi = require('../../utility/amApi');
const Combinatorics = require('js-combinatorics');
var zlib = require("zlib");
var Promise = require("bluebird");
var moment = require('moment');

var supply = {};
var actualFilterData;
var testCases = {};
var supplyUrl = 'https://www.actimore.com/api/supply/tmp?apiVersion=1&lang=sv_SE&requestUuid=00000000-0000-0000-0000-000000000000';
var cmb, a, alternatives = [];
var defaultFilterData = {"nrElementsPerBatch":12,"userInputFilter":{"cityLocationUuid":"106ee161-f9ef-412f-a17b-4e43d4ec5fad","cityLocationUuidDefault":false,"ownerUuids":[],"facilityUuids":[],"resourceUuids":[],"dealUuids":[],"activityGroupTypeUuids":[],"activityTypeUuids":[],"urlFilterPathParams":{"deals":{"cityLocation":"stockholm","activityGroupType":null,"activityType":null},"dealsByBrand":null},"dealLimitationPerTimeUnit":0,"dealLimitationInTotal":1,"onlyStared":false,"priceInterval":{"minLimit":0,"maxLimit":1000},"nrParticipantsInterval":{"minLimit":2,"maxLimit":30,"fixedLimit":0},"timeIntervals":[],"geographicalAreas":[],"daysOfWeek":[],"timeUnit":"DAY","seed":{"nrPerTimeUnit":25,"seedNr":0},"appointmentsBasedOnSlotAndDeal":[]}}
var dataParam = '?data=' + encodeURIComponent(JSON.stringify(defaultFilterData));
var langParam = '&lang=sv_SE';
var requestUuidParam = '&requestUuid=00000000-0000-0000-0000-000000000000';
var apiVersionParam = '&apiVersion=1';
var initMarketPlaceUrl = 'https://www.actimore.com/api/init-marketplace' + dataParam + langParam + requestUuidParam + apiVersionParam;


//console.log(encodeURIComponent(JSON.stringify(defaultFilterDData)));

  function getSupply(url, callback) {
    // buffer to store the streamed decompression
      var buffer = [];

      https.get(url, function(res) {
          // pipe the response into the gunzip to decompress
          var gunzip = zlib.createGunzip();            
          res.pipe(gunzip);

          gunzip.on('data', function(data) {
              // decompression chunk ready, add it to the buffer
              buffer.push(data.toString())

          }).on("end", function() {
              // response and decompression complete, join the buffer and return
              callback(null, buffer.join("")); 

          }).on("error", function(e) {
              callback(e);
          })
      }).on('error', function(e) {
          callback(e)
      });
  };

  function getInitMarketplaceFilter(url, callback){
    var buffer = [];

      https.get(url, function(res) {
          // pipe the response into the gunzip to decompress
          var gunzip = zlib.createGunzip();            
          res.pipe(gunzip);

          gunzip.on('data', function(data) {
              // decompression chunk ready, add it to the buffer
              buffer.push(data.toString())

          }).on("end", function() {
              // response and decompression complete, join the buffer and return
              callback(null, buffer.join("")); 

          }).on("error", function(e) {
              callback(e);
          })
      }).on('error', function(e) {
          callback(e)
      });
  }

  function makeFilterReq(url, callback){
        //console.log(url);
        https.get(url, function(res) {
          callback(res)
        });  
  };
  function prepareFilter(filter){
    var newFilter = filter;

    var fromDate = moment().startOf('day');
    var from = {
      "YYYY": fromDate.format("YYYY"),
      "MM": fromDate.format("MM"),
      "DD": fromDate.format("DD"),
      "HH": fromDate.format("HH"),
      "mm": fromDate.format("mm")
    };

    var toDate = moment().add(2, 'months').startOf('day');
    var to = {
      "YYYY": toDate.format("YYYY"),
      "MM": toDate.format("MM"),
      "DD": toDate.format("DD"),
      "HH": fromDate.format("HH"),
      "mm": fromDate.format("mm")
    };
    newFilter.userInputFilter.fromCompareCode = from;
    newFilter.userInputFilter.filterFromCompareCode = from;
    newFilter.userInputFilter.toCompareCode = to;
    newFilter.userInputFilter.filterToCompareCode = to;

    return newFilter;
  }

  getSupply(supplyUrl, function(err, data) {
    if(err == null){
      supply = JSON.parse(data);

      supply.activityTypeList.forEach(function(type){
        alternatives.push(type.uuid);
      }); 

      

      getInitMarketplaceFilter(initMarketPlaceUrl, function(err, data) {
        if(err == null){
          actualFilterData = JSON.parse(data).actualFilterData;
          actualFilterData = prepareFilter(actualFilterData);
          //console.log(actualFilterData);

          cmb = Combinatorics.power(alternatives);
          cmb.forEach(function(a){ 
            var currentFilterData = actualFilterData;
            currentFilterData.userInputFilter.activityTypeUuids = a;

            console.log('filter');
            console.log(currentFilterData.userInputFilter);

            var timeSlotsUrl = 'https://www.actimore.com/api/timeslots';
            var dataParam = '?data=' + encodeURIComponent(JSON.stringify(currentFilterData));
            var langParam = '&lang=sv_SE';
            var requestUuidParam = '&requestUuid=00000000-0000-0000-0000-000000000000';
            var apiVersionParam = '&apiVersion=1';
            var url = timeSlotsUrl + dataParam + langParam + requestUuidParam + apiVersionParam;

            makeFilterReq(url, function(res){
              console.log('MAKEFILTERREQ DONE');
              //console.log(res);
            });
          });
        }
      });      
    }
  });


/*
  var amountOfActivities = 4;
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
  cmb.forEach(function(a){ console.log(a) }); */
  



  //  []
  //  ["a"]
  //  ["b"]
  //  ["a", "b"]
  //  ["c"]
  //  ["a", "c"]
  //  ["b", "c"]
  //  ["a", "b", "c"]

