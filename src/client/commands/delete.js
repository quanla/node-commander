const {fileApi} = require("../api/file-api");

export const DeleteCmd = {
    del(path) {
        return fileApi.del(path);
    }
};