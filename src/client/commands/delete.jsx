const {fileApi} = require("../api/file-api");

export const DeleteCmd = {
    del(file, fromDir) {
        if (file.directory) {
            return fileApi.delDir(file.fileName, fromDir);
        } else {
            return fileApi.delFile(file.fileName, fromDir);
        }
    }
};