const QuickTypeMatcher = {
    createQuickTypeMatcher({onChange}) {
        let keys = null;
        let since = null;
        return {
            typed(key) {
                let now = new Date().getTime();
                if (since == null || since < now - 500) {
                    keys = [key];
                } else {
                    keys.push(key);
                }
                since = now;

                onChange(keys.join(""));
            }
        };
    }
};

exports.QuickTypeMatcher = QuickTypeMatcher;