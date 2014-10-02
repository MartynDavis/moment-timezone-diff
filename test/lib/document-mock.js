(function (root, factory) {
    "use strict";
    if (typeof exports === 'object') {
        module.exports = factory();   // Node
    }
}(this, function () {
    "use strict";
    
    var elements = { };
    
    function Element(tagName, o) {
        var p;
        this.tagName = tagName.toUpperCase();
        this.nodeName = this.tagName;
        this.children = [ ];
        this.options = [ ];
        this.selectedIndex = -1;
        this.text = '';
        this.value = '';
        this.className = '';
        this.textContent = '';
        this.events = { };
        if (o) {
            for (p in o) {
                if (o.hasOwnProperty(p)) {
                    this[p] = o[p];
                }
            }
        }
    }
    
    Element.prototype.appendChild = function (child) {
        this.children.push(child);
        return child;
    };
    
    Element.prototype.add = function (option) {
        this.options.append(option);
    };
    
    Element.prototype.addEventListener = function (event, callback) {
        if (this.events[event] === undefined) {
            this.events[event] = [ ];
        }
        this.events[event].push(callback);
    };
    
    function createElement(tagName, o) {
        var element = new Element(tagName, o);
        if (o && o.id) {
            elements[o.id] = element;
        }
        return element;
    }
    
    function getElementById(id) {
        return elements[id];
    }
    
    function clear() {
        elements = { };
    }
    
    var documentMock = { };
    documentMock.createElement = createElement;
    documentMock.getElementById = getElementById;
    documentMock.clear = clear;
    return documentMock;
}));