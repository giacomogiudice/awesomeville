define(["jquery","data/util","data/migration"],function($,util,migration) {
	var row = "", code = "";
    var arcs = [];
	function addArc(array, origin, destination, row){
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
                "strokeWidth": lineWidth(migration[global.year][row][i]),
                "strokeColor": strokeColor(origin, destination, migration[global.year][row][i]),
            }
        });
    };

    //Decide how wide to draw a line
    function lineWidth(value){
        return 2; 
        //Old way: Math.log(migration[global.year][row][i]),
    }
    //Decide color of line on map
    function strokeColor(origin, destination, value){
        function RGBComponent() {
            return Math.round(Math.random() * 255);
        }
        return "rgba(" + RGBComponent() + "," + RGBComponent() + "," + RGBComponent() + ", 0.6)"; 
        // return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

	return function(geo) {
		map.svg.selectAll('path.datamaps-arc').remove();
		//prevent spurious calls
		if(!global.map || typeof geo.properties === "undefined") { return }
        global.country = geo.properties.name;
        code = geo.id;
        row = util.countryorder.indexOf(code);
        if (row === -1) { console.log(geo.id + " not found") }
        else {
            for(i in migration[global.year][row]) {
                if(migration[global.year][row][i] >= 1000) {
                    //TODO: better threshold for drawing line
                    addArc(arcs, code, util.countryorder[i], row);
                }
            }
            global.map.arc(arcs);
       } 
	};
});