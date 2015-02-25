define(["jquery","d3","topojson","datamaps"],
	function($,d3,topojson,Datamap) {

	var map = new Datamap({
		element: $('#container')[0],
		projection: 'mercator',
		data: {},
		fills: { defaultFill: "#3498db"},
		geographyConfig: {
			highlightOnHover: false,
			popupTemplate: function(geo,data) {
				return '<div class="hoverlabel">' + geo.properties.name + '</div';
			}
		},
	});

	// Set zooming
	d3.select('.map').select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
	map.svg.call(d3.behavior.zoom().on("zoom", function() {
		map.svg.selectAll("g")
		.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}));

	//add onlick event
	map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
		// Handle click event
		console.log(geo.properties.name);
	});
	return map;

});