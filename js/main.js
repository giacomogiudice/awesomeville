require.config({
	paths: {
		"readdata": "tools/readData",
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
		"d3": "http://d3js.org/d3.v3.min",
		"topojson": "http://d3js.org/topojson.v1.min",
		"datamaps": "lib/datamaps.world.min",
		"jqueryui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min"
	},
	shim: {
		d3: {
			exports: 'd3'
		},
		topojson: {
			deps: ['d3'],
			exports: 'topojson'
		},
		datamaps: {
			deps: ['d3', 'topojson']
		},
		jqueryui: {
			deps: ['jquery'],
			exports:"$"
		}
	}
});
requirejs(["init"]);