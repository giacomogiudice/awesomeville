define(["jquery","d3","topojson","datamaps", "jqueryui","data/util","data/migration"],
	function($,d3,topojson,Datamap,jqueryui,util,migration) {

    /* This is how you would bind an event to the slider from here,
    NOTE: you have to remove the event bound when the slider is created,
    in init.js to be able to do it from here. 
    $( "#slider" ).slider({
      slide: function( event, ui ) {
        console.log(ui.value*2);
      }
      });*/
    var map = new Datamap({
        element: $('#mapContainer')[0],
        projection: 'mercator',
        data: {},
        fills: { defaultFill: "#3498db"},
        geographyConfig: {
            highlightOnHover: false,
            popupTemplate: function(geo,data) {
                return '<div class="hoverlabel">' + geo.properties.name + '</div>';
            }
        },
    });

	// Set zooming
	/* Fuck Zooming. 
    d3.select('.map').select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
	map.svg.call(d3.behavior.zoom().on("zoom", function() {
		map.svg.selectAll("g")
		.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}));*/

    //TODO: Sane coloring, remove row argument, replace with better solution
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
                "strokeColor": strokeColor(origin, destination, migration[global.year][row][i])
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
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

	//add onlick event
	map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
        map.svg.selectAll('path.datamaps-arc').remove();
        var row = "", code = "";
        var arcs = []
        global.country = geo.properties.name;
        for(i in util.countrycodes) {
            if(global.country === util.countrycodes[i][0]) {
                code = util.countrycodes[i][1];
                row = util.countryorder.indexOf(code);
            }
        }
        if (row === "") {
            if(Math.random() < 0.3 || $(window).width() > 2000) $("#lol").show().animate({left: "990"},4000,function(){$("#lol").hide().css({left: -320})});
            else console.log(global.country + " not found");

        }
        else {
            for(i in migration[global.year][row]) {
                if(migration[global.year][row][i] ) {
                    if(util.positions[util.countryorder[i]]) { //SUPER HACKY
                        
                        //TODO: better threshold for drawing line
                        if(migration[global.year][row][i]>1000){
                            addArc(arcs, code, util.countryorder[i], row);
                        }
                        /* Old line adding code, remove when properly replaced
                        arcs.push({
                            "origin": {
                                "latitude": util.positions[code][0],
                                "longitude": util.positions[code][1],
                            },
                            "destination": {
                                "latitude": util.positions[util.countryorder[i]][0],
                                "longitude": util.positions[util.countryorder[i]][1],
                            },
                            "options": {
                                "strokeWidth": Math.log(migration[global.year][row][i]),
                                "strokeColor": '#'+Math.floor(Math.random()*16777215).toString(16)
                            }
                        });*/
                    }
                } 

            }
            map.arc(arcs);
        }
    });

    $("body").append('<img id="lol" src="img/omg-cat.gif" style="position:absolute;top:50px;left:-320px;z-index:+999"/>')
    $("#lol").hide();
    // if(geo.properties.name == 'Sweden'){

    //   map.svg.selectAll('path.datamaps-arc').remove()
    //   map.arc( sweLines, {strokeWidth: 2});                 
    // }
    // if(geo.properties.name == 'Norway'){
    //   map.svg.selectAll('path.datamaps-arc').remove()
    //   map.arc( norLines, {strokeWidth: 2});
    // }  
    // console.log(geo.properties.name);
    return map;

});
