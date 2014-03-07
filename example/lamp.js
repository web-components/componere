Component('Lamp', function (element) {
    'use strict';

    this.status = function () {
        return element.innerHTML;
    }

    this.turnOn = function () {
        element.innerHTML = 'on';
    };

    this.turnOff = function () {
        element.innerHTML = 'off';
    };

    this.turnOff();
});
