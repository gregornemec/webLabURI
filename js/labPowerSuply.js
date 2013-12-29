var powerS = JXG.JSXGraph.initBoard('PowerS', {             //PowerS
    boundingbox: [0, 0, 10, 5],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

//Using next images, for development.
//Replace with original Power Supply image

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


//Linking diferent nodes
powerS.addChild(graphUI);
powerS.addChild(amperM);

var resistor01 = 10;



var aMDisplayCurrent = amperM.create('text', [
    -0.3, 3,
    function () {
       // return ((s.Value()/resistor01).toFixed(2)) + "I";
    }
], {fontsize: 20});

//text02.setText('Testing string');
