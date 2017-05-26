const {fileApi} = require("../api/file-api");

export const CopyCmd = {
    copy(file, fromDir, destDir) {
        if (file.directory) {
            return fileApi.copyDir(`${fromDir}/${file.fileName}`, destDir);
        } else {
            return fileApi.copyFile(`${fromDir}/${file.fileName}`, destDir);
        }
    }
};