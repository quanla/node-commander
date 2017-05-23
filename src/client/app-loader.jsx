// import {VenueEditorPage} from "./venue-editor-page";
// import {keys} from "../common/keys/keys";
// import {devActions} from "../common/dev-mode/dev-actions";
// import {ModalsRegistry} from "../common/components/modal/modals";
// import {ToolWindowsRegistry} from "../common/components/tool-windows/tool-windows";


window.$ = window.$ || {};
// window._ = require("lodash");
window.React = window.React || {};

const ReactDOM = window.ReactDOM;
window.ReactDOM = ReactDOM;

ReactDOM.render(
    (
        <div className="node-commander">
            He he he
        </div>
    ),
    document.getElementById("app-container")
);


// keys.on("F9", () => {
//     devActions.showDevActions();
// });