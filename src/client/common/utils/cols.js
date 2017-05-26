
function sortBy(valF) {
    if (typeof valF == "function") {
        return (o1, o2) => {
            return valF(o1) > valF(o2) ? 1 : -1;
        };
    } else {
        let list = valF;

        return (o1, o2) => {
            for (let i = 0; i < list.length; i++) {
                let valF = list[i];
                let v1 = valF(o1);
                let v2 = valF(o2);
                if (v1 != v2) {
                    return v1 > v2 ? 1 : -1;
                }
            }
            return 0;
        };
    }
}

const Cols = {
    indexOf(col, fn) {
        for (let i = 0; i < col.length; i++) {
            let e = col[i];
            if (fn(e)) {
                return i;
            }
        }
        return -1;
    },
    reduce(col, iter, initValue) {
        let value = initValue;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];
            value = iter(value, e);
        }
        return value;
    },
    keys(col) {
        let ret = [];
        for (var k in col) {
            if (col.hasOwnProperty(k)) {
                ret.push(k);
            }
        }
        return ret;
    },
    last(col) {
        return col[col.length - 1];
    },
    // Mutates col
    removeDuplicates(col, by) {
        for (let i = 0; i < col.length; i++) {
            let e1 = col[i];
            let v1 = by(e1);
            for (let j = i + 1; j < col.length; j++) {
                let e2 = col[j];
                let v2 = by(e2);
                if (v1 == v2) {
                    col.splice(j, 1);
                    j--;
                }
            }
        }
    },
    sort(col, by) {
        let clone = col.slice(0);
        clone.sort(by === undefined ? undefined : sortBy(by));
        return clone;
    },
    sortBy,
    find(col, fn) {
        for (let i = 0; i < col.length; i++) {
            let e = col[i];
            if (fn(e)) {
                return e;
            }
        }
    },
    isEmpty(col) {
        return col == null || col.length == 0;
    },
    isNotEmpty(col) {
        return !Cols.isEmpty(col);
    },
    update(col, e, draft) {
        let index = col.indexOf(e);
        return [].concat(col.slice(0, index)).concat([draft]).concat(col.slice(index + 1));
    },
    addSets(c1, c2) {
        let ret = c1 == null ? [] : c1.slice(0);
        for (let i = 0; i < c2.length; i++) {
            let e = c2[i];
            if (ret.indexOf(e) == -1) {
                ret.push(e);
            }
        }
        return ret;
    },
    replace(col, targetElems, replaceElems) {
        return col == null ? null : col.map((t)=> {
                let i = targetElems.indexOf(t);
                if (i == -1) {
                    return t;
                } else {
                    return replaceElems[i];
                }
            });
    },
    /**
     * Immutable
     * @param col
     * @param targetElem
     * @param replaceElem
     * @returns {null}
     */
    replace1(col, targetElem, replaceElem) {
        return col == null ? null : col.map((t)=> {
                if (targetElem == t) {
                    return replaceElem;
                } else {
                    return t;
                }
            });
    },
    remove(col, targetElems) {
        return col== null ? null : col.filter((t)=> targetElems.indexOf(t) == -1);
    },
    remove1(col, targetElem) {
        return col== null ? null : col.filter((t)=> targetElem !== (t));
    },
    remove1Mutate(col, targetElem) {
        if (col== null) {
            return;
        }

        let i = col.indexOf(targetElem);
        if (i == -1) {
            return;
        }
        col.splice(i, 1);
    },
    selectRange(col, fromToElems) {
        if (fromToElems[0] == fromToElems[1]) {
            return null;
        }
        // Find start
        let [from, to] = _.sortBy(fromToElems.map((e)=> col.indexOf(e)));
        if (from == -1 || to == -1) {
            return null;
        }

        return col.slice(from, to + 1);
    },
    getSame(col, by) {
        let getter = ObjectUtil.getter(by);
        if (col == null || col.length == 0) {
            return null;
        }
        var sample = getter(col[0]);
        if (sample == null) {
            return null;
        }
        for (var i = 1; i < col.length; i++) {
            var e = col[i];
            if (getter(e) != sample) {
                return null;
            }
        }
        return sample;
    },
    move(arr, pos, newPos) {
        if( newPos === pos) return;

        let value = arr[pos];
        let dir = pos > newPos ? -1 : 1 ;

        for(let i = pos; i != newPos; i += dir){
            arr[i] = arr[i + dir];
        }
        arr[newPos] = value;

        return arr;
    },
    min(col, comparer) {
        comparer = comparer || ((a1, a2)=> a1-a2);
        let min = null;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];
            if (min == null || comparer(min, e) > 0) {
                min = e;
            }
        }
        return min;
    },
    minE(col, valueF, shortcutVal) {
        let minE = null;
        let minVal = null;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];

            let value = valueF(e);

            if (shortcutVal !== undefined && shortcutVal == value) {
                return e;
            }

            if (minE == null || value < minVal) {
                minE = e;
                minVal = value;
            }
        }
        return minE;
    },
    minValue(col, valueF) {
        let minE = null;
        let minVal = null;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];

            let value = valueF(e);
            if (minE == null || value < minVal) {
                minE = e;
                minVal = value;
            }
        }
        return minVal;
    },
    maxE(col, valueF) {
        let maxE = null;
        let maxVal = null;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];

            let value = valueF(e);
            if (maxE == null || value > maxVal) {
                maxE = e;
                maxVal = value;
            }
        }
        return maxE;
    },
    maxValue(col, valueF) {
        let maxE = null;
        let maxVal = null;
        for (let i = 0; i < col.length; i++) {
            let e = col[i];

            let value = valueF(e);
            if (maxE == null || value > maxVal) {
                maxE = e;
                maxVal = value;
            }
        }
        return maxVal;
    },
    sameSet(col1, col2) {
        if (col1 == null) {
            return col2 == null;
        }
        if (col2 == null) {
            return false;
        }

        if (col1.length != col2.length) {
            return false;
        }

        for (let i = 0; i < col1.length; i++) {
            let e = col1[i];
            if (col2.indexOf(e) == -1) {
                return false;
            }
        }
        return true;
    },
    addToSet(e, set) {
        if (set.indexOf(e) > -1) {
            return;
        }
        set.push(e);

    },
    addToSortedSet(e, set) {
        if (set.indexOf(e) > -1) {
            return;
        }
        set.push(e);
        set.sort();
    },
    splice(col, startIndex, deleteCount, addItems) {
        return col.slice(0, startIndex).concat(addItems).concat(col.slice(startIndex+deleteCount));
    },
    sum(col) {
        return col.reduce((acc, e) => acc + e);
    },
    conflict(c1, c2) {
        for (let i = 0; i < c1.length; i++) {
            let e1 = c1[i];
            if (c2.indexOf(e1) > -1) {
                return true;
            }
        }
        return false;
    }
};




exports.Cols = Cols;