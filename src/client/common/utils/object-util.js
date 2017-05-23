/**
 * Create new object
 * @param path
 * @param object
 * @param fn
 */
function update(path, object, fn) {
    let index = path.indexOf(".");
    if (index > -1) {
        let path1 = path.substring(0, index);
        let path2 = path.substring(index + 1);
        return update1(object, {[path1]: update(path2, object[path1] != null ? object[path1] : {}, fn)});
    } else {
        return update1(object, {[path]: fn(object[path])});
    }
}

function update1(obj, changes) {
    if (obj == null) {
        return changes;
    }
    let ret = {};
    for (var k in obj) {
        let newVal = changes[k];
        if (newVal !== undefined) {
            ret[k] = newVal;
        } else {
            ret[k] = obj[k];
        }
    }
    for (var k in changes) {
        if (!ret.hasOwnProperty(k)) {
            ret[k] = changes[k];
        }
    }
    return ret;
}

function keys(obj) {
    let ret = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            ret.push(k);
        }
    }
    return ret;
}

function map(obj, fn) {
    let ret = {};

    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            ret[k] = fn(obj[k], k);
        }
    }

    return ret;
}

function forEach(obj, fn) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            fn(obj[k], k);
        }
    }
}

const ObjectUtil = {
    getter(by) {
        if (typeof by == "string") {
            return (o) => o[by];
        }

        return by;
    },
    isEqualsShallow(a, b) {
        if (a == null) {
            return b == null;
        } else if (b == null) {
            return false;
        }

        let keys1 = _.keys(a);
        let keys2 = _.keys(b);
        if (keys1.length != keys2.length) {
            return false;
        }

        for (let i = 0; i < keys1.length; i++) {
            let key = keys1[i];

            if(a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    },
    equalDeep(o1, o2) {
        return _.isEqual(o1, o2);
    },
    removeEmpty(obj) {
        Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] === undefined) && delete obj[key]);
        return obj;
    },
    update: update1,
    updatePath: update,
    concat(path, obj, pushArr) {
        return update(path, obj, (arr) => arr == null ? pushArr : arr.concat(pushArr));
    },
    keys,
    map,
    forEach,
};

exports.ObjectUtil = ObjectUtil;