var Timer;
Timer = new Component('./timer.js');
Timer.install(function (done) {
  this.tick = function () {
    this.element.innerHTML = this.element.innerHTML === '-' ? '|' : '-';
  };
  done();
});
Timer.start(function (done) {
  setInterval(this.tick.bind(this), 1000);
  done();
});