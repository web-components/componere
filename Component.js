
/*globals window:false, async:false, Event:false*/
(function (window, async) {
  'use strict';
  var REFRESH_INTERVAL, Component;
  REFRESH_INTERVAL = 100;

  Component = function (id) {
    if (!id) throw new Error('undefined component id.');
    this.id = id;
    this.publishes = [];
    this.listens = [];
    this.provides = [];
    this.requires = [];
    this.parents = [];
    this.installers = [];
    this.starters = [];
    Component.components[id] = this;
  };

  Component.prototype.publish = function (eventName) {
    if (!eventName) throw new Error('undefined event name.');
    this.publishes.push({'eventName' : eventName});
    return this;
  };

  Component.prototype.listen = function (eventName, eventConnector) {
    if (!eventName) throw new Error('undefined event name.');
    if (!eventConnector) throw new Error('undefined event connector.');
    this.listens.push({'eventName' : eventName, 'eventConnector' : eventConnector});
    return this;
  };

  Component.prototype.provide = function (interfaceName, interfaceConnector) {
    if (!interfaceName) throw new Error('undefined interface name.');
    if (!interfaceConnector) throw new Error('undefined interface connector.');
    this.provides.push({'interfaceName' : interfaceName, 'interfaceConnector' : interfaceConnector});
    return this;
  };

  Component.prototype.require = function (interfaceName, interfaceConnector) {
    if (!interfaceName) throw new Error('undefined interface name.');
    if (!interfaceConnector) throw new Error('undefined interface connector.');
    this.requires.push({'interfaceName' : interfaceName, 'interfaceConnector' : interfaceConnector});
    return this;
  };

  Component.prototype.extend = function (parentId) {
    if (!parentId) throw new Error('undefined parent id.');
    this.parents.push({'parentId' : parentId});
    appendScript(parentId);
    return this;
  };

  Component.prototype.install = function (installer) {
    if (!installer) throw new Error('undefined component installer.');
    this.installers.push({'installer' : installer});
    return this;
  };

  Component.prototype.start = function (starter) {
    if (!starter) throw new Error('undefined component starter.');
    this.starters.push({'starter' : starter});
    return this;
  };

  Component.prototype.parentsLoaded = function () {
    return this.parents.every(function (parent) {
      return Component.components[parent.parentId] && Component.components[parent.parentId].parentsLoaded();
    }.bind(this));
  };

  Component.prototype.installInstance = function (instance, done) {
    async.series([function (done) {
      async.each(this.parents, function (parent, done) {
        Component.components[parent.parentId].installInstance(instance, done);
      }.bind(this), done);
    }.bind(this), function (done) {
      this.publishes.forEach(function (publishes) {
        instance[publishes.eventName] = function (data) {
          var event = new CustomEvent(publishes.eventName, {'detail' : data});
          instance.element.dispatchEvent(event);
        }.bind(this);
      }.bind(this));

      async.each(this.installers, function (installer, done) {
        installer.installer.apply(instance, [done]);
      }.bind(this), done);
    }.bind(this)], done);
  };

  Component.prototype.connectInstance = function (instance, done) {
    async.series([function (done) {
      async.each(this.parents, function (parent, done) {
        Component.components[parent.parentId].connectInstance(instance, done);
      }.bind(this), done);
    }.bind(this), function (done) {
      async.each(this.requires, function (required, done) {
        var requiredInstance, requiredInterface;
        requiredInstance = Instance.instances[instance.element.getAttribute(required.interfaceName)];
        requiredInterface = requiredInstance.component.getConnector(required);
        requiredInterface.interfaceConnector.call(requiredInstance, function (data) {
          required.interfaceConnector.call(instance, data, done);
        });
      }.bind(this), done);
    }.bind(this), function (done) {
      async.each(this.listens, function (required, done) {
        var requiredInstance = Instance.instances[instance.element.getAttribute(required.eventName)];
        requiredInstance.element.addEventListener(required.eventName, required.eventConnector.bind(instance));
        done();
      }.bind(this), done);
    }.bind(this)], done);
  };

  Component.prototype.getConnector = function (required) {
    var i, parent, connector;
    for (i = 0; i < this.provides.length; i++) {
      if (this.provides[i].interfaceName === required.interfaceName) {
        return this.provides[i];
      }
    }
    for (i = 0; i < this.parents.length; i++) {
      parent = Component.components[this.parents[i].parentId];
      connector = parent.getConnector(required);
      if (connector) return connector;
    }
  };

  Component.prototype.startInstance = function (instance, done) {
    async.series([function (done) {
      async.each(this.parents, function (parent, done) {
        Component.components[parent.parentId].startInstance(instance, done);
      }.bind(this), done);
    }.bind(this), function (done) {
      async.each(this.starters, function (starter, done) {
        starter.starter.apply(instance, [done]);
      }.bind(this), done);
    }.bind(this)], done);
  };

  Component.loadComponents = function () {
    var elements = document.querySelectorAll('component:not([component-load])');
    Array.prototype.forEach.call(elements, function (element) {
      element.setAttribute('component-load', 'true');
      appendScript(element.getAttribute('type'));
    });
  };

  Component.components = {};
  window.setInterval(Component.loadComponents, REFRESH_INTERVAL);
  window.Component = Component;

  function appendScript(src) {
    var head, script;
    if (document.querySelector('[src="' + src + '"]')) return;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
  }
})(window, async);
