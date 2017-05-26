const Storage = {
    createStorage(storageKey) {
        return {
            get(key) {
                let itemStr = localStorage.getItem(`${storageKey}.${key}`);
                if (itemStr == null) {
                    return null;
                } else {
                    return JSON.parse(itemStr);
                }
            },
            set(key, value) {
                if (value == null) {
                    localStorage.removeItem(`${storageKey}.${key}`);
                } else {
                    localStorage.setItem(`${storageKey}.${key}`, JSON.stringify(value));
                }
            }
        };
    }
};

exports.Storage = Storage;