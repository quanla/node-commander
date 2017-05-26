var KeyCombo = require("./key-combo.js").KeyCombo;
var Cols = require("../utils/cols.js").Cols;

function match(keyStroke, keyCombo) {
    return !!(keyCombo.key == keyStroke.key
        && Cols.sameSet(keyCombo.mods, keyStroke.mods));

}

const htmlKeysMap = {
    8: "BACKSPACE",
    38: "UP",
    40: "DOWN",
    13: "ENTER",
    9: "TAB",
    34: "PAGE_DOWN",
    33: "PAGE_UP",
    116: "F5",
    117: "F6",
    118: "F7",
    46: "DELETE",
    32: "SPACE",
    37: "LEFT",
    39: "RIGHT",
    27: "ESC",
};

let ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let D = "0123456789";
function translateKeyCode(keyCode) {
    let a = htmlKeysMap[keyCode];
    if (a) {
        return a;
    }
    if (keyCode >= 65 && keyCode < 65+26) {
        return ABC[keyCode-65];
    }
    if (keyCode >= 48 && keyCode < 48+10) {
        return D[keyCode-48];
    }
}

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
            key: translateKeyCode(e.keyCode),
            mods,
        };
    }
};
exports.htmlKeys = htmlKeys;

function matcher(key) {
    let keyCombo = KeyCombo.compileCombo(key);
    return (keyStroke) => match(keyStroke, keyCombo);
}

const keys = {
    BACKSPACE: matcher("BACKSPACE"),
    UP: matcher("UP"),
    DOWN: matcher("DOWN"),
    LEFT: matcher("LEFT"),
    RIGHT: matcher("RIGHT"),
    ENTER: matcher("ENTER"),
    TAB: matcher("TAB"),
    PAGE_DOWN: matcher("PAGE_DOWN"),
    PAGE_UP: matcher("PAGE_UP"),
    F5: matcher("F5"),
    F6: matcher("F6"),
    F7: matcher("F7"),
    ESC: matcher("ESC"),

    DELETE: matcher("DELETE"),

    WORD_KEYS: (keyStroke) => (keyStroke.key == "SPACE" || ABC.indexOf(keyStroke.key) > -1 || D.indexOf(keyStroke.key) > -1) && keyStroke.mods.length == 0,

    match,
    matcher,
};

exports.keys = keys;