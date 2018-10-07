import Application from './app.js';

var app = null;

window.addEventListener('DOMContentLoaded', function() {
    app = new Application("render-canvas");
    app.run();
});

window.addEventListener('resize', function() {
    if (app != null) {
        app.resize();
    }
});
