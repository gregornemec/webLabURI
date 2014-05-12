//GraphUI
function CollectData () {

    this.currentVoltage = 0;
    this.currentCurrent = 0;
    this.timerOn = false;
    //this.UMax = 7;
    //this.IMax = 0.5;

    this.gColor = "gray";

    var self = this;
    this.SWatch = new Stopwatch(function() {
        self.changeInner("Timer", this.toString("normal"));

        self.graphU.setX(this.toString());
        self.graphU.drawPoint(self.gColor);
        self.graphI.setX(this.toString());
        self.graphI.drawPoint(self.gColor);


        //self.graphR.setXY(self.currentCurrent, self.currentVoltage);
        self.graphR.drawPoint(self.gColor);


        if (this.toString() >  59)
            this.stop();

    }, 500);

    this.createGraphs();
};

//Graphs.prototype.SWatch = new Stopwatch(this.updateTime, 450);

CollectData.prototype.setCurrentVoltage = function(voltage) {
    this.currentVoltage = voltage;
    this.graphU.setY(voltage);
    this.graphR.setY(voltage);
};

CollectData.prototype.setCurrentCurrent = function(current) {
    this.currentCurrent = current;
    this.graphI.setY(current);
    this.graphR.setX(current);
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

    this.graphU = new Graph('GraphU', 62, 6, 0.1, 0.1,
                            "", "V",
                            "t[s]", "U[V]"
                           );

    this.graphI = new Graph('GraphI', 62, 0.3, 0.1, 0.1,
                            "", "A",
                            "t[s]", "I[A]"
                           );

    this.graphR = new Graph('GraphR', 0.3, 6, 0.1, 0.12,
                            "", "",
                            "I[A]", "U[V]"
                           );
};

CollectData.prototype.deleteGraphs = function() {
    this.graphU.freeBoard();
    this.graphI.freeBoard();
    this.graphR.freeBoard();
};

CollectData.prototype.clear = function() {
    this.deleteGraphs();
    this.createGraphs();
};

CollectData.prototype.changeInner = function(id, text) {
    var element = document.getElementById(id);
    element.innerHTML = text;
};

//? Tmp Function for Time update event -> ? Delete
CollectData.prototype.updateTime = function() {

};
