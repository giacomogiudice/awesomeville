define(["jquery","d3","topojson","datamaps", "jqueryui","data/util","data/migration"],
	function($,d3){
		var _1960; 
		d3.csv("../rawdata/1960.csv", function(data) {
        	_1960=data;
        	console.log(_1960);
        });

		console.log("readData");
	});
