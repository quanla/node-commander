function createRouter() {
    let entries = [];

    function matchEntry(url, method) {
        for (let i = 0; i < entries.length; i++) {
            let en = entries[i];
            if (en.url == url && method == en.method) {
                return en;
            }
        }
        return null;
    }

    return {
        post(url, handler) {
            entries.push({
                method: "POST",
                url, handler,
            });
        },
        entries: () => entries,
        createClient() {
            return {
                post(url, data) {
                    return new Promise((resolve, reject) => {
                        let entry = matchEntry(url, "POST");

                        if (!entry) {
                            return reject(`No api entry match this url [${url}]`);
                        }

                        let req = {
                            body: data,
                        };
                        let res = {
                            json(obj) {
                                resolve(obj);
                            },
                            end() {
                                resolve(null);
                            }
                        };
                        entry.handler(req, res);
                    });
                }
            };
        }
    };
}

const MockApi = {
    createRouter,
};

exports.MockApi = MockApi;