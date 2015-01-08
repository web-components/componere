var Timer;
Timer = new Component('./timer.js');
Timer.extend('./ui-element.js');
Timer.install(function (done) {
  this.tick = function () {
    this.html(this.html() === '-' ? '|' : '-')
  };
  done();
});
Timer.start(function (done) {
  setInterval(this.tick.bind(this), 1000);
  done();
});