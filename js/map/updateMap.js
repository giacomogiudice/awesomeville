define(["jquery","data/util","data/migration"],function($,util,migration) {
	var row = "", code = "";
    var arcs = [], bubbles = [], colors = [];
    
	function addArc(array,origin, destination){
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
                "strokeWidth": 2,//lineWidth(migration[global.year][row][i]),
                "strokeColor": strokeColor(global.year, origin, destination),//strokeColor(origin, destination, migration[global.year][row][i]),
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
    function strokeColor(year, origin, destination){
        
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


    

	return function() {
        
        var descriptionText = "Immigration from:<br/>";
        
        var cc = [];
        for(i in util.countrycodes){
            cc[util.countrycodes[i][0]] = util.countrycodes[i][1];
        }

        var code = global.id;
		global.map.svg.selectAll('path.datamaps-arc').remove();
		//prevent spurious calls
		
        row = util.countryorder.indexOf(code);
        if (row === -1) { console.log(code + " not found"); }
        else {
            arcs = [];
            for(i in getDataByYear(global.year)){

                //TODO: Add threshold function()
                if(getDataByYear(global.year)[row][i]>=1000){
                    addArc(arcs,row, i);
                    descriptionText += util.countryorder[i] + " " + getDataByYear(global.year)[row][i] + "<br/>";
                }
            }

            global.map.arc(arcs);
        }

        /*for(i in global.continent){
            console.log(coun);
        }*/
        
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
                case "AF": colors[cc[i]] = { fillKey: "africa" }; break;
                case "EU": colors[cc[i]] = { fillKey: "europe" }; break;
                case "NA": colors[cc[i]] = { fillKey: "north_america" }; break;
                case "SA": colors[cc[i]] = { fillKey: "south_america" }; break;
                case "AS": colors[cc[i]] = { fillKey: "asia" }; break;
                default: colors[cc[i]] = { fillKey: "default" };
            }
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