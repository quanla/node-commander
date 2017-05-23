import {api} from "./api";
export const fileApi = {
    getFiles(path) {
        return api.post("/file/list", {path});
    },
    openFile(path) {
        return api.post("/file/open", {path});
    },
};