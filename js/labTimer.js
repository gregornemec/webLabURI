//Learning use of time events with JS!

//Basic clock

/*function updateClock () {
    var currentTime = new Date();

    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    //Formating Time!
    currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;

    //Clock output
    document.getElementById("showTimer").firstChild.nodeValue = currentTimeString;
}

//Basic stopWatch
// https://gist.github.com/electricg/4372563

var classStopWatch = function() {
    var startAt = 0;
    var lapTime = 0;

    var now = function () {
        var dateNow = new Date();
        return dateNow.getTime();
    };

    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    this.stop = function () {
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
    };

    this.reset = function() {
        lapTime = startAt = 0;
    };

    this.time = function () {
        return lapTime + (startAt ? now() - startAt : 0);
    };
};

var x = new classStopWatch();
var $time;
var clockTimer;

function pad (num, size) {
    var s = '0000' + num;
    return s.substr(s.length - size);
}

function formatTime (time) {
    var h = 0;
    var m = 0;
    var s = 0;
    var ms = 0;

    var newTime = '';

    h = Math.floor( time / (60 * 60 * 1000));
    time = time % (60 * 60 * 1000);

    m = Math.floor( time / (60 * 1000));
    time = time % (60 * 1000);

    s = Math.floor( time / (1000));
    time = time % (1000);

    ms = time % 1000;

    newTime = pad(h, 2) + ":"  + pad(m, 2) + ":" + pad(s, 2) + ":" + pad(ms, 2);
    return newTime;

}

function show () {
    $time = document.getElementById('showTimer');
    update();
}

function update () {
    $time.innerHTML = formatTime(x.time());
}

function start () {
    clockTimer = setInterval("update()", 1);
    x.start();
}

function stop () {
    x.stop();
    clearInterval(clockTimer);
}

function restart () {
    stop();
    x.reset();
    update();

}

//my Timer class
//http://www.codeproject.com/Articles/29330/JavaScript-Stopwatch

function stopWatch() {
    var startTime = null;
    var stopTime = null;
    var running = false;

    function getTime() {
        var day = new Date();

        return day.getTime();
    }

    this.start = function() {

        if (running == true)
            return;
        else if (startTime == null)
            stopTime = null;

        running = true;
        startTime = getTime();
    };

    this.stop = function() {

        if (running == false)
            return;

        stopTime = getTime();
        running = false;
    };

    this.duration = function() {
        if (startTime == null || stopTime == null)
            return 'Undefined';
        else
            return (stopTime - startTime) / 1000;
    };
}

var SWatch = new stopWatch();

//updateTime();

var timer = setInterval(function() { updateTime(); }, 1);
*/
