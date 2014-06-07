var Timer;

Timer = new Component('./timer.js');
Timer.extends('./ui-element.js');
Timer.provide('timerInterface', function () {
    return {
        'tick' : this.tick
    };
});
Timer.build(function (element) {
    this.tick = function () {
        this.html(this.html() === '-' ? '|' : '-')
    };

    setInterval(this.tick.bind(this), 1000);
});