var Counter;
Counter = new Component('./counter.js');
Counter.extend('./ui-element.js');
Counter.listen('tickEvent', function (data) {
  this.add();
});
Counter.install(function (done) {
  var counted = 0;

  this.add = function () {
    counted += 1;
    this.html(counted.toString());
  };

  this.get = function () {
    return counted;
  };

  done();
});
