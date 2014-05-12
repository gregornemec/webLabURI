// Resistor object /////////////////////////////////////////////////////////////
//labResistor.js

/*
 Description:


*/


//All propertys and methodes for all resistors:
// * bullb 12V
// * bullb 3.5V
// * resistor 100OHm
// * resistor 500OHm
/*
ToDo:

* Vnos podatkov uredi tako, da bo vrstni red vseen in da se bodo takoj vnesli
 vsi podatki!
* Uredi evente up, down, drag:
 * up: ce je gradnik na pravem mestu za menjaj element za trenutnega zamenjaj
       sliko odzadja ...
* Naredi animacijo za zarnice
* Metode za prikaz meritev s pomocjo PowerSupply ...

*/

function Resistor (name, R, uMax, board, boardBG, rImage,
                   gColor, pX, pY, sW, sH, pwrs, ap) {

    this.name = name;
    this.R = R;
    this.uMax = uMax;
    this.board = board;
    this.boardBG = boardBG;
    this.startPosition = [pX, pY];
    this.imgSize = [sW, sH];
    this.resistorImg = rImage;
    this.powerSupply = pwrs;
    this.gColor = gColor;
    this.mData = [];
    this.attrPoint = ap;

    this.isBullb = false;
    this.isDestroyed = false;
    this.prevGliderValue = 0;

    // index of measurment data!
    this.mIdx = 0;
}

//Cachin images for animation and setting paths to image files
Resistor.prototype.setImageFileList = function () {
    //From arguments -> real Array
    this.cachImageArray = new Array();
    this.isBullb = true;
    if (arguments.length != 0) {
        this.imageList = [].slice.call(arguments);

        //Caching Animation images!!!
        for (var i=0; i<this.imageList.length; i++) {
            this.cachImageArray[i] = new Image(1, 1);
            this.cachImageArray[i].src = './images/'+this.imageList[i];
        }

    }
};

//Loading images on experiment board.
Resistor.prototype.createAnimeImages = function() {
    this.rBGImgs = Array();
    for (var i = 0; i < this.imageList.length; i++) {
        this.rBGImgs[i] =
            this.board.create('image', ['./images/'+this.imageList[i],
                                       [0, 10.68], [14.96, 10.68]],
                              { //attractorDistance: 0.5,
                                  //attractors: [this.attrPoint]
                                  fixed: true,
                                  visible: false,
                                  opacity: 1,
                                  layer: 0
                              });
        console.log(this.rBGImgs[i]);
    }
};

Resistor.prototype.animate = function(gMax, gValue) {

    //Setting Image/Bullb Power <-> U|Potential
    var gliderMax = gMax;
    var gliderPart =  gliderMax/(this.rBGImgs.length - 1);

    var index = Math.floor(gValue/gliderPart);

    var opacityStep = 1/gliderPart;
    var opacityCurrent = opacityStep * (gValue - gliderPart*index);

   /* Debug!!!
    console.log("Animation log: ");
    console.log("max:" + gliderMax);
    console.log("part: " + gliderPart);
    console.log("value: " + gValue);

    console.log("index: " + index);
    console.log("oS: " + opacityStep);
    console.log("oC: " + opacityCurrent);

    console.log("prev:" + this.prevGliderValue);
    console.log("valu:" + gValue);
    */

    // Checking direction of power button movement.
    if (this.prevGliderValue < gValue) {
        this.setFrameStateUp(opacityCurrent, Math.floor(index + 1));
        this.prevGliderValue = gValue;
    }
    else {
        this.setFrameStateDown(opacityCurrent, Math.floor(index+1));
        this.prevGliderValue = gValue;
    }

};

Resistor.prototype.setFrameStateUp = function(opacityCurrent, i) {

    if (this.rBGImgs[i-2] != undefined)
        this.rBGImgs[i-2].setAttribute({visible: false});

    if (this.rBGImgs[i-1] != undefined)
        this.rBGImgs[i-1].setAttribute({visible: true, opacity: 1});

    if (this.rBGImgs[i] != undefined) {
        this.rBGImgs[i].setAttribute({opacity: opacityCurrent, visible:true});
    }

    this.board.update();
};

Resistor.prototype.setFrameStateDown = function(opacityCurrent, i) {

    if (this.rBGImgs[i-1] != undefined)
        this.rBGImgs[i-1].setAttribute({visible: true, opacity: 1});


    if (this.rBGImgs[i] != undefined) {
        this.rBGImgs[i].setAttribute({opacity: opacityCurrent, visible:true});
    }

    if (this.rBGImgs[i+1] != undefined)
        this.rBGImgs[i+1].setAttribute({visible: false, opacity: 0});

    this.board.update();
};

Resistor.prototype.readMeasurData = function() {
    var dataTmp = [].slice.call(arguments);
    console.log(dataTmp);

    for (var i=0; i<dataTmp.length; i+=2) {
        var obj = {
            U: dataTmp[i+1],
            I: dataTmp[i]
        };
        this.mData.push(obj);
    };

    this.uMax = this.mData[this.mData.length-1].U;

    //resistance override when using measurment data!

    this.R = function (voltage) {
        var R = 0;
        var U1, U2, I1, I2 = 0;

        if (voltage > 0) {
            console.log(this.mIdx);
            while ((voltage > this.mData[this.mIdx].U) && (this.mIdx < this.mData.length)) {
                this.mIdx++;
            }

            while ((voltage < this.mData[this.mIdx].U) && (this.mIdx > 0)) {
                this.mIdx--;
            }
            console.log(this.mIdx);
        }

        console.log("U:" + this.mData[this.mIdx].U);
        console.log("I:" + this.mData[this.mIdx].I);

        if ((this.mIdx >= 0) && (this.mIdx < this.mData.length)) {
            U1 = this.mData[this.mIdx].U;
            I1 = this.mData[this.mIdx].I;
        }

       // if ((this.mIdx+1 >= 0) && (this.mIdx+1 < this.mData.length)) {
         //   U2 = this.mData[this.mIdx+1].U;
           // I2 = this.mData[this.mIdx+1].I;
        //}


        //R = (U2 - U1)/(I2 - I1);
        R = U1/I1;
        console.log("R:" + R);
        return voltage/R;

       // return this.mData[this.mIdx].I;
    };
};


Resistor.prototype.putBullb = function() {
    if (this.isBullb) {
        this.boardBG.setAttribute({visible: false});
        this.rBGImgs[0].setAttribute({visible: true});
        this.rBGImgs[1].setAttribute({visible: true, opacity: 0});
        this.rImg.setAttribute({visible: false});
    }

};

Resistor.prototype.takeBullb = function() {
    if (this.isBullb) {
        this.boardBG.setAttribute({visible: true});
        this.rImg.setAttribute({visible: true});

        for (var i=0; i<this.rBGImgs.length; i++) {
            this.rBGImgs[i].setAttribute({visible:false});
        }
    }
};

Resistor.prototype.destroyeR = function() {
    this.isDestroyed = true;
    this.redLine.setAttribute({visible: true});
    this.takeBullb();
};

Resistor.prototype.createResistor = function() {

    var self = this;

    console.log("Animation: " + this.isBullb);
    if (this.isBullb) {
        this.createAnimeImages();
    }

    this.rImgCache = new Image(1, 1);
    this.rImgCache.src = this.resistorImg;
    this.rImg = this.board.create('image', [ this.resistorImg,
                                             [0.0, 0.0], this.imgSize],
                                  {
                                      //attractorDistance: 0.5,
                                      //attractors: [this.attrPoint]
                                      opacity: 1,
                                      layer: 2
                                  });

    //Crating starting base point

    this.attrStartPoint = this.board.create('point',
                                            [this.getCenterOfImage(this.startPosition)],
                                            {
                                                color: 'blue',
                                                size: 10,
                                                fixed: true,
                                                fillOpacity: 0,
                                                strokeOpacity: 0,
                                                name: "",
                                                visible: true,
                                                showInfoBox: false
                                            });

    this.attrImgPoint = this.board.create('point',
                                          [this.getCenterOfImage(this.startPosition)],
                                          {
                                              size: 42,
                                              face: '[]',
                                              fixed: false,
                                              fillOpacity: 0,
                                              strokeOpacity: 0,
                                              name: "",
                                              visible: true,
                                              attractorDistance: 0.4,
                                              attractors: [this.attrPoint, this.attrStartPoint],
                                              showInfoBox: false
                                          });

    //Moving resistor image with image attractor point!
    var transRImg = this.board.create('transform', [
        function() { return self.getBottomLeft()[0];},
        function() { return self.getBottomLeft()[1];}
    ], {type: 'translate'});

    transRImg.bindTo(this.rImg);

    //Red line over resistor. Show if resistor is destroyed!

    var lineP01 = this.board.create('point', [
        function() { return self.getBottomLeft()[0];},
        function() { return self.getBottomLeft()[1];}
    ], {visible: false});

    var lineP02 = this.board.create('point', [
        function() { return self.getTopRight()[0];},
        function() { return self.getTopRight()[1];}
    ], {visible: false});

   this.redLine = this.board.create('segment', [lineP01, lineP02],
                                   {
                                       color: 'red',
                                       visible: false
                                   });


    /* attrImg Point Event currently not needed
     -> DELETE if not needed
    this.attrImgPoint.on('drag', function() {

    }, this);
    */

    this.attrImgPoint.on('up', function() {
        //console.log(this.checkCircuitPoint());
        if(this.checkCircuitPoint() && this.isDestroyed == false) {
            if (this.powerSupply.currentResistor == undefined) {
                console.log("Current resistor in circuit: " +  this.name);
                this.powerSupply.setCurrentResistor(this);
                this.powerSupply.connectCircuit();
                this.putBullb();
            }
            else {
                //Move to side
                this.attrImgPoint.moveTo([13.8, 7.5], 200);
                //alert("Odstranite prej porabnika");

                //moving currentR to own strart position!
                //var cR = this.powerSupply.currentResistor;
                // cR.attrImgPoint.moveTo([cR.attrStartPoint.X,
                //                         cR.attrStartPoint.Y], 500);

            }
        }
        else {
            console.log("Resistor not in circuit.");
            this.powerSupply.setCurrentResistor(undefined);
            this.powerSupply.brakeCircuit();

        }
    }, this);

    this.attrImgPoint.on('down', function() {
        if (this.checkCircuitPoint()){
            this.takeBullb();
            }
     }, this);

    this.board.update();
};

Resistor.prototype.resistance = function(voltage) {
    return this.R(voltage);
};


//Support methodes

Resistor.prototype.getCenterOfImage = function(reference) {
    var X = reference[0] + (this.imgSize[0]/2);
    var Y = reference[1] - (this.imgSize[1]/2);

    return [X, Y];
};

Resistor.prototype.getBottomLeft = function() {
    var X = this.attrImgPoint.X() - (this.imgSize[0]/2);
    var Y = this.attrImgPoint.Y() + (this.imgSize[1]/2);

    return [X, Y];
};

Resistor.prototype.getTopRight = function() {
    var X = this.attrImgPoint.X() + (this.imgSize[0]/2);
    var Y = this.attrImgPoint.Y() - (this.imgSize[1]/2);

    return [X, Y];
};

Resistor.prototype.getAttrPointCoords = function() {
    return {
        X: this.attrImgPoint.X(),
        Y: this.attrImgPoint.Y()
    };
};

Resistor.prototype.checkCircuitPoint = function() {
    if (this.attrImgPoint.X() == this.attrPoint.X() && this.attrImgPoint.Y() == this.attrPoint.Y()) {
        return true;
    }
    else {
        return false;
    }
};

Resistor.prototype.getR = function() {
    return this.resistance;
};





//Testing resistor -> resisotr01
