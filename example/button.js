Component('Button', function (element) {
    'use strict';

    var self;

    self = this;

    this.status = function () {
        return element.innerHTML;
    }

    this.turnOn = function () {
        element.innerHTML = 'on';
        this.emit('turnOn');
    };

    this.turnOff = function () {
        element.innerHTML = 'off';
        this.emit('turnOff');
    };

    element.onclick = function () {
        if (self.status() === 'on') {
            self.turnOff();
        } else {
            self.turnOn();
        }
    }

    this.turnOff();
});
