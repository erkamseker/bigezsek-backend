var dbHelper = require('./dbHelper');
var nearBySearch = require("googleplaces")("AIzaSyAZEViKGUsEJ-2byueG2TktfWPFoXPoayg","json").nearBySearch;

var getNearbyPlaces = function(location, radius, callback){
	params = {
        location: location,
        radius: radius,
        keyword: "amusement_park|art_gallery|bowling_alley|movie_theater|cafe|night_club|museum|park|casino|zoo|university",
    };

	nearBySearch(params, function (error, response) {
        if (error) throw error;
        var place_ids = [];
        response.results.forEach(function(poi){
        	place_ids.push(poi.place_id);
        });
        dbHelper.getHangouts(place_ids, function(hangouts){
        	hangouts.forEach(function(hangout){
        		var mapsObj = getById(hangout.place, response.results);
        		if(mapsObj != null){
        			mapsObj[hangout.hour + "_users"] = hangout.users;
        			mapsObj.date = hangout.date;
        		}
        	});
        });
        console.log(response.results);
    	callback(response.results);
    });
}

var getById = function (id, myArray) {
    return myArray.filter(function(obj) {
      if(obj.place_id == id) {
        return obj; 
      }
    })[0];
  }

exports.getNearbyPlaces = getNearbyPlaces;