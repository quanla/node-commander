const express = require("express");
const fs = require("fs");

exports.apiHub = (router) => {
    router.post("/file/list", (req, res) => {
        fs.readdir(req.body.path, (err, files) => {
            res.json(files.map((fileName) => ({
                fileName,
            })));
        });
    });
};