var Timer;

Timer = new Component('./timer.js');
Timer.publish('tickEvent');
Timer.provide('timerInterface', function () {
    return {
        'tick' : this.tick
    };
});
Timer.install(function (element) {
    this.tick = function () {
        this.tickEvent();
        element.innerHTML = element.innerHTML === '-' ? '|' : '-';
    };
});
Timer.start(function () {
    setInterval(this.tick.bind(this), 1000);
});