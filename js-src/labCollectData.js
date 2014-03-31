//GraphUI
function CollectData () {

    this.currentVoltage = 0;
    this.currentCurrent = 0;
    this.timerOn = false;
    this.UMax = 7;
    this.IMax = 0.5;



    this.gColor = "gray";




    var self = this;
    this.SWatch = new Stopwatch(function() {
        //var  i = 0;
        //console.log(i);
        //console.log(this.toString());
        //i++;

        self.changeInner("Timer", this.toString("normal"));

        self.graphU.create('point', [
            this.toString(),
            self.currentVoltage
        ], {face: 'o', size: 0.5, name: '', color: self.gColor});

        self.gDisplayVoltage.setText(self.currentVoltage.toFixed(2) + "V");

        self.graphI.create('point', [
            this.toString(),
            self.currentCurrent
        ], {face: 'o', size: 0.5, name: '', color: self.gColor});

        self.gDisplayCurrent.setText(self.currentCurrent.toFixed(3) + "A");

        self.graphR.create('point', [
            self.currentCurrent,
            self.currentVoltage
        ], {face: 'o', size: 0.5, name: '', color: self.gColor});

       // self.graphR.update();


        if (this.toString() >  59)
            this.stop();

    }, 500);
    //this.currentTime = this.SWatch.toString();
    //console.log(this.SWatch.toString());

    //Axis try out
    //Custom axis for voltage graph

    //var axisUY = this.graphU.create('axis', [[0, 0], [0, 23]], {drawLabels: true, ticksDistance: 5});
    //var aYTicks = graph01.create('ticks', [axisY, []], {ticksDistance: 5, drawLabels: true});


    //var axisUX = this.graphU.create('axis', [[0, 0], [60, 0]],
       //                      {insertTicks: true, minorTicks: 5, minorHeight: 10});

    //Custom axis for current graph

    //var axisIY = this.graphI.create('axis', [[0, 0], [0, 1.0]], {drawLabels: true, ticksDistance: 5});
    //var aYTicks = graph01.create('ticks', [axisY, []], {ticksDistance: 5, drawLabels: true});


   // var axisIX = this.graphI.create('axis', [[0, 0], [60, 0]],
     //                        {insertTicks: true, minorTicks: 5, minorHeight: 10});
    //var aXTicks = graph01.create('ticks', [axisX, [5]], {});

    //graphUI.fullUpdate();

    //this.SWatch.setListener(updateTime);

    this.createGraphs();
};

//Graphs.prototype.SWatch = new Stopwatch(this.updateTime, 450);

CollectData.prototype.setCurrentVoltage = function(voltage) {
    this.currentVoltage = voltage;
    this.gDisplayVoltage.setText(this.currentVoltage.toFixed(3) + "V");


};

CollectData.prototype.setCurrentCurrent = function(current) {
    this.currentCurrent = current;
    this.gDisplayCurrent.setText(this.currentCurrent.toFixed(3) + "A");

    if ((this.currentVoltage > this.UMax) && (this.timerOn)) {
        this.graphU.setBoundingBox([-4.2, this.UMax, 62, -1*(this.UMax*0.10)]);
        this.graphR.setBoundingBox([-1*(this.IMax*0.10), this.UMax, this.IMax, -1*(this.UMax*0.10)]);
        this.UMax = this.currentVoltage;
    }

    if ((this.currentCurrent > this.IMax) && (this.timerOn)) {
        this.graphI.setBoundingBox([-4.2, this.IMax, 62, -1*(this.IMax*0.10)]);
        this.graphR.setBoundingBox([-1*(this.IMax*0.10), this.UMax, this.IMax, -1*(this.UMax*0.10)]);
        this.IMax = this.currentCurrent;
    }

};

CollectData.prototype.setGraphColor = function(color) {
    this.gColor = color;
};

CollectData.prototype.start = function() {
    this.timerOn = true;
    this.SWatch.start();
};


CollectData.prototype.stop = function() {
    this.timerOn = false;
    this.SWatch.stop();
};

CollectData.prototype.reset = function() {
    this.changeInner("Timer", "00:00");

    this.SWatch.reset();
};

CollectData.prototype.createGraphs = function() {

    this.graphU= JXG.JSXGraph.initBoard('GraphU', {
        boundingbox: [-4.2, this.UMax, 62, -1*(this.UMax*0.10)],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false
    });

    var gUu = this.graphU.create('text', [
        -4.1, 23, "U[V]"
    ], {fontsize: 12, fixed: true});

    var gUt = this.graphU.create('text', [
        55, -1 , "t[s]"
    ], {fontsize: 12, fixed: true});

    this.graphI = JXG.JSXGraph.initBoard('GraphI', {
        boundingbox: [-4.2, this.IMax, 62, -1*(this.IMax*0.10)],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false
    });



    var gIi = this.graphI.create('text', [
            -3.7, 0.46, "I[A]"
    ], {fontsize: 12, fixed: true});

    var gIt = this.graphI.create('text', [
        55, -0.02 , "t[s]"
    ], {fontsize: 12, fixed: true});

    this.graphR = JXG.JSXGraph.initBoard('GraphR', {
        boundingbox: [-1*(this.IMax*0.10), this.UMax, this.IMax, -1*(this.UMax*0.10)],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false
    });


    this. gDisplayVoltage = this.graphU.create('text', [
        47, 23,
        function () {
            //return this.currentVoltage + "V";
            return "0.000V";
        }
    ], {fontsize: 20, fixed: true});

    this. gDisplayCurrent = this.graphI.create('text', [
        47, 0.45,
        function () {
            //return this.currentCurrent + "A";
            return  "0.000A";
        }
    ], {fontsize: 20, fixed: true});

};

CollectData.prototype.deleteGraphs = function() {
    JXG.JSXGraph.freeBoard(this.graphU);
    JXG.JSXGraph.freeBoard(this.graphI);
    JXG.JSXGraph.freeBoard(this.graphR);
};

CollectData.prototype.clear = function() {
    this.deleteGraphs();
    this.createGraphs();
};

CollectData.prototype.changeInner = function(id, text) {
    var element = document.getElementById(id);
    element.innerHTML = text;
};

CollectData.prototype.updateTime = function() {
    //var self = this;

    //document.getElementById('showTimer').innerHTML = currentTime;
    //return currentTime;
    //var brdText02 = graph01.elementsByName('text02');
    //brdText02.setText(currentTime);
    //gUIMDisplayTime.setText(currentTime);
    //this.SWatch.toString();

    console.log(this.powerSupply);

/*
    this.graphUI.create('point', [
        //this.currentTime,
        this.powerSupply.getCurrentVoltage()
    ], {face: 'o', size: 1, name: ''}); */

    //this.graphUI.create('point', [
    // currentTime,
    // (s.Value() / resistor01)
    //], {face: 'o', size: 1, color: 'blue', name: ''} );

    /*this.graphR.create('point', [
        this.pwrs.currentVoltage/100,
        this.pwrs.currentVoltage
    ], {face: 'o', size: 1, color: 'black', name: ''} ); */

    /*graph01.create('curve', [
     currentTime,
     s.Value()
     ], {}); */



};
