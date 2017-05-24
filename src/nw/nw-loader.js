
module.exports = ({console, React, document, ReactDOM, $, _, window}) => {
    global.React = React;
    global.ReactDOM = ReactDOM;
    global.console = console;
    // global.document = document;
    global._ = _;
    global.$ = $;
    global.window = window;

    console.log(document.getElementById("app-container"));

    require("../../dist/js/main");

};