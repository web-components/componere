var Timer;
Timer = new Component('./timer.js');
Timer.extend('./ui-element.js');
Timer.publish('tickEvent');
Timer.install(function (done) {
  this.tick = function () {
    this.html(this.html() === 'tick' ? 'tack' : 'tick')
    this.tickEvent();
  };
  done();
});
Timer.start(function (done) {
  setInterval(this.tick.bind(this), 1000);
  done();
});