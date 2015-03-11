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

    function addBubble(array,name,code,radius) {
        array.push({
            "name": name,
            "latitude": util.positions[code][0],
            "longitude": util.positions[code][1],
            "radius": radius,
            "fillKey": "default"
        });
    }

    //Decide how wide to draw a line
    function lineWidth(value){
        return 2; 
        //Old way: Math.log(migration[global.year][row][i]),
    }
    //Decide color of line on map
    function strokeColor(size){
        if(size <= 1000) { return "rgba(114,118,121,0.6)"; }
        else if(size <= 5000) { return "rgba(131,104,105,0.6)"; }
        else if(size <= 10000) { return "rgba(149,50,50,0.6)"; }
        else if(size <= 50000) { return "rgba(166,75,75,0.6)"; }
        else if(size <= 100000) { return "rgba(184,62,58,0.6)"; }
        else { return "rgba(202,48,43,0.6)"; }
    }

    function getCountryId(code){
        return util.countryorder.indexOf(code);
    }
    //Make globals for startyear, endyear?
    function getDataByYear(year){
        return global.migrationData[(year-1960)/10];
    }


    

	return function() {
        
        var descriptionText = "Immigration from:<br/>";

        // handle contry colors
        // colors is the object mapping countrycode -> color
        // if fillkeys are used you can use it to assign a {fillKey: , value: }
        colors = [];
        for (i in util.countryorder) {
            console.log(util.countryorder[i]); 
            colors[util.countryorder[i]] = '#' + Math.floor(Math.random()*16777215).toString(16);
        } 
        for(i in global.continent){
            //TODO: Add population variable to the colors
            switch(global.continent[i]) {
                case "AF": colors[cc[i]] = { fillKey: "africa", value: null}; break;
                case "EU": colors[cc[i]] = { fillKey: "europe", value: null }; break;
                case "NA": colors[cc[i]] = { fillKey: "north_america", value: null }; break;
                case "SA": colors[cc[i]] = { fillKey: "south_america", value: null }; break;
                case "AS": colors[cc[i]] = { fillKey: "asia", value: null }; break;
                default: colors[cc[i]] = { fillKey: "default", value: null };
            }
        }

        var code = global.id;
		global.map.svg.selectAll('path.datamaps-arc').remove();
		
		
        row = util.countryorder.indexOf(code);
        if (row === -1) { console.log(code + " not found"); }
        else {
            arcs = [];
            for(i in getDataByYear(global.year)){

                //TODO: Add threshold function()
                if(getDataByYear(global.year)[row][i]>=1000){
                    addArc(arcs, row, i, getDataByYear(global.year)[row][i]);
                    colors[util.countryorder[i]].value = getDataByYear(global.year)[row][i];
                    descriptionText += util.countryorder[i] + " " + getDataByYear(global.year)[row][i] + "<br/>";
                }
            }

            global.map.arc(arcs);
        }

        global.map.updateChoropleth(colors);
        //handle bubbles;
        bubbles = [];
        for (i in util.countryorder) {
            if(Math.random() <0.05) addBubble(bubbles,"",util.countryorder[i],Math.random()*50);
        }
        global.map.bubbles(bubbles);
        $("#title").text(global.country); 
        $("#description").html(descriptionText);
	};

});