const fs = require("fs");
const open = require("open");
const {ncp} = require("ncp");
const path = require("path");
const rimraf = require("rimraf");

function getStats(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, stats) => {
            resolve(Object.assign({directory: stats.isDirectory()}, stats));
        });
    });
}

exports.fileApiS = (router) => {
    router.post("/file/list", (req, res) => {
        let path = req.body.path;
        fs.readdir(path, (err, files) => {
            if (err) {
                res.end();
                return;
            }
            Promise.all(files.map((fileName) => getStats(`${path}/${fileName}`).then((stats) => Object.assign(stats, {fileName})))).then((files) => {
                res.json(files);
            });
        });
    });

    router.post("/file/open", (req, res) => {
        let path = req.body.path;
        open(path);
    });

    router.post("/file/get_stats", (req, res) => {
        let path = req.body.path;
        getStats(path).then((stats) => {
            res.json(stats);
        });
    });

    router.post("/file/get_home_dir", (req, res) => {
        res.json(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']);
    });

    router.post("/file/copy_file", (req, res) => {
        let {file, destDir} = req.body;

        fs.createReadStream(file).pipe(fs.createWriteStream(`${destDir}/${path.basename(file)}`))
            .on("end", () => {
                res.end();
                console.log("end");
            })
            .on("finish", () => {
                res.end();
                console.log("finish");
            })
            .on("close", () => {
                res.end();
                console.log("close");
            })
        ;
    });
    router.post("/file/copy_dir", (req, res) => {
        let {dir, destDir} = req.body;

        ncp(dir, destDir, function (err) {
            if (err) {
                return res.json({success: false});
            }
            res.json({success: true});
        });
    });

    router.post("/file/del_file", (req, res) => {
        let {name, fromDir} = req.body;
        fs.unlink(path.join(fromDir, name), () => {
            res.end();
        });
    });
    router.post("/file/del_dir", (req, res) => {
        let {name, fromDir} = req.body;
        rimraf(path.join(fromDir, name), () => {
            res.end();
        });
    });

    router.post("/file/make_dir", (req, res) => {
        let {path, fromDir} = req.body;

        function makeDir(name, inDir) {
            return new Promise((resolve, reject) => {
                fs.mkdir(`${inDir}/${name}`, () => {
                    resolve(`${inDir}/${name}`);
                });
            });
        }

        let promise = Promise.resolve(fromDir);
        path.split("/").forEach((name) => {
            promise.then((path) => makeDir(name, path))
        });

        promise.then((path) => res.json(path));
    });
};