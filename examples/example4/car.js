var Car;
Car = new Component('./car.js');
Car.extend('./ui-element.js');
Car.require('counterInterface', function (counter) {
    this.counter = counter;
});
Car.listen('tickEvent', function (timer) {
    this.move();
});
Car.provide('carInterface', function () {
    return  {
        'move' : this.move
    };
});
Car.install(function (element) {
    this.move = function () {
        var ground, i;
        ground = '';
        for (i = 0; i < this.counter.get(); i += 1) { ground += '-'; }
        this.html(ground + '(=>)');
    };
});