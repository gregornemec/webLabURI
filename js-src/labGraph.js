function Graph(id, xMax,  yMax, axisDX, axisDY,
               xUnit, yUnit, // Measurment unit (s, V, A)!
               tXA, tYA      // Axis text (U[V])
              )

{

    // X, Y coordinates
    this.X = 0;
    this.Y = 0;

    this.id = id;
    this.xMax = xMax;
    this.yMax = yMax;
    //axisD* -> axis Displacement, 0.x of *Max from border to the axis
    this.axisDX = axisDX;
    this.axisDY = axisDY;

    this.xMin = -1*this.xMax*this.axisDX;
    this.yMin = -1*this.yMax*this.axisDY;

    //Text values

    this.xUnit = xUnit;
    this.yUnit = yUnit;
    this.tXA = tXA;
    this.tYA = tYA;

    this.gColor = 'black';

    this.createGraph();



}

Graph.prototype.createGraph = function ( ) {
    //Graph board

    var self = this;

    this.graphBoard =  JXG.JSXGraph.initBoard(this.id, {
        boundingbox: [this.xMin, this.yMax, this.xMax, this.yMin],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false
    });

    //Graph text

    this.tXValue = this.graphBoard.create('text', [
        this.xMax*0.9, this.yMax*0.9,
        function() {
            return self.setXValue(0.000);
        }
    ], {fontsize: 20, anchorX: 'right', fixed: true});

    this.tYValue = this.graphBoard.create('text', [
        this.xMax*0.9, this.yMax*0.8,
        function() {
            return self.setYValue(0.000);
        }
    ], {fontsize: 20, anchorX: 'right', fixed: true});

    this.tXAxis = this.graphBoard.create('text', [
        this.xMax*0.9, this.yMin*0.5,
        function() {
            return self.tXA;
        }
    ], {fontsize: 15, fixed: true});

    this.tYAxis = this.graphBoard.create('text', [
        this.xMin*0.8, this.yMax*0.9,
        function() {
            return self.tYA;
        }
    ], {fontsize: 15, fixed: true});
};

Graph.prototype.setX = function(X) {
    this.X = X;
    this.tXValue.setText(this.setXValue(this.X));
};

Graph.prototype.setY = function(Y) {
    this.Y = Y;
    this.tYValue.setText(this.setYValue(this.Y));
};

Graph.prototype.setXY = function(X, Y) {
    this.setX(X);
    this.setY(Y);
};

Graph.prototype.setXValue = function(value){
    //  console.log(value);
    //value = value.toFixed(3);

    if (this.xUnit == "")
        return "";
    else {
        value = value.toFixed(3);
        return value + this.xUnit;
    }
};

Graph.prototype.setYValue = function(value){
    //console.log(value);
    //value = value.toFixed(3);
    if (this.yUnit == "")
        return "";
    else {
        value = value.toFixed(3);
        return value + this.yUnit;
    }
};

Graph.prototype.drawPoint = function(gColor) {

    this.gColor = gColor;

    if (this.X > this.xMax) {
        this.xMax = this.X;
        this.xMin = -1*this.xMax*this.axisDX;
        this.autoScaleResize();

    }

    if (this.Y > this.yMax) {
        this.yMax = this.Y;
        this.yMin = -1*this.yMax*this.axisDY;
        this.autoScaleResize();
    }

    this.graphBoard.create('point', [
        this.X,
        this.Y
    ], {face: 'o', size: 0.5, name: '', color: this.gColor});
};

Graph.prototype.autoScaleResize = function() {
    this.graphBoard.setBoundingBox([this.xMin, this.yMax, this.xMax, this.yMin]);
    this.tXValue.setCoords(this.xMax*0.9, this.yMax*0.9);
    this.tYValue.setCoords(this.xMax*0.9, this.yMax*0.8);
    this.tXAxis.setCoords(this.xMax*0.9, this.yMin*0.5);
    this.tYAxis.setCoords(this.xMin*0.8, this.yMax*0.9);
};

Graph.prototype.freeBoard = function() {
    JXG.JSXGraph.freeBoard(this.graphBoard);
};
