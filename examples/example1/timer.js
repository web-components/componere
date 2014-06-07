var Timer;

Timer = new Component('./timer.js');
Timer.provide('timerInterface', function () {
    return {
        'tick' : this.tick
    };
});
Timer.build(function (element) {
    this.tick = function () {
        element.innerHTML = element.innerHTML === '-' ? '|' : '-';
    };

    setInterval(this.tick.bind(this), 1000);
});