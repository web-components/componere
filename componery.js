/*globals ComponentInstance:true, Component:true, ConnectorInstance:true, Connector:true, document:false*/
var components, connectors,
    componentElements, connectorElements, head;

components = [];
connectors = [];

ComponentInstance = function (element) {
    this.element   = element;
    this.id        = element.id;
    this.src       = element.attributes.src.value;
    this.component = element.attributes.component.value;
    this.listeners = [];

    if (!this.id) {throw new Error('Component must have id');}
    if (!this.src) {throw new Error('Component must have src');}
    if (!this.component) {throw new Error('Component must have component');}

    this.load();
};

ComponentInstance.prototype.on = function (event, callback) {
    this.listeners.push({event : event, callback : callback});
};

ComponentInstance.prototype.emit = function (event, data) {
    var i;

    for (i = 0; i < this.listeners.length; i += 1) {
        if (this.listeners[i].event === event) {
            this.listeners[i].callback.apply(document, data);
        }
    }
};

ComponentInstance.prototype.load = function () {
    var script;

    script = document.createElement('script');
    script.src = this.src;

    head.appendChild(script);
};

ComponentInstance.prototype.init = function (constructor) {
    constructor.apply(this, [this.element]);
};

ConnectorInstance = function (element) {
    this.element    = element;
    this.src        = element.attributes.src.value;
    this.components = element.attributes.components.value.split(',');
    this.connector  = element.attributes.connector.value;

    if (!this.src) {throw new Error('Connector must have src');}
    if (!this.components) {throw new Error('Connector must have components');}
    if (!this.connector) {throw new Error('Connector must have connector');}

    this.load();
};

ConnectorInstance.prototype.load = function () {
    var script;

    script = document.createElement('script');
    script.src = this.src;

    head.appendChild(script);
};

ConnectorInstance.prototype.init = function (constructor) {
    var data, i, j;

    data = [];

    for (i = 0; i < this.components.length; i += 1) {
        for (j = 0; j < components.length; j += 1) {
            if (components[j].id === this.components[i]) {
                data.push(components[j]);
            }
        }
    }

    constructor.apply(this, data);
};

Component = function (name, constructor) {
    var i;

    for (i = 0; i < components.length; i += 1) {
        if (components[i].component === name) {
            components[i].init(constructor);
        }
    }
};

Connector = function (name, constructor) {
    var i;

    for (i = 0; i < connectors.length; i += 1) {
        if (connectors[i].connector === name) {
            connectors[i].init(constructor);
        }
    }
};

window.onload = function () {
    var i;

    head              = document.getElementsByTagName('head')[0];
    componentElements = document.querySelectorAll('dcc-component');
    connectorElements = document.querySelectorAll('dcc-connector');

    for (i = 0; i < componentElements.length; i += 1) {
        components[i] = new ComponentInstance(componentElements[i]);
    }

    for (i = 0; i < connectorElements.length; i += 1) {
        connectors[i] = new ConnectorInstance(connectorElements[i]);
    }
};