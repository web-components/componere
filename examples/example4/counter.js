var Counter;
Counter = new Component('./counter.js');
Counter.extend('./ui-element.js');
Counter.listen('tickEvent', function (timer) {
    this.add();
});
Counter.provide('counterInterface', function () {
    return  {
        'add' : this.add,
        'get' : this.get
    };
});
Counter.install(function (element) {
    var counted = 0;

    this.add = function () {
        counted += 1;
        this.html(counted.toString());
    };

    this.get = function () {
        return counted;
    }
});
