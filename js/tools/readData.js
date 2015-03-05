define(["jquery","d3","topojson","datamaps", "jqueryui","data/util","data/migration"],
	function($,d3){
		//TODO: replace with relative link when we are that far.
		var dataByYear=[];
		var firstYear = 1960; 
		var lastYear = 2000; 
		var interval = 10;

		for(var i = firstYear; i <= lastYear; i+= interval){
        	var yearString = i.toString();
        	console.log(yearString);

			d3.csv("http://giacomogiudice.github.io/awesomeville/rawdata/"+yearString+".csv", function(data) {
	        	//dataByYear[yearString]=data;
	        	dataByYear.push(data);
        	});
		}
	});
