define(["jquery","data/util","data/migration"],function($,util,migration) {
	var row = "", code = "";
    var arcs = [];
	function addArc(array, origin, destination, row){
        console.log(origin, destination, row);
        array.push({
            "origin": {
                "latitude": util.positions[origin][0],
                "longitude": util.positions[origin][1],
            },
            "destination": {
                "latitude": util.positions[destination][0],
                "longitude": util.positions[destination][1],
            },
            "options": {
                "strokeWidth": 2,//lineWidth(migration[global.year][row][i]),
                "strokeColor": strokeColor(global.year, origin, destination),//strokeColor(origin, destination, migration[global.year][row][i]),
            }
        });
    };

    //Decide how wide to draw a line
    function lineWidth(value){
        return 2; 
        //Old way: Math.log(migration[global.year][row][i]),
    }
    //Decide color of line on map
    function strokeColor(year, origin, destination){
        //var value = getDataByYear(year)[origin][destination];
        console.log(year, origin, destination);
        console.log(getDataByYear(year));
        //console.log(getDataByYear(year)[origin][util.countryorder[destination]]);
        
        function RGBComponent() {
            return Math.round(Math.random() * 255);
        }
        return "rgba(" + RGBComponent() + "," + RGBComponent() + "," + RGBComponent() + ", 0.6)"; 
        // return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    function getCountryId(code){
        return util.countryorder.indexOf(code);
    }
    //Make globals for startyear, endyear?
    function getDataByYear(year){
        return global.migrationData[(year-1960)/10];
    }

	return function(geo) {
		global.map.svg.selectAll('path.datamaps-arc').remove();
		//prevent spurious calls
		if(!global.map || typeof geo.properties === "undefined") { return }
        global.country = geo.properties.name;
        code = geo.id;
        row = util.countryorder.indexOf(code);
        if (row === -1) { console.log(geo.id + " not found") }
        else {
            for(i in getDataByYear(global.year)){
                //console.log(getDataByYear(global.year)[i]);
                //TODO: Add threshold funciton()
                //console.log(code);
                var test = getDataByYear(global.year)[row][util.countryorder[i]];

                //console.log( test>=1000 );

                if(getDataByYear(global.year)[row][util.countryorder[i]]>=1000){
                    console.log("true");
                    addArc(arcs, code, util.countryorder[i], row);
                }
            }
            /* Old way
            for(i in migration[global.year][row]) {
                if(migration[global.year][row][i] >= 1000) {
                    //TODO: better threshold for drawing line
                    addArc(arcs, code, util.countryorder[i], row);
                }
            }*/
            global.map.arc(arcs);
       } 
	};

});