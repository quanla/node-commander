import {api} from "./api";
export const fileApi = {
    getFiles(path) {
        return api.post("/file/list", {path});
    },
    openFile(path) {
        return api.post("/file/open", {path});
    },
    getHomeDir() {
        return api.post("/file/get_home_dir", {});
    },
    copyFile(file, destDir) {
        return api.post("/file/copy_file", {file, destDir});
    },
    copyDir(dir, destDir) {
        return api.post("/file/copy_dir", {dir, destDir});
    },
    delFile(name, fromDir) {
        return api.post("/file/del_file", {name, fromDir});
    },
    delDir(name, fromDir) {
        return api.post("/file/del_dir", {name, fromDir});
    },
    makeDir(path, fromDir) {
        return api.post("/file/make_dir", {path, fromDir});
    },
};