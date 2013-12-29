//GraphUI

var graphUI = JXG.JSXGraph.initBoard('GraphUI', {
    boundingbox: [-2, 25, 62, -2],
    axis: false,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

var graphR = JXG.JSXGraph.initBoard('GraphR', {
    boundingbox: [-0.07, 25, 2.5, -2],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});


//Axis try out
var axisY = graphUI.create('axis', [[0, 0], [0, 23]], {drawLabels: true, ticksDistance: 5});
//var aYTicks = graph01.create('ticks', [axisY, []], {ticksDistance: 5, drawLabels: true});


var axisX = graphUI.create('axis', [[0, 0], [60, 0]],
                           {insertTicks: true, minorTicks: 5, minorHeight: 10});
//var aXTicks = graph01.create('ticks', [axisX, [5]], {});

//graphUI.fullUpdate();

var SWatch = new Stopwatch(updateTime, 450);
//SWatch.setListener(updateTime);

function updateTime() {
    var currentTime = SWatch.toString();
    //document.getElementById('showTimer').innerHTML = currentTime;
    //return currentTime;
    //var brdText02 = graph01.elementsByName('text02');
    //brdText02.setText(currentTime);
    gUIMDisplayTime.setText(currentTime);

    graphUI.create('point', [
        // currentTime,
        // s.Value()
    ], {face: 'o', size: 1, name: ''});

    graphUI.create('point', [
        // currentTime,
        // (s.Value() / resistor01)
    ], {face: 'o', size: 1, color: 'blue', name: ''} );

    graphR.create('point', [
        //(s.Value() / resistor01),
        //s.Value()
    ], {face: 'o', size: 1, color: 'black', name: ''} );

    /*graph01.create('curve', [
     currentTime,
     s.Value()
     ], {});*/
}

var gUIDispalyVoltage = graphUI.create('text', [
    50, 23,
    function () {
        //return (s.Value().toFixed(2)) + "V";
    }
], {fontsize: 20});

var gUIMDisplayTime = graphUI.create('text', [
    50, 21,
    '00'
], {fontsize: 20});
