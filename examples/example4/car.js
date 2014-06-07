var Car;

Car = new Component('./car.js');
Car.extends('./ui-element.js');
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
Car.build(function (element) {
    this.move = function () {
        var ground, i;

        ground = '';
        for (i = 0; i < this.counter.get(); i += 1) { ground += '-'; }

        this.html(ground + '(=>)');
    };
});