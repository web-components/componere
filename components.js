(function (window) {
    var ComponentManager, components, head;

    ComponentManager = {};
    components       = [];
    head             = document.getElementsByTagName('head')[0];

    ComponentManager.register = function (component) {
        if (!this.find(component.name)) { components.push(component); }
    };

    ComponentManager.find = function (name) {
        var i;
        for (i = 0; i < components.length; i += 1) {
            if (components[i].name === name) { return components[i]; }
        }
        return null;
    };

    ComponentManager.load = function (name) {
        var component, script;
        component = ComponentManager.find(name);
        if (!component) {
            script = document.createElement('script');
            script.src = name;
            head.appendChild(script);
        }
    };

    ComponentManager.instances = [];

    setInterval(function () {
        var tags, i, j, provider, providerName, providerEvent, requirer, requirerName, requirerMethod, started;
        tags = document.getElementsByTagName('dcc-connector');

        for (i = 0; i < tags.length; i += 1) {
            started        = tags[i].getAttribute('started');
            providerName   = tags[i].getAttribute('provider').split('.')[0];
            requirerName   = tags[i].getAttribute('requirer').split('.')[0];
            providerEvent  = tags[i].getAttribute('provider').split('.')[1];
            requirerMethod = tags[i].getAttribute('requirer').split('.')[1];
            if (!started) {
                for (j = 0; j < ComponentManager.instances.length; j += 1) {
                    if (providerName === ComponentManager.instances[j].id) {
                        provider = ComponentManager.instances[j]
                    }
                }
                for (j = 0; j < ComponentManager.instances.length; j += 1) {
                    if (requirerName === ComponentManager.instances[j].id) {
                        requirer = ComponentManager.instances[j]
                    }
                }
                if (provider && requirer) {
                    provider.bind(providerEvent, function () {
                        requirer[requirerMethod]();
                    });
                    tags[i].setAttribute('started', true);
                }
            }
        }
    }, 50);

    setInterval(function () {
        var tags, i, type, loading;
        tags  = document.getElementsByTagName('dcc-component');

        for (i = 0; i < tags.length; i += 1) {
            type    = tags[i].getAttribute('type');
            loading = tags[i].getAttribute('loading');
            if (type && !loading) {
                tags[i].setAttribute('loading', true);
                ComponentManager.load(type);
            }
        }
    }, 50);

    setInterval(function () {
        var tags, i, component, type, started;
        tags  = document.getElementsByTagName('dcc-component');

        for (i = 0; i < tags.length; i += 1) {
            type    = tags[i].getAttribute('type');
            started = tags[i].getAttribute('started');
            if (type && !started) {
                component = ComponentManager.find(type);
                if (component && component.canBuild()) {
                    tags[i].setAttribute('started', true);
                    component.build(tags[i]);
                }
            }
        }
    }, 50);

    window.ComponentManager = ComponentManager;
})(window);

(function (window) {
    'use strict';

    var Component;

    Component = function (name) {
        var component;

        component = window.ComponentManager.find(name);
        if (component) { return component; }

        this.name          = name;
        this._parents      = [];
        this._listenners   = [];
        this._constructors = [];

        window.ComponentManager.register(this);
    };

    Component.prototype.extends = function (parent) {
        this._parents.push(parent);
        ComponentManager.load(parent);
    };

    Component.prototype.provide = function (name, fn) {
        this._constructors.push({'name' : name, fn : fb});
    };

    Component.prototype.bind = function (evt, cb) {
        this._listenners.push({evt : evt, cb : cb});
    };

    Component.prototype.notify = function (evt) {
        var i;
        for (i = 0; i < this._listenners.length; i += 1) {
            if (this._listenners[i].evt === evt) {
                this._listenners[i].cb();
            }
        }
    };

    Component.prototype.build = function (element) {
        var i, parent;
        if (!this.canBuild()) { return; }
        for (i = 0; i < this._parents.length; i += 1) {
            parent = window.ComponentManager.find(this._parents[i])
            if (parent) { parent._constructor.apply(this, [element]); }
        }
        this._constructor.apply(this, [element]);
        this.id = element.getAttribute('id');
        ComponentManager.instances.push(this);
    };

    Component.prototype.canBuild = function (element) {
        var i, parent;
        for (i = 0; i < this._parents.length; i += 1) {
            parent = window.ComponentManager.find(this._parents[i])
            if (!parent) { return false; }
        }
        return true;
    };

    window.Component = Component;
})(window);