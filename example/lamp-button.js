Connector('LampButton', function (lamp, button) {
    'use strict';

    button.on('turnOn', function () {
        lamp.turnOn();
    });

    button.on('turnOff', function () {
        lamp.turnOff();
    });
});
