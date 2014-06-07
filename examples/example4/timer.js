var Timer;

Timer = new Component('./timer.js');
Timer.extends('./ui-element.js');
Timer.publish('tickEvent', function () {
    return true;
});
Timer.provide('timerInterface', function () {
    return {
        'tick' : this.tick
    };
});
Timer.build(function (element) {
    this.tick = function () {
        this.tickEvent();
        this.html(this.html() === '-' ? '|' : '-')
    };

    setInterval(this.tick.bind(this), 1000);
});