function Interface() {

    this.showHideElmt('hideOA');
    this.showHideElmt('small_help');
    var that = this;

    document.getElementById('small_help').addEventListener("click", function(event) {
        that.showHideElmt('small_help');
    }, false);

    document.getElementById('big_help').addEventListener("click", function(event) {
        that.showHideElmt('big_help');
    }, false);
}

Interface.prototype.showGraphs = function() {
    //this.uiGraphs = new Graphs();
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    this.showHideElmt('big_help');
    self.uiCollectData.createGraphs();
};

Interface.prototype.showAM = function() {
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    //self.uiCollectData.deleteGraphs();
};

//Show small_help
Interface.prototype.showSmallHelp = function() {
    this.showHideElmt('small_help');
};

//Show big_help
Interface.prototype.showBigHelp = function() {
    this.showHideElmt('big_help');
};


Interface.prototype.showHideElmt = function(id) {
    var element = document.getElementById(id);
    console.log(element.style.display);
    if (element.style.display == 'block')
        element.style.display = 'none';
    else
        element.style.display = 'block';
};
