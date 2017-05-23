const express = require("express");
const fs = require("fs");

let apiHub = new express.Router();

// require("./venue-map-api-s").init(apiHub);
// require("./ticket-api-s").init(apiHub);


apiHub.post("/file/list", (req, res) => {
    fs.readdir(req.body.path, (err, files) => {
        res.json(files.map((fileName) => ({
            fileName,
        })));
    });
});

exports.apiHub = apiHub;