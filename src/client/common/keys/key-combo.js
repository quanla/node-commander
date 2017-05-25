function compileMods(ptn) {
    return ptn.split(/\s*\+\s*/g).map((modPtn) => {
        return modPtn.toUpperCase();
    });
}

function compileCombo(keyPtn) {
    let index = keyPtn.lastIndexOf("+");

    if (index == -1) {
        return {
            mods: [],
            key: keyPtn.toUpperCase(),
        };
    } else {
        return {
            mods: compileMods(keyPtn.substring(0, index)),
            key: keyPtn.substring(index + 1).toUpperCase(),
        };
    }
}

const KeyCombo = {
    compileCombo,
};

exports.KeyCombo = KeyCombo;