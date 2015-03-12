define(["jquery","data/util","data/migration"],function($,util,migration) {
	var row = "", code = "";
    var arcs = [], bubbles = [], colors = [];
    var cc = [];
    for(i in util.countrycodes){
        cc[util.countrycodes[i][0]] = util.countrycodes[i][1];
    }
    

	function addArc(array,origin, destination, value){
        var originCode = util.countryorder[origin];
        var destinationCode = util.countryorder[Number(destination)];
        array.push({
            "origin": {
                "latitude": util.positions[originCode][0],
                "longitude": util.positions[originCode][1],
            },
            "destination": {
                "latitude": util.positions[destinationCode][0],
                "longitude": util.positions[destinationCode][1],
            },
            "options": {
                "strokeWidth": 2,
                "strokeColor": strokeColor(value),
            }
        });
    };

    function addBubble(array,war) {
        var lat,lon,codes;
        codes = war.code.split(' / ');
                if(codes.length === 1) {
                    lat = util.positions[codes[0]][0];
                    lon = util.positions[codes[0]][1];
                }
                else {
                    for(var j in codes) {
                        lat += util.positions[codes[j]][0];
                        lon += util.positions[codes[j]][1];
                    }
                    lat /= codes.length;
                    lon /= codes.length;
                }
                bubbles.push({
                    "name": war.name,
                    "size": war.size,
                    "start": war.start,
                    "end": war.end,
                    "latitude": lat,
                    "longitude": lon,
                    "radius": Math.log(war.size/(1 + war.end - war.start)),
                    "fillKey": "defaultFill"
                });
    }

    //Decide how wide to draw a line
    function lineWidth(value){
        return 2; 
        //Old way: Math.log(migration[global.year][row][i]),
    }
    //Decide color of line on map
    function strokeColor(size){
        var choice;
        if(size <= 1000) { choice = 0; }
        else if(size <= 5000) { choice = 1; }
        else if(size <= 10000) { choice = 2; }
        else if(size <= 50000) { choice = 3; }
        else if(size <= 100000) { choice = 4; }
        else { choice = 5; }
        return util.linegradient[choice];
    }

    function getCountryId(code){
        return util.countryorder.indexOf(code);
    }
    //Make globals for startyear, endyear?
    function getDataByYear(year){
        return global.migrationData[(year-1960)/10];
    }

    function getThreshold(origin, X){
        var year = getLastAvailableYear(global.year);
        //O(XN) function to get Xth largest value
        var largestInRound = 10000000;
        var temp = +0;
        var v = -1; 
        for(var j = 0; j < X; j++ ){
            for( i in  getDataByYear(year)[origin]){
                t = getDataByYear(year)[origin][i]; 
                if( parseInt(t)>parseInt(temp) && parseInt(t)<parseInt(largestInRound) ){
                    temp = t;
                }
            }
            largestInRound=temp;
            t=0;
            temp=0;
        }
        return parseInt(largestInRound); 
    }
    
    function getLastAvailableYear(year){
        var temp = year; 
        while(true){
            if(global.yearAvailable[temp]==true){
                return temp; 
            } else if(global.yearAvailable[temp]==false){
                temp--; 
            } else{
                return 0; 
            }
        }
    }

	return function() {
        var year = getLastAvailableYear(global.year); 
        var descriptionText = "Immigration from:<br/>";

        // handle contry colors
        // colors is the object mapping countrycode -> color
        // if fillkeys are used you can use it to assign a {fillKey: , value: }
        colors = [];
        for (i in util.countryorder) {
            //console.log(util.countryorder[i]); 
            colors[util.countryorder[i]] = '#' + Math.floor(Math.random()*16777215).toString(16);
        }

        for(i in global.continent){
            //TODO: Add population variable to the colors
            switch(global.continent[i]) {
                case "AF": colors[cc[i]] = { fillKey: "africa", value: null}; break;
                case "EU": colors[cc[i]] = { fillKey: "europe", value: null }; break;
                case "OC": colors[cc[i]] = { fillKey: "oceania", value: null }; break;
                case "NA": colors[cc[i]] = { fillKey: "north_america", value: null }; break;
                case "SA": colors[cc[i]] = { fillKey: "south_america", value: null }; break;
                case "AS": colors[cc[i]] = { fillKey: "asia", value: null }; break;
                default: colors[cc[i]] = { fillKey: "default", value: null };
            }
        }
        var code = global.id;
		//global.map.svg.selectAll('path.datamaps-arc').remove();
		
        row = util.countryorder.indexOf(code);
        if (row === -1) { console.log(code + " not found"); }
        else {
            arcs = [];
            var threshold = getThreshold(row, 10);

            for(i in getDataByYear(year)){
                //TODO: Add threshold function()
                if(getDataByYear(year)[row][i]>=threshold){
                    addArc(arcs, row, i, getDataByYear(year)[row][i]);
                    colors[util.countryorder[i]].value = getDataByYear(year)[row][i];
                    descriptionText += util.countryorder[i] + " " + getDataByYear(year)[row][i] + "<br/>";
                }
            }
            global.map.arc(arcs);
        }

        global.map.updateChoropleth(colors);

        //handle bubbles;
        bubbles = [];
        for (i in global.war) {
            if(global.war[i].start >= year && global.war[i].start < year+10) {
                addBubble(bubbles,global.war[i]);
            }
        }
        global.map.bubbles(bubbles,global.map.options.bubblesConfig);
        
        $("#title").text(global.country); 
        $("#description").html(descriptionText);
	};
});