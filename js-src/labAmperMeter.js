function AmperMeter() {

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
