function Interface() {
    this.showHideElmt('hideOA');
}

Interface.prototype.showGraphs = function() {
    //this.uiGraphs = new Graphs();
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    self.uiCollectData.createGraphs();
};

Interface.prototype.showAM = function() {
    this.showHideElmt('hideOA');
    this.showHideElmt('Graphs');
    //self.uiCollectData.deleteGraphs();
};


Interface.prototype.showHideElmt = function(id) {
    var element = document.getElementById(id);
    console.log(element.style.display);
    if (element.style.display == 'block')
        element.style.display = 'none';
    else
        element.style.display = 'block';
};
