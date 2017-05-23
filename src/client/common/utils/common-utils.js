var ObjectUtil = require("./object-util.js").ObjectUtil;
var Cols = require("./cols.js").Cols;
var IndexUtil = require("./index-util").IndexUtil;
var MathUtil = require("./math-util").MathUtil;

const DateUtil = {
    DAY_LENGTH: 1000 * 60 * 60 * 24,
    utcDateTime(date) {
        return new Date(date.year, date.month - 1, date.day || 1, date.hour || 0, date.minute || 0, date.second || 0);
    },
    utcDate(date) {
        if(typeof date === "string") {
            return new Date(date);
        }
        return new Date(date.year, date.month - 1, date.day || 1);
    },
    format(date, format) {
        if (format == "YYYY-MM-DD") {
            return `${date.year}-${StringUtil.padding(date.month - 1)}-${StringUtil.padding(date.day)}`;
        }
        throw `Unknown date format: ${format}`;
    },
    substractMonth({day, month, year}) {
        if (month == 1) {
            return {
                day: day,
                month: 12,
                year: year - 1
            }
        } else {
            return {
                day: day,
                month: month - 1,
                year: year
            }
        }
    },
    plusMonth({day, month, year}) {
        if (month == 12) {
            return {
                day: day,
                month: 1,
                year: year + 1
            }
        } else {
            return {
                day: day,
                month: month + 1,
                year: year
            }
        }
    },
    remainingTimeFromNow(date) {
        return DateUtil.utcDate(date).getTime() - new Date().getTime();
    },
    pastDate(date) {
        return Math.abs(DateUtil.remainingTimeFromNow(date)) / DateUtil.DAY_LENGTH
    },
    getISODate(date) {
        return DateUtil.utcDate(date).toISOString();
    }
};

const StringUtil = {
    padding(str, length) {
        length = length || 2;
        str = ""+str;
        for (;str.length < length;) {
            str = "0" + str;
        }
        return str;
    },
    equalIgnoreCase(s1, s2) {
        if (s1 == s2) {
            return true;
        }
        if (s1 == null || s2 == null) {
            return false;
        }
        return s1.toLowerCase() == s2.toLowerCase();
    },
    validEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    },
    isBlank(val) {
        if ((typeof val) == "string") {
            return val==null || val.replace(/\s/g, "").length == 0;
        } else {
            return val == null || val == "";
        }
    },
    upperCaseFirstChar(str) {
        return str[0].toUpperCase() + str.substring(1);
    }
};
const UrlUtil = {
    queryString(params) {
        let ret = "";
        _.forEach(params, (v, k)=> {
            if (v == null) {
                return;
            }
            if (ret.length > 0) {
                ret += "&";
            }
            ret += `${k}=${encodeURIComponent(v)}`;
        });
        return ret.length == 0 ? ret : "?" + ret;
    }
};


const Fs = {
    noop: (ret)=> ret,
    curry(f) {
        let args1 = Array.prototype.slice.call(arguments, 1);
        return function() {
            let args2 = Array.prototype.slice.call(arguments, 0);
            return f.apply(null, args2.concat(args1));
        };
    },
    and(ands) {
        return (p1, p2, p3)=> ands.find((a)=> a != null && !a(p1, p2, p3)) == null;
    },
    chain(fns) {
        return (a) => {
            for (let i = 0; i < fns.length; i++) {
                let fn = fns[i];
                a = fn(a);
            }
            return a;
        };
    },
    invokeAll(fns, a) {
        fns.forEach((fn) => fn(a));
    },
    minVal(iterFn) {
        let min = undefined;
        iterFn((num) => {
            if (min === undefined || min > num) {
                min = num;
            }
        });
        return min;
    }
};

const RandomUtil = {
    select(values) {
        return values[Math.floor(Math.random() * values.length)];
    },
    randomId() {
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for( let i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    // Include from, exclude to
    between(from, to) {
        return Math.random() * (to-from) + from;
    },
    bool() {
        return Math.random() < 0.5;
    }
};


const ArrayUtil = {
    isEqual(array1, array2) {
        return array1 && array2 && array1.length == array2.length && array1.every(function(element, index) {
            return element === array2[index];
        })
    }
};

const HttpUtil = {
    buildUrl(base, queryParams) {
        let ret = null;
        for (let k in queryParams) {
            let v = queryParams[k];
            if (v == null) {
                continue;
            }
            if (ret == null) {
                ret = "?" + k + "=" + encodeURIComponent(v);
            } else {
                ret += "&" + k + "=" + encodeURIComponent(v);
            }
        }
        return base + (ret || "");
    }
};



const CacheUtil = {
    cache0: (fn) => {
        let invoked = false;
        let val = null;

        return () => {
            if (invoked) {
                return val;
            }

            val = fn();
            invoked = true;
            return val;
        };
    },
    cache1: (cacheKeyFn, fn) => {
        let cache = {};

        return (target) => {
            let key = cacheKeyFn(target);
            let cachedVal = cache[key];
            if (cachedVal !== undefined) {
                return cachedVal;
            }

            let val = fn(target);
            cache[key] = val;
            return val;
        };
    },
};

exports.DateUtil = DateUtil;
exports.ObjectUtil = ObjectUtil;
exports.StringUtil = StringUtil;
exports.UrlUtil = UrlUtil;
exports.Cols = Cols;
exports.IndexUtil = IndexUtil;
exports.Fs = Fs;
exports.RandomUtil = RandomUtil;
exports.HttpUtil = HttpUtil;
exports.ArrayUtil = ArrayUtil;
exports.MathUtil = MathUtil;
exports.CacheUtil = CacheUtil;