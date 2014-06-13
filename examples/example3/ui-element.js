var UiElement;

UiElement = new Component('./ui-element.js');
UiElement.install(function (element) {
    this.html = function (val) {
        if (val) { element.innerHTML = val; }
        return element.innerHTML;
    };
});
