define(["jquery","d3","topojson","datamaps", "jqueryui","map/updateMap", "readdata"],
	function($,d3,topojson,Datamap,jqueryui,updateMap) {

    var map = new Datamap({
        element: $('#mapContainer')[0],
        width: $("#container").width()* 0.75,
        projection: 'mercator',
        data: {},
        fills: { 
            defaultFill: "#333333",
            // continents
            africa: "#f39c12",
            europe: "#2980b9",
            oceania: "#16a085",
            north_america: "#e74c3c",
            south_america: "#2ecc71",
            asia: "#9b59b6",       
        },
        geographyConfig: {
            highlightOnHover: false,
            popupTemplate: function(geo,data) {
                if(data === null || data.value === null) { 
                    return '<div class="hoverlabel">' + geo.properties.name + '</div>';
                }
                else {
                    return '<div class="hoverlabel">' + geo.properties.name + '<br/>' + Math.round(data.value/1000)+ 'K </div>'
                }
            }
        },
        bubblesConfig: {
            highlightOnHover: false,
            borderWidth: 0,
            borderColor: 'red',
            fillOpacity: 0.75,
            popupTemplate: function(geo,data) {
                return '<div class="hoverlabel">' + data.name + '<br/>' +
                    Math.round(data.size/1000) + " thousand casualties between " + data.start + " and " + data.end + '</div>';
            }
        }
    });

	// Set zooming
	 // Fuck Zooming. 
 //    d3.select('.map').select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
	// map.svg.call(d3.behavior.zoom().on("zoom", function() {
	// 	map.svg.selectAll("g")
	// 	.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	// }));
  
    map.update = function() { updateMap(); } 

	//add onlick event
	map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
        global.country = geo.properties.name;
        global.id = geo.id;
        map.update();
    });

    return map;

});
