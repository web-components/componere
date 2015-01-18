/*globals window:false, async:false, Event:false*/
(function (window, async) {
  'use strict';
  var REFRESH_INTERVAL, Instance;
  REFRESH_INTERVAL = 100;

  Instance = function (component, element) {
    if (!component) throw new Error('undefined instance component.');
    if (!element) throw new Error('undefined instance element.');
    this.component = component;
    this.element = element;
    this.id = element.getAttribute('id');
    this.status = 'loaded';
    Instance.instances[this.id] = this;
  };

  Instance.prototype.canInstall = function () {
    return this.status === 'loaded' && this.component.parentsLoaded();
  };

  Instance.prototype.canConnect = function () {
    return this.status === 'installed' && this.component.requires.every(function (required) {
      var instance = Instance.instances[this.element.getAttribute(required.interfaceName)];
      return instance && instance.status !== 'loaded' && instance.status !== 'installing';
    }.bind(this)) && this.component.listens.every(function (required) {
      var instance = Instance.instances[this.element.getAttribute(required.eventName)];
      return instance && instance.status !== 'loaded' && instance.status !== 'installing';
    }.bind(this));
  };

  Instance.prototype.canStart = function () {
    return this.status === 'connected';
  };

  Instance.prototype.install = function (done) {
    if (!this.canInstall()) return;
    async.series([function (done) {
      this.status = 'installing';
      done();
    }.bind(this), function (done) {
      this.component.installInstance(this, done);
    }.bind(this), function (done) {
      this.status = 'installed';
      done();
    }.bind(this)], done);
  };

  Instance.prototype.connect = function (done) {
    if (!this.canConnect()) return;
    async.series([function (done) {
      this.status = 'connecting';
      done();
    }.bind(this), function (done) {
      this.component.connectInstance(this, done);
    }.bind(this), function (done) {
      this.status = 'connected';
      done();
    }.bind(this)], done);
  };

  Instance.prototype.start = function (done) {
    if (!this.canStart()) return;
    async.series([function (done) {
      this.status = 'starting';
      this.component.publishes.forEach(function (publishes) {
        var event = new Event(publishes.eventName);
        this[publishes.eventName] = function () {
          this.element.dispatchEvent(event);
        }.bind(this);
      }.bind(this));
      done();
    }.bind(this), function (done) {
      this.component.startInstance(this, done);
    }.bind(this), function (done) {
      this.status = 'started';
      done();
    }.bind(this)], done);
  };

  Instance.loadInstances = function () {
    var elements = document.querySelectorAll('component:not([instance-load])');
    Array.prototype.filter.call(elements, function (element) {
      var component;
      component = Component.components[element.getAttribute('type')];
      if (!component) return;
      element.setAttribute('instance-load', 'true');
      new Instance(component, element);
    });
  };

  Instance.installInstances = function () {
    for (var i in Instance.instances) {
      if (Instance.instances.hasOwnProperty(i)) Instance.instances[i].install();
    }
  };

  Instance.connectInstances = function () {
    for (var i in Instance.instances) {
      if (Instance.instances.hasOwnProperty(i)) Instance.instances[i].connect();
    }
  };

  Instance.startInstances = function () {
    for (var i in Instance.instances) {
      if (Instance.instances.hasOwnProperty(i)) Instance.instances[i].start();
    }
  };

  Instance.instances = {};
  window.setInterval(Instance.loadInstances, REFRESH_INTERVAL);
  window.setInterval(Instance.installInstances, REFRESH_INTERVAL);
  window.setInterval(Instance.connectInstances, REFRESH_INTERVAL);
  window.setInterval(Instance.startInstances, REFRESH_INTERVAL);
  window.Instance = Instance;
})(window, async);