/*

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
