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
        
        function setGdp(year){
            for(i in global.gdpData){
               //global.gdp[global.gdpData[i][] ]
                global.gdp[global.gdpData[i]["Country Code"]]=global.gdpData[i][year];
                //console.log(year); 
                //console.log(global.gdpData[i][year]);

            }
        }

        $( "#slider" ).slider({
            value: 1970,
            min: 1960,
            max: 2001,
            step: 1,
            slide: function( event, ui ){
                global.year = ui.value;
                setGdp(ui.value); 
                global.map.update();

               var currentSliderValue = $("#slider").slider("option", "value");
	       //console.log(currentSliderValue);
	       $("#currentSliderValue").html(currentSliderValue);
            }
        });

		global.year=1970;
        setGdp(); 

        global.map = drawMap;
	});
});
