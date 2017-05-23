import {api} from "./api";
export const fileApi = {
    getFiles(path) {
        return api.post("/file/list", {path});
    }
};