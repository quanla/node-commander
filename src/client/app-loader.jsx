// import React from "react";
import {MainPage} from "./main-page";
// import {VenueEditorPage} from "./venue-editor-page";
// import {keys} from "../common/keys/keys";
// import {devActions} from "../common/dev-mode/dev-actions";
// import {ModalsRegistry} from "../common/components/modal/modals";
// import {ToolWindowsRegistry} from "../common/components/tool-windows/tool-windows";

console.log(1);
window.$ = window.$ || {};
// window._ = require("lodash");
window.React = window.React || {};

const ReactDOM = window.ReactDOM;
window.ReactDOM = ReactDOM;

let $container = $("<div></div>");
$(document.body).append($container);
console.log(document.getElementById("app-container"));
ReactDOM.render(
    (
        <div className="node-commander">
            <MainPage/>
        </div>
    ),
    $container[0]
);


// keys.on("F9", () => {
//     devActions.showDevActions();
// });
console.log(3);