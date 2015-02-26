define(["jquery","map/drawMap","map/updateMap"],
	function($,drawMap,updateMap) {
	$(function() {
		var w = $(window).width();
		var h = $(window).height();

		$("#container").height(0.9 * h);

		var map = drawMap;
		updateMap(map);
		
	});
});