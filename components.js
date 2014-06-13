/*globals window:false*/
/**
 * @class
 * @summary Component class.
 */
(function (window) {
    'use strict';

    var Component, components, instances, REFRESH_INTERVAL;
    REFRESH_INTERVAL = 100;
    components = [];
    instances  = [];

    /**
     * @constructor
     *
     * @param {String} uri Component URI.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined component URI.
     * @throws {Error} repeated component URI.
     */
    Component = function (uri) {
        if (!uri) { throw new Error('undefined component URI.'); }
        if (Component.findComponent(uri)) { throw new Error('repeated component URI.'); }

        this.uri       = uri;
        this.listens   = [];
        this.publishes = [];
        this.provides  = [];
        this.requires  = [];
        this.extends   = [];
        this.installs  = [];
        this.starts    = [];
        components.push(this);
    };

    /**
     * @method
     * @summary Attach listener to component.
     * This method tels the framework that when a event is fired the callback function must be called. Only the events
     * fired by the component attached by the connector html tag with the correct name must be listened.
     *
     * @param {String} eventName Event name which the component subscribe to listen.
     * @param {Function} eventListener Function to be called when the event is fired.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined event name.
     * @throws {Error} undefined event listener.
     */
    Component.prototype.listen = function (eventName, eventListener) {
        if (!eventName) { throw new Error('undefined event name.'); }
        if (!eventListener) { throw new Error('undefined event listener.'); }

        this.listens.push({
            'eventName'     : eventName,
            'eventListener' : eventListener
        });

        return this;
    };

    /**
     * @method
     * @summary Attach emitter to component.
     * This method tels the framework that this component emits an event with a given name. This is used to append to
     * the component a method with the event name which triggers the event.
     *
     * @param {String} eventName Event name which the component emits.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined event name.
     */
    Component.prototype.publish = function (eventName) {
        if (!eventName) { throw new Error('undefined event name.'); }

        this.publishes.push({
            'eventName' : eventName
        });

        return this;
    };

    /**
     * @method
     * @summary Provides a interface.
     * This method tels the framework that this component provides an interface. This interface is provided by a
     * function which returns the interface, the context which this function runs is the component context, which means
     * that all component methods are available.
     *
     * @param {String} interfaceName Name of the interface provided by the component.
     * @param {Function} interfaceProvider Constructor of the interface provided.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined interface name.
     * @throws {Error} undefined interface provider.
     */
    Component.prototype.provide = function (interfaceName, interfaceProvider) {
        if (!interfaceName) { throw new Error('undefined interface name.'); }
        if (!interfaceProvider) { throw new Error('undefined interface provider.'); }

        this.provides.push({
            'interfaceName'     : interfaceName,
            'interfaceProvider' : interfaceProvider
        });

        return this;
    };

    /**
     * @method
     * @summary Requires a interface.
     * This method tels the framework that this component requires an interface. To detect which instance provides the
     * required interface, the connector html tag must be used, so that only the correct interface name provided by the
     * connected component is used. The connector is executed in the component context which means that the required
     * interface can be attached as a property of the component.
     *
     * @param {String} interfaceName Name of the interface required by the component.
     * @param {Function} interfaceConnector Function called to attach the required component to the applicant.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined interface name.
     * @throws {Error} undefined interface connector.
     */
    Component.prototype.require = function (interfaceName, interfaceConnector) {
        if (!interfaceName) { throw new Error('undefined interface name.'); }
        if (!interfaceConnector) { throw new Error('undefined interface connector.'); }

        this.requires.push({
            'interfaceName'      : interfaceName,
            'interfaceConnector' : interfaceConnector
        });

        return this;
    };

    /**
     * @method
     * @summary Extend a component.
     * This method tels the framework that this component extends another component. So, the framework loads the parent
     * component looking by the parent URI and only loads the component when the parent is ready.
     *
     * @param {String} parentUri Uri of the parent component.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined parent uri.
     */
    Component.prototype.extend = function (parentUri) {
        var head, script;

        if (!parentUri) { throw new Error('undefined parent uri.'); }

        this.extends.push({
            'parentUri' : parentUri
        });

        if (!document.querySelector('[src="' + parentUri + '"]')) {
            head       = document.getElementsByTagName('head')[0];
            script     = document.createElement('script');
            script.src = parentUri;
            head.appendChild(script);
        }

        return this;
    };

    /**
     * @method
     * @summary Builds a component.
     * This method tels the framework that to build the component this passing method should be executed, notices that
     * in this stage, the required interfaces weren't provided.
     *
     * @param {Function} componentInstaller Installer function.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined component installer.
     */
    Component.prototype.install = function (componentInstaller) {
        if (!componentInstaller) { throw new Error('undefined component installer.'); }

        this.installs.push({
            'componentInstaller' : componentInstaller
        });

        return this;
    };

    /**
     * @method
     * @summary Builds a component.
     * This method tels the framework that after the component is ready, the method should be called, notice that in
     * this stage, all required interface were provided.
     *
     * @param {Function} componentStarter Constructor function.
     * @returns {Component} Returns the self component.
     * @throws {Error} undefined component starter.
     */
    Component.prototype.start = function (componentStarter) {
        if (!componentStarter) { throw new Error('undefined component starter.'); }

        this.starts.push({
            'componentStarter' : componentStarter
        });

        return this;
    };

    /**
     * @method
     * @summary Checks if component is ready to start.
     * This method should look into all component requirements to check if the component and all its required interfaces
     * have already been loaded in the framework.
     *
     * @returns {Boolean} Returns if component is ready.
     */
    Component.prototype.readyToStart = function (instance) {
        if (!instance) { throw new Error('undefined component instance.'); }

        return this.requires.every(function (required) {
            return !!Component.findInstance(instance.element.getAttribute(required.interfaceName));
        }) && this.listens.every(function (listener) {
            return !!Component.findInstance(instance.element.getAttribute(listener.eventName));
        });
    };

    /**
     * @method
     * @summary Checks if component is ready to install.
     * This method should look into all component parents to checks if the component and its parents have already been
     * loaded into the framework.
     *
     * @returns {Boolean} Returns if component is ready.
     */
    Component.prototype.readyToInstall = function () {
        return !!Component.findComponent(this.uri) && this.extends.every(function (extend) {
            return Component.findComponent(extend.parentUri);
        });
    };

    /**
     * @method
     * @summary Starts component instance.
     * This method should start a component instance. When starting a component instance, this method should attach all
     * required interfaces to the component and subscribe to all required event emitters.
     *
     * @param {ComponentInstance} instance Instance to be started.
     * @returns {ComponentInstance} Returns the started component instance.
     * @throws {Error} undefined component instance.
     */
    Component.prototype.startInstance = function (instance) {
        if (!instance) { throw new Error('undefined component instance.'); }

        this.requires.forEach(function (required) {
            var requiredInterface  = Component.findInstance(instance.element.getAttribute(required.interfaceName));
            required.interfaceConnector.apply(instance, [requiredInterface.interfaces[required.interfaceName]]);
        });
        this.listens.forEach(function (listener) {
            var eventEmitter  = Component.findInstance(instance.element.getAttribute(listener.eventName));
            eventEmitter.element.addEventListener(listener.eventName, listener.eventListener.bind(instance));
        });
        this.starts.forEach(function (starter) {
            starter.componentStarter.apply(instance, []);
        });
        instance.started = true;
        return instance;
    };

    /**
     * @method
     * @summary Creates a new component instance.
     * This method should create a new component instance. When creating a new component instance, this method should
     * apply to the object all parents installers and all installers attached to the component.
     *
     * @param {DOMElement} element Element to apply component instance.
     * @param {String} id Component instance id.
     * @returns {ComponentInstance} Returns the created component instance.
     * @throws {Error} undefined dom element.
     * @throws {Error} undefined id.
     */
    Component.prototype.installInstance = function (element, id) {
        if (!element) { throw new Error('undefined dom element.'); }
        if (!id) { throw new Error('undefined id.'); }

        var instance = {};
        instance.interfaces = {};
        this.extends.forEach(function (extend) {
            var parent = Component.findComponent(extend.parentUri).installInstance(element, id)
            for (var j in parent) { instance[j] = parent[j]; }
        });
        this.installs.forEach(function (install) {
            install.componentInstaller.apply(instance, [element]);
        });
        this.publishes.forEach(function (publisher) {
            var event = new Event(publisher.eventName);
            instance[publisher.eventName] = function () { element.dispatchEvent(event); };
        });
        this.provides.forEach(function (provided) {
            instance.interfaces[provided.interfaceName] = provided.interfaceProvider.apply(instance, []);
        });
        instance.id        = id;
        instance.component = this;
        instance.started   = false;
        instance.element   = element;
        return instance;
    };

    /**
     * @static
     * @summary Searches for a component type by a URI.
     * This method should look if a component has been loaded. If the component have already been loaded, this method
     * should return it.
     *
     * @param {String} uri Uri to look for the component.
     * @returns {Component} Returns the component identified by the URI.
     * @throws {Error} undefined component URI.
     */
    Component.findComponent = function (uri) {
        if (!uri) { throw new Error('undefined component URI.'); }

        return components.filter(function (component) {
            return component.uri === uri;
        }).pop();
    };

    /**
     * @static
     * @summary Searches for a component instance by id.
     * This method should look if a component instance exists. If the instance have already been instantiated, this
     * method should return the instance.
     *
     * @param {String} id Id to look for the instance.
     * @returns {ComponentInstance} Returns the component instance identified by the id.
     * @throws {Error} undefined instance id.
     */
    Component.findInstance = function (id) {
        if (!id) { throw new Error('undefined instance id.'); }

        return instances.filter(function (instance) {
            return instance.id === id;
        }).pop();
    };

    /**
     * @static
     * @summary Seeks for component instances in the UI that can be started.
     * In every interval, the framework must look into the DOM tree and seeks for components which haven't been
     * started, and see if all required interfaces can be provided, and than starts the component.
     */
    Component.seekComponentsToStart = function () {
        instances.filter(function (instance) {
            return !instance.started && instance.component.readyToStart(instance);
        }).forEach(function (instance) {
            instance.component.startInstance(instance);
        });
    };

    /**
     * @static
     * @summary Seeks for component instances in the UI that can be installed.
     * In every interval, the framework must look into the DOM tree and seeks for components which haven't been
     * installed, and install them.
     *
     * @throws {Error} undefined component type.
     * @throws {Error} undefined component id.
     */
    Component.seekComponentsToInstall = function () {
        var elements, i,
            element, id, type, component;

        elements = document.querySelectorAll('component:not([installed])');
        for (i = 0; i < elements.length; i += 1) {
            element = elements[i];
            type    = elements[i].getAttribute('type');
            id      = elements[i].getAttribute('id');

            if (!type) { throw new Error('undefined component type.'); }
            if (!id) { throw new Error('undefined component id.'); }

            component = Component.findComponent(type);
            if (component && component.readyToInstall()) {
                element.setAttribute('installed', true);
                instances.push(component.installInstance(elements[i], id));
            }
        }
    };

    /**
     * @static
     * @summary Seeks for new component instances in the UI.
     * In every interval, the framework must look into the DOM tree and seeks for components which haven't been loaded
     * and for each one calls the component URI.
     *
     * @throws {Error} undefined component type.
     */
    Component.seekComponentsToLoad = function () {
        var head, elements, i,
            element, type, script;

        head     = document.getElementsByTagName('head')[0];
        elements = document.querySelectorAll('component:not([loading])');

        for (i = 0; i < elements.length; i += 1) {
            element = elements[i];
            type    = element.getAttribute('type');

            if (!type) { throw new Error('undefined component type.'); }

            if (!document.querySelector('[src="' + type + '"]')) {
                element.setAttribute('loading', true);
                script     = document.createElement('script');
                script.src = type;
                head.appendChild(script);
            }
        }
    };

    window.setInterval(Component.seekComponentsToStart, REFRESH_INTERVAL);
    window.setInterval(Component.seekComponentsToInstall, REFRESH_INTERVAL);
    window.setInterval(Component.seekComponentsToLoad, REFRESH_INTERVAL);
    window.Component = Component;
})(window);