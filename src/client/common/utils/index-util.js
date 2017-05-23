var Cols = require("./cols.js").Cols;
function addToIndex(e, index, keys) {
    let key = keys[0];
    let subKeys = keys.slice(1);

    let indexVal = e[key];

    if (subKeys.length) {
        let subIndex = index[indexVal];
        if (subIndex === undefined) {
            subIndex = {};
            index[indexVal] = subIndex;
        }

        addToIndex(e, subIndex, subKeys);
    } else {
        let subList = index[indexVal];
        if (subList === undefined) {
            subList = [];
            index[indexVal] = subList;
        }
        subList.push(e);
    }
}
function indexBy(indexKeys, col) {
    let ret = {};

    for (let i = 0; i < col.length; i++) {
        let e = col[i];
        addToIndex(e, ret, indexKeys);
    }
    return ret;
}

function indexGet(keys, index) {
    let key = keys[0];
    let subIndex = index[key];
    if (subIndex == null) {
        return null;
    } else {
        if (keys.length > 1) {
            let subKeys = keys.slice(1);
            return indexGet(subKeys, subIndex);
        } else {
            return subIndex;
        }
    }
}

function findAll(index, fn) {
    if (index.length !== undefined) {
        return Cols.find(index,fn);
    } else {
        for (var k in index) {
            if (findAll(index[k], fn)) {
                return true;
            }
        }
        return false;
    }
}

function find(keys, index, fn) {
    let key = keys[0];
    let subIndex = index[key];
    if (subIndex == null) {
        return false;
    } else {
        if (keys.length > 1) {
            let subKeys = keys.slice(1);
            return find(subKeys, subIndex, fn);
        } else {
            return findAll(subIndex, fn);
        }
    }
}

function countAll(index) {

    if (index.length != undefined) {
        return index.length;
    } else {
        let total = 0;
        for (var k in index) {
            total += countAll(index[k]);
        }
        return total;
    }
}
function count(keys, index) {
    let key = keys[0];
    let subIndex = index[key];
    if (subIndex == null) {
        return 0;
    } else {
        if (keys.length > 1) {
            let subKeys = keys.slice(1);
            return count(subKeys, subIndex);
        } else {
            return countAll(subIndex);
        }
    }
}

function forEachAll(index, fn) {

    if (index.length != undefined) {
        index.forEach(fn);
    } else {
        for (let k in index) {
            forEachAll(index[k], fn);
        }
    }
}
function forEach( keys, index, fn) {
    let key = keys[0];
    let subIndex = index[key];
    if (subIndex == null) {
        return;
    } else {
        if (keys.length > 1) {
            let subKeys = keys.slice(1);
            forEach(subKeys, subIndex, fn);
        } else {
            forEachAll(subIndex, fn);
        }
    }
}
function eachList( index, fn) {
    if (index.length !== undefined) {
        fn(index);
    } else {
        for (let k in index) {
            eachList(index[k], fn);
        }
    }
}

const IndexUtil = {
    indexBy,
    indexGet,
    find,
    count,
    countAll,
    forEach,
    forEachAll,
    eachList,
};

exports.IndexUtil = IndexUtil;