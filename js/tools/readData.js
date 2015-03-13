define(["jquery","d3","topojson","datamaps", "jqueryui","map/util"],
	function($,d3){

		//TODO: replace with relative link when we are that far.
		var dataByYear=[];
		var firstYear = 1960; 
		var lastYear = 2000; 
		var interval = 10;
		var dataLoaded = false;
		var continent = [];
		
		for(var i = firstYear; i <= lastYear; i+= interval){
        	var yearString = i.toString();

			d3.text("http://giacomogiudice.github.io/awesomeville/raw/"+yearString+".csv", function(text){
				dataByYear.push( d3.csv.parseRows(text) );
				if( (lastYear-firstYear)/interval == dataByYear.length ){
	        		dataLoaded=true;
	        		global.migrationData = dataByYear;
	        	}
			});
		}

		d3.csv("http://giacomogiudice.github.io/awesomeville/raw/GDP.csv", function(d){
			global.gdpData = d; 
		});


		d3.csv("http://giacomogiudice.github.io/awesomeville/raw/countryByContinent.csv", function(d){
			$.each(d, function(index, value){
				if(value["Africa"]!=""){
					continent[value["Africa"]]="AF"; 
				}
				if(value["Europe"]!=""){
					continent[value["Europe"]]="EU"; 
				}
				if(value["Asia"]!=""){
					continent[value["Asia"]]="AS"; 
				}
				if(value["North America"]!=""){
					continent[value["North America"]]="NA"; 
				}
				if(value["South America"]!=""){
					continent[value["South America"]]="SA"; 
				}
				if(value["Oceania"]!=""){
					continent[value["Oceania"]]="OC"; 
				}
				global.continent = continent;
			});
		});


		d3.csv("http://giacomogiudice.github.io/awesomeville/raw/warData.csv", function(d){
			return {
				name: d["Name of War"],
				code: d["Country code"],
				start: +d["Start year"],
				end: +d["End year"],
				size: +d["Fatalities"]
			};
		}, function(error, rows) {
  		global.war = rows;
	});

});

