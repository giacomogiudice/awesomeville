define(["jquery","d3","topojson","datamaps", "jqueryui"],
	function($,d3,topojson,Datamap) {

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
		var sweLines = [
        {
            origin: {
                latitude: 59.17,
                longitude: 14.0
            },
            destination: {
                latitude: 41.50,
                longitude: 85.37
            }
        },
                {
            origin: {
                latitude: 59.17,
                longitude: 14.0
            },
            destination: {
                latitude: 20.26 ,
                longitude: 80.42
            }
        }
    ];

    var norLines = [
        {
            origin: {
                latitude: 60.00,
                longitude: 10.0
            },
            destination: {
                latitude: 41.50,
                longitude: -87.37
            }
        },
                {
            origin: {
                latitude: 60.00,
                longitude: 10.0
            },
            destination: {
                latitude: 40.26 ,
                longitude: -4.42
            }
        }
    ];
                if(geo.properties.name == 'Sweden'){
                	
                  map.svg.selectAll('path.datamaps-arc').remove()
                  map.arc( sweLines, {strokeWidth: 2});                 
                }
                if(geo.properties.name == 'Norway'){
                  map.svg.selectAll('path.datamaps-arc').remove()
                  map.arc( norLines, {strokeWidth: 2});
                }  
		console.log(geo.properties.name);
	});
	return map;

});
