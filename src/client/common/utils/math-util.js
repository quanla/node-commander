

const TINY = 0.000001;
function isTiny(number) {
    return Math.abs(number) < TINY;
}

const MathUtil = {
    isTiny,
    sqr: (num) => num*num,
    round: (num, to) => {
        return Math.round(num / to) * to;
    },
    range: (from, to) => {
        let ret = [];
        for (let i = from; i < to; i++) {
            ret.push(i);
        }
        return ret;
    },
    circular(from, to) {

        let translate = (num) => {
            for (;num < from;) {
                num += to-from;
            }
            for (;num >= to;) {
                num -= to-from;
            }
            return num;
        };

        // Always > 0
        let subtract = (a1, a2) => {
            a1 = translate(a1);
            a2 = translate(a2);
            if (a1 < a2) {
                a1 += to-from;
            }
            return a1 - a2;
        };

        // Always < (to - from) / 2
        let distance = (a1, a2) => {
            let s = subtract(a1, a2);
            if (s > (to - from) / 2) {
                return (to - from) - s;
            }
            return s;
        };
        let middle = (a1, a2) => {
            return translate(subtract(a2, a1)/2+a1);
        };
        let round = (a) => {
            let mod = (a - from) % (to - from);
            if (mod < (to-from)/2) {
                return a - mod;
            } else {
                return a + (to-from) - mod;
            }
        };
        let find = (startIndex, endIndex, fn) => {
            endIndex = translate(endIndex);
            for (let i = startIndex; ; i++) {
                let tIndex = translate(i);

                if (tIndex == endIndex) {
                    return null;
                }
                if (fn(tIndex)) {
                    return tIndex;
                }

            }
        };

        let arraySlice = (startIndex, endIndex, array) => {
            if (endIndex >= startIndex) {
                return array.slice(startIndex, endIndex);
            }
            return array.slice(startIndex).concat(array.slice(0, endIndex));
        };

        // After this, this circular will not be valid for the returned array
        let arraySplice = (startIndex, count, replace, array) => {
            startIndex = translate(startIndex);
            let endIndex = translate(startIndex + count);
            if (endIndex >= startIndex) {
                return Cols.splice(array, startIndex, count, replace);
            }
            return array.slice(endIndex, startIndex).concat(replace);
        };

        return {
            translate,
            subtract,
            middle,
            distance,
            round,
            find,
            arraySlice,
            arraySplice,
        };
    },
    linearTranslate(minX, maxX, minY, maxY) {
        return (x) => {
            if (x <= minX) {
                return minY;
            }
            if (x >= maxX) {
                return maxY;
            }

            return minY + ((x-minX)/(maxX-minX))*(maxY - minY);
        }
    }
};

exports.MathUtil = MathUtil;