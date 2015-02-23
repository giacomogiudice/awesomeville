define(["jquery","map/drawMap","map/updateMap"],
	function($,map,updateMap) {
	$(function() {
		updateMap(map);
	});
});