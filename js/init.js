define(["jquery","map/drawMap","map/updateMap", "jqueryui" ],
	function($,drawMap,updateMap) {
	$(function() {
		var w = $(window).width();
		var h = $(window).height();

		$("#mapContainer").height("100%");
        $( "#slider" ).slider({
            value:100,
            min: 1960,
            max: 2020,
            step: 10,
            slide: function( event, ui ) {
               console.log(ui.value);
            }
        });
	
		global.map = drawMap;
		updateMap(global.map);

	});
});