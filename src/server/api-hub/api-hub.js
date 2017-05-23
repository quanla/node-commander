const fs = require("fs");
const open = require("open");

function getStats(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stats) => {
            resolve({directory: stats.isDirectory()});
        });
    });
}

exports.apiHub = (router) => {
    router.post("/file/list", (req, res) => {
        let path = req.body.path;
        fs.readdir(path, (err, files) => {
            Promise.all(files.map((fileName) => getStats(`${path}/${fileName}`).then((stats) => Object.assign(stats, {fileName})))).then((files) => {
                res.json(files);
            });
        });
    });

    router.post("/file/open", (req, res) => {
        let path = req.body.path;
        open(path);
    });
};