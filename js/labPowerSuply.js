//Main jsxGraph board init.
//



//ToDO: Experiment!


var powerS = JXG.JSXGraph.initBoard('PowerS', {             //PowerS
    boundingbox: [0, 0, 10, 5],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

var amperM = JXG.JSXGraph.initBoard('AmperM', {
    boundingbox: [0, 0, 4, 5],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false
});


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

//Using next images, for development.

var imVoltageB01 = "./images/glossy_green_button.png";

// Old testing slider
/*
var s = powerS.create('slider', [
    [0, 0.3], [0, 3.7], [0, 0, 24]
]);*/

//New Voltage button!

var psVoltageB01 = powerS.create('image', [imVoltageB01, [1, 4], [2, 2]]);
var psP01 = powerS.create('point', [0.8, 3], {name: '', color: 'green', opacity: 0.3 });
var psP02 = powerS.create('point', [2, 3], {name: '', color: 'green', opacity: 0.3 });

//var psCirc = powerS.create('circle', [psP02, psP01], { });


//Rotation of button!
var buttRot =  powerS.create('transform', [
    function() {
        return Math.atan2(psP02.Y()-psP01.Y(), psP02.X()-psP01.X());
    }, psP02],  {type: 'rotate'});

/*
psP01.on('update ', function() {
    psCirc.setRadius(psCirc.Radius());
});
*/

//psP01.setPos();
/*
var buttTrs = powerS.create('transform', [
    function() {
        return Math.sqrt(Math.pow(psCirc.getRadius(), 2) - Math.pow(psP01.Y(), 2));
    },

    function() {
        return Math.sqrt(Math.pow(psCirc.getRadius(), 2) - Math.pow(psP01.X(), 2));
    }], {type: 'translate'});

*/

//var psP03 = powerS.create('point', [psP01, buttRot], {name: '', color: 'red', opacity: 0.3 });

//buttRot.bindTo();
//buttRot.bindTo(psP01);
buttRot.bindTo(psVoltageB01);
//powerS.update();

//buttRot.bindTo(psP01);
//buttRot.bindTo(psP02);
//buttRot.bindTo(psP03);
//buttRot.bindTo(psVoltageB01);


//Axis try out
var axisY = graphUI.create('axis', [[0, 0], [0, 23]], {drawLabels: true, ticksDistance: 5});
//var aYTicks = graph01.create('ticks', [axisY, []], {ticksDistance: 5, drawLabels: true});


var axisX = graphUI.create('axis', [[0, 0], [60, 0]],
                           {insertTicks: true, minorTicks: 5, minorHeight: 10});
//var aXTicks = graph01.create('ticks', [axisX, [5]], {});

//graphUI.fullUpdate();

//Linking diferent nodes
powerS.addChild(graphUI);
powerS.addChild(amperM);

var resistor01 = 10;

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

var aMDisplayCurrent = amperM.create('text', [
    -0.3, 3,
    function () {
       // return ((s.Value()/resistor01).toFixed(2)) + "I";
    }
], {fontsize: 20});





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

//text02.setText('Testing string');
