define(["jquery","map/drawMap","map/updateMap", "jqueryui"],
	function($,drawMap,updateMap) {
	$(function() {

        $("#mapContainer").width($("#container").width()* 0.75);
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
            step: 0.01,
            animate: 100,
            slide: function( event, ui ){
                global.year = parseInt(ui.value);
                setGdp(parseInt(i.value)); 
                global.map.update();

               //var currentSliderValue = $("#slider").slider("option", "value");
	           //console.log(currentSliderValue);
	           $("#currentSliderValue").html(parseInt(ui.value));
            }
        });

        function playFunction(){
                    var a = $("#slider").slider("option", "value");
                    a+=0.05;
                    $("#slider").slider("value", a);
                    a = parseInt($("#slider").slider("option", "value"));
                    global.year = a;
                    setGdp(a);
                    //console.log(global.year); 
                    $("#currentSliderValue").html(a); 
                    global.map.update();
        }

        var timerVar; 

        $(function() {$("#play").button()
              .click(function( event ) {
                event.preventDefault();
                console.log("play");
                if(global.play==false){
                    global.play=true; 
                    //$("#play").text("II"); 
                    timerVar = setInterval(function(){playFunction()}, 10);
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
