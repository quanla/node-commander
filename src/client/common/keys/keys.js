var KeyCombo = require("./key-combo.js").KeyCombo;
var Cols = require("../utils/cols.js").Cols;

function match(keyStroke, keyCombo) {
    if (keyCombo.key == keyStroke.key
        && Cols.sameSet(keyCombo.mods, keyStroke.mods)
    ) {
        return true;
    }
    return false;
}

const htmlKeysMap = {
    8: "BACKSPACE",
    38: "UP",
    40: "DOWN",
    13: "ENTER",
    9: "TAB",
};
const htmlKeys = {

    translate(e) {
        let mods = [];
        if (e.ctrlKey) {
            mods.push("CTRL");
        }
        if (e.altKey) {
            mods.push("ALT");
        }
        if (e.metaKey) {
            mods.push("CMD");
        }
        if (e.shiftKey) {
            mods.push("SHIFT");
        }
        return {
            key: htmlKeysMap[e.keyCode],
            mods,
        };
    }
};
exports.htmlKeys = htmlKeys;

const keys = {
    BACKSPACE: KeyCombo.compileCombo("BACKSPACE"),
    UP: KeyCombo.compileCombo("UP"),
    DOWN: KeyCombo.compileCombo("DOWN"),
    ENTER: KeyCombo.compileCombo("ENTER"),
    TAB: KeyCombo.compileCombo("TAB"),

    match,
};

exports.keys = keys;