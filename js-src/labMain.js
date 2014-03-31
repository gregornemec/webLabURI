//Chrome flickering problem Solution found:
//https://groups.google.com/forum/#!msg/jsxgraph/vfXilubLl1E/PbjheGuBD2oJ

JXG.Options.board.minimizeReflow = 'none';


//Disabling highlight for points -> Experiment!


var infobox = document.getElementById('Experiment');
//console.log(infobox);

JXG.Point.prototype.highlight  = function() {
    // infobox.innerHTML = this.expBoard.mousePosRel.toString();
    //infobox.style.left = (this.expBoard.mousePosRel[0]+0)+'px';
    //infobox.style.top =  (this.expBoard.mousePosRel[1]+0)+'px';
    infobox.style.display = 'block';
};

JXG.Point.prototype.noHighlight = function() {
    infobox.style.display = 'none';
};


/*
var infobox = document.getElementById('myinfobox');
JXG.Line.prototype.highlight = function(){
    infobox.innerHTML = this.board.mousePosRel.toString()+'<hr noshade>'+this.name;
    infobox.style.left = (this.board.mousePosRel[0]+0)+'px';
    infobox.style.top =  (this.board.mousePosRel[1]+0)+'px';
    infobox.style.display = 'block';
    this.board.renderer.highlight(this); // highlight the line

}
JXG.Line.prototype.noHighlight = function(){
    infobox.style.display = 'none';
    this.board.renderer.noHighlight(this); // dehighlight the line
}

*/


//Putting it all together.

var self = this;

var uiAmpermeter = new AmperMeter();
var uiCollectData = new CollectData();
var iface = new Interface();
var uiPowerSupply = new PowerSupply(uiAmpermeter.amText, uiGraphs);
var uiExperiment = new Experiment(uiPowerSupply);


//Testing object pass py reference

/*
var someVar = {};


function SomeObject() {



    this.name = "Testing Object";
    //var mainObject = this;
};

SomeObject.prototype.passObjetct = function(sv) {

    window[sv] = this;
    //return this;

};
y
//console.log();

var objectInv = new SomeObject();
objectInv.passObjetct("some
Var");


//var someVar = objectInv;

console.log(objectInv.name);
console.log(someVar.name);



//console.log(uiExperiment.getCurrentResistor());

*/
