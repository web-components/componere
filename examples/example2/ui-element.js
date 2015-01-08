var UiElement;
UiElement = new Component('./ui-element.js');
UiElement.install(function (done) {
  this.html = function (val) {
    if (val) {
      this.element.innerHTML = val;
    }
    return this.element.innerHTML;
  };
  done();
});
