var Car;
Car = new Component('./car.js');
Car.extend('./ui-element.js');
Car.listen('tickEvent', function () {
  this.move();
});
Car.require('counterInterface', function (counter, done) {
  this.counter = counter;
  done();
});
Car.install(function (done) {
  this.move = function () {
    var ground, i;
    ground = '';
    for (i = 0; i < this.counter.get(); i += 1) {
      ground += '-';
    }
    this.html(ground + '(=>)');
  };

  done();
});