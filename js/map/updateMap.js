define(["jquery","map/util"],function($,util) {
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
        var lat = 0,lon = 0;
        var codes;
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
        array.push({
            "name": war.name,
            "size": war.size,
            "start": war.start,
            "end": war.end,
            "latitude": lat,
            "longitude": lon,
            "radius": 2*Math.log(war.size/(1 + war.end - war.start)),
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

    function getEmigrationThreshold(origin, X){
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

    function getImmigrationThreshold(origin, X){
        var year = getLastAvailableYear(global.year);
        //O(XN) function to get Xth largest value
        var largestInRound = 10000000;
        var temp = +0;
        var v = -1; 
        for(var j = 0; j < X; j++ ){
            for( i in  getDataByYear(year)[origin]){
                t = getDataByYear(year)[i][origin]; 
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

    function getMaxGdp(){
        var temp = 0; 
        for (i in global.gdp){
            if(parseInt(global.gdp[i])>parseInt(temp)){
                temp=global.gdp[i]; 
            }
        }
        return parseInt(temp); 
    }

    function getColor(continent, value){
        //console.log(value);
        var temp = value; 
        //console.log("rgba(0,255,0,"+temp+")");
        switch(continent) {
            case "AF": return "rgba(127,168,44,"+temp+")"; 
            case "EU": return "rgba(162,96,166,"+temp+")";
            case "OC": return "rgba(168,44,44,"+temp+")";
            case "NA": return "rgba(44,125,168,"+temp+")";
            case "SA": return "rgba(168,44,94,"+temp+")";
            case "AS": return "rgba(227,223,11,"+temp+")";
            default:  return "rgba(0,0,0,"+temp+")";;
        }
        return "rgba(255, 255, 255, 1)"; 
    }


	return function() {
        var year = getLastAvailableYear(global.year); 
        var descriptionText = (global.emigration)? "Emigration to:<br/>" : "Immigration from:<br/>";

        // handle contry colors
        // colors is the object mapping countrycode -> color
        // if fillkeys are used you can use it to assign a {fillKey: , value: }
        colors = [];
        for (i in util.countryorder) {
            colors[util.countryorder[i]] = 'red';
        }
        
        var maxSaturation = getMaxGdp(); 
        var saturation = 0;
        var code = ""; 
        for(i in global.continent){

            //TODO: base saturation on something inteligent?
            saturation = parseInt(global.gdp[cc[i]])/parseInt(maxSaturation);
            if(isNaN(saturation)){
                saturation=1;
            } else{
                saturation=1; 
            }

            //TODO: Add population variable to the colors
            switch(global.continent[i]) {
                case "AF": colors[cc[i]] = { color: getColor("AF", saturation), value: null}; break;
                case "EU": colors[cc[i]] = { color: getColor("EU", saturation), value: null}; break;
                case "OC": colors[cc[i]] = { color: getColor("OC", saturation), value: null}; break;
                case "NA": colors[cc[i]] = { color: getColor("NA", saturation), value: null}; break;
                case "SA": colors[cc[i]] = { color: getColor("SA", saturation), value: null}; break;
                case "AS": colors[cc[i]] = { color: getColor("AS", saturation), value: null}; break;
                default: colors[cc[i]] = { fillKey: "default", value: null };
            }
        }
        var threshold = 0; 
        var code = global.id;
		//global.map.svg.selectAll('path.datamaps-arc').remove();
		if(global.emigration==true){
            row = util.countryorder.indexOf(code);
            if (row !== -1) {
                arcs = [];




                threshold = getEmigrationThreshold(row, 8);
                if (threshold<1){
                    threshold=1; 
                }

                for(i in getDataByYear(year)){
                    //TODO: Add threshold function()

                    if(getDataByYear(year)[row][i]>=threshold){
                        //Random changes to show that emigration changes
                        if(global.year==$("#slider").slider("option", "value")){
                            getDataByYear(year)[row][i]=parseInt(getDataByYear(year)[row][i])+parseInt(Math.random())*1000-500; 

                        }
                        if(getDataByYear(year)[row][i]<0){
                            getDataByYear(year)[row][i]=0; 
                        }

                        addArc(arcs, row, i, getDataByYear(year)[row][i]);
                        colors[util.countryorder[i]].value = getDataByYear(year)[row][i];
                        descriptionText += util.countryorder[i] + " " + getDataByYear(year)[row][i] + "<br/>";
                    }
                }
                global.map.arc(arcs);
            }
        } else{
            row = util.countryorder.indexOf(code);
            if (row !== -1) {
                arcs = [];
                threshold = getImmigrationThreshold(row, 10);
                if (threshold<1){
                    threshold=1; 
                }

                for(i in getDataByYear(year)){

                    //TODO: Add threshold function()
                    if(getDataByYear(year)[i][row]>=threshold){

                        //Random changes to show that emigration changes
                        if(global.year==$("#slider").slider("option", "value")){
                            getDataByYear(year)[row][i]=parseInt(getDataByYear(year)[row][i])+parseInt(Math.random())*100-50; 

                        }
                        if(getDataByYear(year)[row][i]<0){
                            getDataByYear(year)[row][i]=0; 
                        }

                        addArc(arcs, i, row, getDataByYear(year)[i][row]);
                        colors[util.countryorder[row]].value = getDataByYear(year)[i][row];
                        descriptionText += util.countryorder[i] + " " + getDataByYear(year)[i][row] + "<br/>";
                    }
                }
                global.map.arc(arcs);
            }
        }


        global.map.updateChoropleth(colors);

        //handle bubbles;
        bubbles = [];
        for (i in global.war) {
            if(global.war[i].start <= global.year && global.war[i].end >= global.year) {
                addBubble(bubbles,global.war[i]);
            }
        }
        global.map.bubbles(bubbles,global.map.options.bubblesConfig);

        $("#title").text(global.country);
        $("#description").html(descriptionText);
	};
});