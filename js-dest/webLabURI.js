/*
 * Javascript Stopwatch class
 * http://www.seph.dk
 *
 * Copyright 2009 Seph soliman
 * Released under the MIT license (do whatever you want - just leave my name on it)
 * http://opensource.org/licenses/MIT
 */

// * Stopwatch class {{{
Stopwatch = function(listener, resolution) {
    this.startTime = 0;
    this.stopTime = 0;
    this.totalElapsed = 0; // * elapsed number of ms in total
    this.started = false;
    this.listener = (listener != undefined ? listener : null); // * function to receive onTick events
    this.tickResolution = (resolution != undefined ? resolution : 500); // * how long between each tick in milliseconds
    this.tickInterval = null;

    // * pretty static vars
    this.onehour = 1000 * 60 * 60;
    this.onemin  = 1000 * 60;
    this.onesec  = 1000;
}
Stopwatch.prototype.start = function() {
    console.log("Stopwatch started!");
    var delegate = function(that, method) { return function() { return method.call(that); }; };
    if(!this.started) {
	this.startTime = new Date().getTime();
	this.stopTime = 0;
	this.started = true;
	this.tickInterval = setInterval(delegate(this, this.onTick), this.tickResolution);
    }
}
Stopwatch.prototype.stop = function() {
    console.log("Stopwatch stoped!");
    if(this.started) {
	this.stopTime = new Date().getTime();
	this.started = false;
	var elapsed = this.stopTime - this.startTime;
	this.totalElapsed += elapsed;
	if(this.tickInterval != null)
	    clearInterval(this.tickInterval);
    }
    return this.getElapsed();
}
Stopwatch.prototype.reset = function() {
    this.totalElapsed = 0;
    // * if watch is running, reset it to current time
    this.startTime = new Date().getTime();
    this.stopTime = this.startTime;
}
Stopwatch.prototype.restart = function() {
    this.stop();
    this.reset();
    this.start();
}
Stopwatch.prototype.getElapsed = function() {
    // * if watch is stopped, use that date, else use now
    var elapsed = 0;
    if(this.started)
	elapsed = new Date().getTime() - this.startTime;
    elapsed += this.totalElapsed;

    var hours = parseInt(elapsed / this.onehour);
    elapsed %= this.onehour;
    var mins = parseInt(elapsed / this.onemin);
    elapsed %= this.onemin;
    var secs = parseInt(elapsed / this.onesec);
    var ms = elapsed % this.onesec;

    return {
	hours: hours,
	minutes: mins,
	seconds: secs,
	milliseconds: ms
    };
}
Stopwatch.prototype.setElapsed = function(hours, mins, secs) {
    this.reset();
    this.totalElapsed = 0;
    this.totalElapsed += hours * this.onehour;
    this.totalElapsed += mins  * this.onemin;
    this.totalElapsed += secs  * this.onesec;
    this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers
}
Stopwatch.prototype.toString = function(format) {
    var zpad = function(no, digits) {
	no = no.toString();
	while(no.length < digits)
	    no = '0' + no;
	return no;
    }
    var e = this.getElapsed();
    //return zpad(e.hours,2) + ":" + zpad(e.minutes,2) + ":" + zpad(e.seconds,2); -> Original
    if (format == "normal")
        return zpad(e.minutes,2) + ":" + zpad(e.seconds,2); //normal format for time display -> Gregor Nemec
    else
        return zpad(e.seconds,3) + "."  + zpad(e.milliseconds,3); //decimal for Graphs
}

Stopwatch.prototype.setListener = function(listener) {
    this.listener = listener;
}
// * triggered every <resolution> ms
Stopwatch.prototype.onTick = function() {
    if(this.listener != null) {
	this.listener(this);
    }
}
// }}}
;// Resistor object /////////////////////////////////////////////////////////////
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
    this.resistance = R;
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

    //Setting Image/Bullb Powe <-> U|Potential
    var gliderMax = gMax;
    var gliderPart =

 gliderMax/(this.rBGImgs.length - 1);

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
    console.log(this.uMax);
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
                                                strokeOpacity: 1,
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

Resistor.prototype.changeOpacity = function(transpar) {
    this.rImg.setAttribute({opacity: transpar});

    //this.rImg.updateRenderer();
    console.log(transpar);
    //this.rImg.update();
};



//Testing resistor -> resisotr01
;// Experiment object ///////////////////////////////////////////////////////////
// labExperimnet.js

/*
 Description:

 * porabnike dobimo iz objekta Resistors.
 * animacija jakosti svetilnosti
 * menjava porabnikov z vlečenjem gradnika na mesto v toku krogu.
*/



//var currentResistor = "Global current";

function Experiment (pwrs) {

    var self = this;
    this.powerSupply = pwrs;
    console.log(pwrs);
    console.log(this.powerSupply);


    var circuitPP = [11.705, 5.320];
    //Image paths for experiment board ...
    var expNoInstImg = "./images/allExperimentBG/NoResistors.jpg";
    //caching image
    var expBGCache = new Image(1, 1);
    expBGCache.src = expNoInstImg;

    var expBoard = JXG.JSXGraph.initBoard('Experiment', {
        boundingbox: [0, 0, 14.96, 10.68],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false
    });

    //Experiment BG image
    var expBG = expBoard.create('image',
                                [ expNoInstImg,
                                  [0, 10.68], [14.96, 10.68] ],
                                { fixed: true,
                                  frozen: true,
                                  opacity: 1,
                                  layer: 1 });


    //Creating circuit snap point.
    var circuitAttrPoint = expBoard.create('point', [circuitPP], {
        color: 'blue',
        size: 10,
        fixed: true,
        fillOpacity: 0,
        strokeOpacity: 1,
        name: "",
        visible: true,
        showInfoBox: false
        //attractorDistance: 0.4,
        //attractors: [this.rImg]
    });

    this.currentResistor = undefined;

    //Creating 100Ohm Resistor
    this.r100 = new Resistor( "R100",
                              100,   //Resistance from mesurment data!?
                              10,
                              expBoard,
                              expBG,
                              './images/r100B.png',
                              "red",
                              0.30, 2.19,
                              2.27, 2.13,
                              this.powerSupply,
                              circuitAttrPoint
                           );

    this.r100.createResistor(circuitAttrPoint);

    //Creating 500Ohm Resistor
    this.r500 = new Resistor( "R500",
                              500,   //Resistance from mesurment data!?
                              10,
                              expBoard,
                              expBG,
                              './images/r500B.png',
                              "orange",
                              0.30, 4.33,
                              2.27, 2.13,
                              this.powerSupply,
                              circuitAttrPoint
                           );

    this.r500.createResistor(circuitAttrPoint);

    //Creating 3.5V bullb
    this.b35 = new Resistor( "B35",
                             200,   //Resistance from mesurment data!?
                             7.5,
                             expBoard,
                             expBG,
                             './images/B35B.png',
                             "blue",
                             0.30, 6.49,
                             2.27, 2.13,
                             this.powerSupply,
                             circuitAttrPoint
                           );
    this.b35.setImageFileList(
        'bullb35V/bullb35V_croped03.jpg',
        'bullb35V/bullb35V_croped04.jpg',
       // 'bullb35V/bullb35V_croped05.jpg',
        'bullb35V/bullb35V_croped06.jpg',
       // 'bullb35V/bullb35V_croped07.jpg',
        'bullb35V/bullb35V_croped08.jpg',
       // 'bullb35V/bullb35V_croped09.jpg',
        'bullb35V/bullb35V_croped10.jpg',
       //'bullb35V/bullb35V_croped11.jpg',
        'bullb35V/bullb35V_croped12.jpg',
       // 'bullb35V/bullb35V_croped13.jpg',
        'bullb35V/bullb35V_croped14.jpg',
       // 'bullb35V/bullb35V_croped15.jpg',
        'bullb35V/bullb35V_croped16.jpg',
       // 'bullb35V/bullb35V_croped17.jpg',
        'bullb35V/bullb35V_croped18.jpg',
       // 'bullb35V/bullb35V_croped19.jpg',
        'bullb35V/bullb35V_croped20.jpg',
       // 'bullb35V/bullb35V_croped21.jpg',
        'bullb35V/bullb35V_croped22.jpg',
        'bullb35V/bullb35V_croped23.jpg',
        'bullb35V/bullb35V_croped24.jpg'
    );

    //Reading real mesurmets of bullb.
    this.b35.readMeasurData(0.00686813186813,0.01221001221,0.0129731379731,0.026862026862,0.0169413919414,0.031746031746,0.0175518925519,0.041514041514,0.0190781440781,0.041514041514,0.0224358974359,0.0512820512821,0.0270146520147,0.0561660561661,0.0285409035409,0.0610500610501,0.0428876678877,0.0952380952381,0.0462454212454,0.114774114774,0.0535714285714,0.119658119658,0.0718864468864,0.197802197802,0.0758547008547,0.23199023199,0.07615995116,0.241758241758,0.0856227106227,0.40293040293,0.093253968254,0.529914529915,0.0941697191697,0.652014652015,0.0950854700855,0.774114774115,0.098137973138,0.788766788767,0.0999694749695,0.910866910867,0.10057997558,0.925518925519,0.100885225885,0.915750915751,0.102411477411,0.954822954823,0.102716727717,1.0231990232,0.103021978022,1.02808302808,0.108516483516,1.03296703297,0.108821733822,1.07692307692,0.109432234432,1.1452991453,0.110347985348,1.16483516484,0.113095238095,1.19413919414,0.114010989011,1.2967032967,0.115537240537,1.31623931624,0.116147741148,1.32112332112,0.117063492063,1.36996336996,0.118284493284,1.39438339438,0.118894993895,1.40415140415,0.120115995116,1.41391941392,0.120726495726,1.49206349206,0.121336996337,1.50183150183,0.121642246642,1.50671550672,0.121947496947,1.5115995116,0.122863247863,1.51648351648,0.124389499389,1.62393162393,0.126526251526,1.6336996337,0.126831501832,1.64835164835,0.1307997558,1.76068376068,0.13141025641,1.78021978022,0.13141025641,1.7851037851,0.135683760684,1.88766788767,0.135989010989,1.90231990232,0.136294261294,1.91697191697,0.1365995116,1.93650793651,0.137515262515,1.94627594628,0.140262515263,2,0.141178266178,2.02442002442,0.141788766789,2.03907203907,0.141788766789,2.06349206349,0.142704517705,2.08302808303,0.14300976801,2.0927960928,0.147588522589,2.20512820513,0.147893772894,2.2148962149,0.148199023199,2.21978021978,0.150641025641,2.30280830281,0.152472527473,2.34676434676,0.153388278388,2.3663003663,0.153388278388,2.37118437118,0.153388278388,2.37606837607,0.154609279609,2.3956043956,0.158577533578,2.52747252747,0.159188034188,2.54212454212,0.160409035409,2.56166056166,0.162851037851,2.64957264957,0.164377289377,2.68376068376,0.164682539683,2.69841269841,0.165598290598,2.70818070818,0.168956043956,2.81074481074,0.170177045177,2.8547008547,0.170482295482,2.8547008547,0.170787545788,2.91330891331,0.172619047619,2.91819291819,0.174145299145,2.96703296703,0.174145299145,2.98168498168,0.174450549451,2.98656898657,0.174450549451,2.99145299145,0.177197802198,3.08913308913,0.179945054945,3.16727716728,0.18025030525,3.18192918193,0.180860805861,3.1916971917,0.181166056166,3.19658119658,0.182387057387,3.23565323565,0.182692307692,3.26007326007,0.183913308913,3.28937728938,0.184523809524,3.29914529915,0.187576312576,3.36263736264,0.187881562882,3.37728937729,0.188492063492,3.42124542125,0.193681318681,3.61172161172,0.195207570208,3.62637362637,0.197954822955,3.71916971917,0.198870573871,3.75824175824,0.199786324786,3.8021978022,0.200091575092,3.81684981685,0.205280830281,3.90964590965,0.206501831502,4.02686202686,0.207722832723,4.03663003663,0.208028083028,4.0757020757,0.208333333333,4.10500610501,0.209249084249,4.11477411477,0.212606837607,4.23687423687,0.212912087912,4.24175824176,0.213522588523,4.24664224664,0.213827838828,4.27106227106,0.214133089133,4.28571428571,0.216575091575,4.38827838828,0.218101343101,4.42735042735,0.218406593407,4.43711843712,0.219017094017,4.442002442,0.219322344322,4.46642246642,0.219932844933,4.48595848596,0.220238095238,4.49572649573,0.220848595849,4.5641025641,0.222374847375,4.60805860806,0.226648351648,4.71062271062,0.227564102564,4.72039072039,0.22847985348,4.778998779,0.230006105006,4.87179487179,0.232448107448,4.91086691087,0.233058608059,4.9304029304,0.233974358974,4.98901098901,0.236721611722,5.06715506716,0.237332112332,5.08180708181,0.238247863248,5.10134310134,0.240995115995,5.21855921856,0.241910866911,5.23321123321,0.243131868132,5.28693528694,0.243437118437,5.2967032967,0.243742368742,5.33577533578,0.245268620269,5.39926739927,0.245879120879,5.40415140415,0.247710622711,5.5115995116,0.248626373626,5.57020757021,0.248931623932,5.57509157509,0.249847374847,5.63858363858,0.250763125763,5.69719169719,0.251068376068,5.70207570208,0.251373626374,5.7557997558,0.251678876679,5.78998778999,0.251984126984,5.83882783883,0.252289377289,5.9072039072,0.252594627595,5.94139194139,0.2528998779,6.00976800977,0.254731379731,6.11721611722,0.256257631258,6.12698412698,0.257478632479,6.18559218559,0.257783882784,6.20024420024,0.262973137973,6.2735042735,0.264194139194,6.30769230769,0.264804639805,6.31746031746,0.265415140415,6.32722832723,0.26572039072,6.33211233211,0.267551892552,6.3663003663,0.267857142857,6.37606837607,0.271825396825,6.44932844933,0.276709401709,6.4884004884,0.282509157509,6.52258852259,0.284951159951,6.53235653236,0.298076923077,6.60073260073,0.338675213675,6.68376068376,0.381715506716,6.7326007326,0.444291819292,6.80097680098,0.454365079365,6.81562881563,0.456501831502,6.82051282051,0.47268009768,6.85958485958,0.473290598291,6.86446886447,0.473901098901,6.86935286935,0.475427350427,6.87423687424,0.475732600733,6.87912087912,0.476953601954,6.884004884);


    this.b35.createResistor(circuitAttrPoint);

    //Creating 12V bullb
    this.b12 = new Resistor( "B12",
                             50,   //Resistance from mesurment data!?
                             24,
                             expBoard,
                             expBG,
                             './images/B12B.png',
                             "violet",
                             0.15, 8.75,
                             2.61, 2.41,
                             this.powerSupply,
                             circuitAttrPoint
                           );
    this.b12.setImageFileList(
        'bullb12V/bullb12V_croped004.jpg',
        //'bullb12V/bullb12V_croped005.jpg',
        //'bullb12V/bullb12V_croped006.jpg',
        'bullb12V/bullb12V_croped007.jpg',
        //'bullb12V/bullb12V_croped008.jpg',
        //'bullb12V/bullb12V_croped009.jpg',
        'bullb12V/bullb12V_croped010.jpg',
        //'bullb12V/bullb12V_croped011.jpg',
        //'bullb12V/bullb12V_croped012.jpg',
        'bullb12V/bullb12V_croped013.jpg',
        //'bullb12V/bullb12V_croped014.jpg',
        //'bullb12V/bullb12V_croped015.jpg',
        'bullb12V/bullb12V_croped016.jpg',
        //'bullb12V/bullb12V_croped017.jpg',
        //'bullb12V/bullb12V_croped018.jpg',
        'bullb12V/bullb12V_croped019.jpg',
        //'bullb12V/bullb12V_croped020.jpg',
        //'bullb12V/bullb12V_croped021.jpg',
        'bullb12V/bullb12V_croped022.jpg',
        //'bullb12V/bullb12V_croped023.jpg',
        //'bullb12V/bullb12V_croped024.jpg',
        'bullb12V/bullb12V_croped025.jpg',
        //'bullb12V/bullb12V_croped026.jpg',
        //'bullb12V/bullb12V_croped027.jpg',
        'bullb12V/bullb12V_croped028.jpg',
        //'bullb12V/bullb12V_croped029.jpg',
        //'bullb12V/bullb12V_croped030.jpg',
        'bullb12V/bullb12V_croped031.jpg',
        //'bullb12V/bullb12V_croped032.jpg',
        //'bullb12V/bullb12V_croped033.jpg',
        'bullb12V/bullb12V_croped034.jpg'
        );

    //toDo: read Measurments for 12V bullb

    this.b12.readMeasurData(0.02,0.01,0.43,0.15,0.72,0.42,0.58,0.45,0.69,0.56,1.07,0.61,0.91,0.81,1.08,1.15,1.33,1.31,1.75,1.32,1.4,1.55,1.58,1.83,2.12,1.98,1.76,2.16,1.79,2.21,1.88,2.48,2.29,2.51,1.82,2.8,2.03,2.82,2.3,2.99,2.11,3.05,2.26,3.46,2.4,3.51,2.5,3.84,2.47,3.92,2.67,4.19,2.57,4.28,2.75,4.78,2.82,4.82,2.75,4.92,2.67,5.11,2.92,5.21,2.88,5.21,3.01,5.53,3.13,5.6,3.1,5.85,3.2,6.19,3.29,6.28,3.27,6.39,3.39,6.49,3.4,6.51,3.31,6.59,3.42,6.91,3.56,7.41,3.58,7.52,3.63,7.69,3.64,7.75,3.53,7.88,3.74,8.08,3.8,8.21,3.78,8.22,3.81,8.41,3.89,8.46,3.87,8.58,3.85,8.7,3.91,8.85,3.96,9,4,9.1,4.01,9.18,4.04,9.36,4.06,9.44,4.15,9.5,4.1,9.53,4.19,9.78,4.15,9.88,4.16,9.89,4.19,9.95,4.24,10.04,4.23,10.18,4.39,10.41,4.42,10.69,4.36,10.75,4.38,10.84,4.33,10.97,4.44,11.03,4.51,11.04,4.56,11.42,4.56,11.47,4.62,11.7,4.59,11.79,4.66,11.92,4.64,12.06,4.67,12.13,4.71,12.22,4.72,12.25,4.73,12.25,4.74,12.28,4.79,12.47,4.85,12.77,4.87,12.87,4.9,13.04,4.9,13.06);

    this.b12.createResistor(circuitAttrPoint);
}
;/*

Napajalnik:

*  Napajalnik lahko prižge in ugasne s pritiskum na stikalo
*  Na napajalniku lahko spremija napetost do 24V.
*  Ob zamenjavi porabnika je prej potrebno ugasniti napajalnik! Uporabnik je opozorjen!

*/

//ToDo:


//Stvari ki niso dokoncane:

//Zelje:
// * ce je dinamicno dolocena velikost boardov, se more dinamicno tudi dolocati velikost texta.
// * Zamik zacetne vrednosti na originalno nastavitev.
// * Prestrukturiraj razred, dloloci javne in privatne metode!

//Zakaj nemorem uporabiti javnih metod v samem razredu.



function PowerSupply (am, graphs) {

    //Variables

    var self = this;

    this.amperText = am;
    this.graphs = graphs;
    //this.currentResistor = cr;

    //console.log(cr);

    this.isPsOn = false;
    this.currentVoltage = 0.00;
    this.currentCurrent = 0.000;
    this.currentResistor = undefined;

    this.i = 0;

    var currentAngle;

    //Image paths for power supply
    var powerSupplyBGImg = "./images/PSBackGround.png";
    var UButtonImg = "./images/UButton.png";
    var powerButtonONImg = "./images/PowerButton-on.png";
    var powerButtonOFFImg = "./images/PowerButton-off.png";

    var psBGCach = new Image(1, 1);
    psBGCach.src = powerSupplyBGImg;
    var ubCach = new Image(1, 1);
    ubCach.src = UButtonImg;
    var pbONCach = new Image(1, 1);
    pbONCach.src = powerButtonONImg;
    var pbOFFCach = new Image(1, 1);
    pbOFFCach.src = powerButtonOFFImg;


    //Main board for PowerSupply
    var psBoard = JXG.JSXGraph.initBoard('PowerS', {             //PowerS
        boundingbox: [0, 0, 12.00, 5.17],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false
    });


    //Power supply background image.
    var powerSupplyBG = psBoard.create('image', [powerSupplyBGImg, [0, 5.17], [12.00, 5.17]], {fixed: true, frozen: true, opacity: 1});

    //Text showing Voltage
    var UText = psBoard.create('text', [3.48, 1.00, ""], {anchorX: 'right', color: 'red', opacity: 0.4, fixed: true, fontsize: 35});

    //Voltage button!

    //Points helping with rotation of image.
    var psP01 = psBoard.create( 'point', [7.41, 2.29],
                                { name: '',
                                  color: 'green',
                                  opacity: 1.0,
                                  fixed: true,
                                  visible: false});

    var psP02 = psBoard.create( 'point', [8.05, 2.29],
                                { name: '',
                                  color: 'green',
                                  opacity: 0.7,
                                  fixed: true,
                                  visible: false });

    var psP03 = psBoard.create( 'point', [7.503987351477809, 2.623871513690196 ],
                                { name: '',
                                  color: 'green',
                                  opacity: 1.0,
                                  fixed: true,
                                  visible: false});


    //Arc on points psP01, psP02, ps03 for psGlider. psGlider on cicrle is for rotation of power button;
    var psArc = psBoard.create('arc', [psP02, psP01, psP03], {visible: true});
    //var psCircle = psBoard.create('circle', [psP02, psP01], {visible: true});
    //var psGlider = psBoard.create('glider', [7.90, 2.82, psCircle], {color: 'green', opacity: 0.5}); //Original positio ToDo: Implement offset!

   // var psGAttr01  = psBoard.create('glider', [7.41, 2.29, psCircle], {name: '', face: '[]', color: 'red', opacity: 1.0, visible: true, fixed: true});
    //var psGAttr02  = psBoard.create('point', [7.41, 2.29], {name: '', color: 'red', opacity: 1.0, visible: true});


    var psGlider = psBoard.create('glider', [7.41, 2.29, psArc],
                                  { name: '',
                                    color: 'green',
                                    opacity: 0.5,
                                    lable: false,
                                    // attractor: [psGAttr01],
                                    snapToPoints: true,
                                    attractorDistance: 0.2
                                  });
    //psGlider.addConstraint([7.69,1.76]);
    //Position of psGlider is always same as of point psP01.
    //psP01.setPosition(JXG.COORDS_BY_USER, [psGlider.X(), psGlider.Y()]);

    //Image of power button.
    var UButton = psBoard.create('image', [UButtonImg, [7.32, 3.11], [1.46, 1.54]], {fixed: true});

    //Button rotation

    //var angle = 0;

    var buttRot =  psBoard.create('transform', [
        function() {
            var angle = cAngle(psP02, psGlider);
            //var direction = getGliderDirection(angle);
            //console.log(direction);
            //console.log(angle);
            //console.log(psGlider.X(), psGlider.Y());

            return angle;

        }, psP02],  {type: 'rotate'});


    buttRot.bindTo(UButton);

    //Power supply on/off switch
    var psPwrBtnOn = psBoard.create('image', [powerButtonONImg, [10.00, 2.25], [0.70, 1.48], {fixed: true, frozen: true }]);
    var psPwrBtnOff = psBoard.create('image', [powerButtonOFFImg, [10.00, 2.25], [0.70, 1.48], {fixed: true, frozen: true }]);

    powerOff();
    //var startAngle = cAngle(psP02, psP01) + Math.PI;
    UText.setText(this.currentVoltage.toFixed(2));

    //Events

    //Draging the psGlider event

    psGlider.on('drag', function () {

        var angle = cAngle(psP02, psGlider);

        //Calculating current voltagte
        this.currentVoltage = cVoltage(angle, 25);
        UText.setText(this.currentVoltage.toFixed(2));

        //console.log("isOn: " + this.isPsOn);
        if ((this.currentResistor != undefined) && this.isPsOn && (this.currentResistor.isDestroyed == false)) {

            if (this.currentVoltage >= this.currentResistor.uMax) {
                this.currentResistor.destroyeR();
                this.brakeCircuit();
                //this.currentCurrent = 0;
                return;
            }

            //console.log("Current resistor in circuit: " +  this.currentResistor.name);
            //var i = 0;
            if (this.currentResistor.mData.length == 0)  {
                this.currentCurrent = this.currentVoltage/this.currentResistor.resistance;
            }
            else {
                // console.log("CV: " + this.currentVoltage);
                // console.log("MV: " + this.currentResistor.mData[this.i].U);

                if (this.currentVoltage > 0) {

                    while(this.currentVoltage > this.currentResistor.mData[this.i].U) {
                        //console.log("iUp");
                        this.i++;
                    }

                    while(this.currentVoltage < this.currentResistor.mData[this.i].U) {
                        //console.log("iDown");
                        this.i--;
                    }
                    //               console.log(this.i + ": " + this.currentResistor.mData[this.i].I);
                }
/*
toDo: Izboljsanje prikaza meritev predvsem vmesnih vrednosti

                var data01 = this.currentResistor.mData[this.i + 1];
                var data02 = this.currentResistor.mData[this.i];
                var calcResistenc = (Math.abs(data02.U - data01.U))/(Math.abs(data02.I - data01.I));
                console.log("tmp Resist: " +  calcResistenc);
                //this.currentCurrent = this.currentVoltage/calcResistenc;
*/
                this.currentCurrent = this.currentResistor.mData[this.i].I;
            }

            this.graphs.setCurrentVoltage(this.currentVoltage);
            this.graphs.setCurrentCurrent(this.currentCurrent);
            this.amperText.setText((this.currentCurrent).toFixed(3));

            if (this.currentResistor.isBullb) {
                if (this.currentVoltage < this.currentResistor.uMax) {
                    this.currentResistor.animate(this.currentResistor.uMax * 10, this.currentVoltage * 10);
                }
            }
        //console.log(currentResistor);
        }
        else {

        }


    }, this);

    //Mouse down event for power button on button coordinates.

    //Geting mouse coordinates
    var getMouseCoords = function(e, i) {
        var cPos = psBoard.getCoordsTopLeftCorner(e, i),

            absPos = JXG.getPosition(e, i),
            dx = absPos[0]-cPos[0],
            dy = absPos[1]-cPos[1];

        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], psBoard);
    };

    //Event function for power ON/OFF
    var  powerDown = function(e) {
        var i, coords;

        if (e[JXG.touchProperty]) {
            // index of the finger that is used to extract the coordinates
            i = 0;
        }

        coords = getMouseCoords(e, i);

        //Checking if mouse is on area of power switch.
        //usrCoords are same as on psBoard.
        if (isInsideArea([10.00, 10.70, 0.77, 2.25 ], coords.usrCoords[1], coords.usrCoords[2])) {
            //console.log(isPsOn);
            powerOnOff();
        }
    };

    psBoard.on('down', powerDown);

    //Helper functions

    //Setting point

    //var psP03 = psBoard.create('point', [3.0, 2.29], {name: '', color: 'green', opacity: 0.7, fixed: false});

    //Method for calculating angle between psP01 and psP02
    function cAngle (point01, point02) {
        return Math.atan2(point02.Y()-point01.Y(), point02.X()-point01.X()) + Math.PI;
    }

    var prevAngle = 0;
    function getGliderDirection(angle) {
        var direction = 0;
        if (angle > prevAngle) {
            direction = 1;
        }
        else {
            direction = -1;
        }

        prevAngle = angle;
        return direction;
    }

    //Power on/off switcher.
    function powerOnOff () {
        if (self.isPsOn) {
            powerOff();
        }
        else {
            powerOn();
        }
    }

    //Power on changes
    function powerOn () {
        console.log('PowerOn');
        psPwrBtnOn.setAttribute({visible: true});
        psPwrBtnOff.setAttribute({visible: false});
        UText.setAttribute({visible: true});
        self.isPsOn = true;
        //console.log("CR: " + self.currentResistor.resistance);
        if (self.currentResistor != undefined) {
            self.connectCircuit();
            self.currentCurrent = self.currentVoltage/self.currentResistor.resistance;
        }

    }

    //Power off changes
    function powerOff () {
        console.log('PowerOff');
        psPwrBtnOn.setAttribute({visible: false});
        psPwrBtnOff.setAttribute({visible: true});
        UText.setAttribute({visible: false});
        self.isPsOn = false;
        self.currentCurrent = 0;
        self.graphs.setCurrentVoltage(0.000);
        self.graphs.setCurrentCurrent(0.000);

        if (self.currentResistor != undefined)
            self.brakeCircuit();

    }

    function isInsideArea (areaCords, dx, dy) {
        var x0 = areaCords[0];
        var x1 = areaCords[1];
        var y0 = areaCords[2];
        var y1 = areaCords[3];

        if (((dx >= x0) && (dx <= x1)) && ((dy >= y0) && (dy <= y1)))
            return true;
        else
            return false;
    }

    //Calculating Voltage from angle of rotation!
    function cVoltage (angleRadian, voltageMax) {
        var angleMax = 2*Math.PI - (2*Math.PI - 5.734373097426285);

        if ((angleRadian > 0) && (angleRadian < angleMax))
            return angleRadian * voltageMax/(angleMax);
        else
            return 0.00;
    }


    //Setting up geters and setters
    //powerS.addChild(graphUI);
    //powerS.addChild(amperM);
}



PowerSupply.prototype.getCurrentVoltage = function() {
    return this.currentVoltage;
};

PowerSupply.prototype.getCurrentCurrent = function() {
    return this.currentCurrent;
};

PowerSupply.prototype.getGraphColor = function() {
    if (this.currentResistor != undefined)
        return this.currentResistor.gColor;
    else
        return "black";
};

PowerSupply.prototype.setCurrentResistor = function(resistor) {
    this.currentResistor = resistor;
};

PowerSupply.prototype.brakeCircuit = function() {
    this.amperText.setText("0.000");
    this.currentCurrent = 0;
    this.graphs.setCurrentVoltage(0.000);
    this.graphs.setCurrentCurrent(0.000);

    if (this.currentResistor) {
        this.currentResistor.takeBullb();
    }
};

PowerSupply.prototype.connectCircuit = function() {
    //console.log("ccBool:" + this.isPsOn);
    //console.log("ccBool:" + this.isPsOn);
    //console.log(this.currentVoltage);
    //console.log(this.currentResistor.resistance);

    if (this.isPsOn) {
        //!?
        if (this.currentVoltage >= this.currentResistor.uMax) {
            this.currentResistor.destroyeR();
            this.brakeCircuit();
            //this.currentCurrent = 0;
            return;
        }

        this.amperText.setText((this.currentVoltage/this.currentResistor.resistance).toFixed(3));
        this.currentCurrent = this.currentVoltage/this.currentResistor.resistance;
        this.currentResistor.putBullb();
        this.graphs.setCurrentVoltage(this.currentVoltage);
        this.graphs.setCurrentCurrent(this.currentCurrent);
        this.graphs.setGraphColor(this.currentResistor.gColor);
        if (this.currentResistor.isBullb)
            this.currentResistor.animate(this.currentResistor.uMax * 10, this.currentVoltage * 10);
    }
};
;function AmperMeter() {

    var amBgImgPath = './images/AmperMeter.png';

    var amBGCach = new Image(1, 1);
    amBGCach.src = amBgImgPath;

    var amBoard = JXG.JSXGraph.initBoard('AmperM', {
        boundingbox: [0, 0, 10.41, 18.12],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false
    });

    var amBGImage = amBoard.create('image', [amBgImgPath, [0, 18.12], [10.41, 18.12]], {fixed: true, opacity: 1});

    this.amText = amBoard.create('text', [8.25, 3.55, "0.000"], {anchorX: 'right', color: 'black', opacity: 0.6, fixed: true, fontsize: 35});

//    console.log(uiPowerSupply.getCurrentVoltage());

}
;//GraphUI
function Graphs () {

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

Graphs.prototype.setCurrentVoltage = function(voltage) {
    this.currentVoltage = voltage;
    this.gDisplayVoltage.setText(this.currentVoltage.toFixed(3) + "V");


};

Graphs.prototype.setCurrentCurrent = function(current) {
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

Graphs.prototype.setGraphColor = function(color) {
    this.gColor = color;
};

Graphs.prototype.start = function() {
    this.timerOn = true;
    this.SWatch.start();
};


Graphs.prototype.stop = function() {
    this.timerOn = false;
    this.SWatch.stop();
};

Graphs.prototype.reset = function() {
    this.changeInner("Timer", "00:00");

    this.SWatch.reset();
};

Graphs.prototype.createGraphs = function() {

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

Graphs.prototype.deleteGraphs = function() {
    JXG.JSXGraph.freeBoard(this.graphU);
    JXG.JSXGraph.freeBoard(this.graphI);
    JXG.JSXGraph.freeBoard(this.graphR);
};

Graphs.prototype.clear = function() {
    this.deleteGraphs();
    this.createGraphs();
};

Graphs.prototype.changeInner = function(id, text) {
    var element = document.getElementById(id);
    element.innerHTML = text;
};

Graphs.prototype.updateTime = function() {
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
;function Interface() {
    this.showHideElmt('hideOA');
}

Interface.prototype.showGraphs = function() {
    //this.uiGraphs = new Graphs();
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    self.uiGraphs.createGraphs();
};

Interface.prototype.showAM = function() {
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    //self.uiGraphs.deleteGraphs();
};


Interface.prototype.showHideElmt = function(id) {
    var element = document.getElementById(id);
    console.log(element.style.display);
    if (element.style.display == 'block')
        element.style.display = 'none';
    else
        element.style.display = 'block';
};
;//Chrome flickering problem Solution found:
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
var uiGraphs = new Graphs();
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
