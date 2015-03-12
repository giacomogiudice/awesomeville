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
            max: 2000,
            step: 1,
            animate: 1000,
            slide: function( event, ui ){
                global.year = ui.value;
                setGdp(ui.value); 
                global.map.update();

               //var currentSliderValue = $("#slider").slider("option", "value");
	           //console.log(currentSliderValue);
	           $("#currentSliderValue").html(ui.value);
            }
        });

        function playFunction(){
                    var a = $("#slider").slider("option", "value");
                    a+=1;
                    $("#slider").slider("value", a);
                    a = $("#slider").slider("option", "value");
                    global.year = a;
                    setGdp(a);
                    $("#currentSliderValue").html(a); 
                    global.map.update();
        }

        var timerVar; 
        $(function() {
            $("#play").button()
              .click(function( event ) {
                event.preventDefault();
                if(global.play==false){
                    global.play=true; 
                    console.log("play");
                    //$("#play").text("II"); 

                    timerVar = setInterval(function(){playFunction()}, 1000);
                }else{
                    //$("#play").text(">"); 

                    global.play=false; 
                    clearInterval(timerVar); 
                }

            });
        });



		global.year=1970;
        setGdp(); 
        $("#currentSliderValue").html($("#slider").slider("option", "value"));
        global.map = drawMap;

    });
});
