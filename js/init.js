define(["jquery","map/drawMap","map/updateMap", "jqueryui"],
	function($,drawMap,updateMap) {
	$(function() {
		var w = $(window).width();
		var h = $(window).height();

        $("#selectable").selectable();
        
        var yearAvailable = []; 
        for(var i =0; i<50; i++){
            if(i%10==0){
                global.yearAvailable[1960+i]=true;
            } else{
                global.yearAvailable[1960+i]=false;
            }
        }

        console.log(yearAvailable);
        
        $( "#slider" ).slider({
            value: 1970,
            min: 1960,
            max: 2000,
            step: 1,
            slide: function( event, ui ){
               global.year = ui.value;
               global.map.update();
            }
        });
		global.year=1970;

        global.map = drawMap;
	});
});