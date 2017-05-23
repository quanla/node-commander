const express = require("express");

let apiHub = new express.Router();

// require("./venue-map-api-s").init(apiHub);
// require("./ticket-api-s").init(apiHub);


// apiHub.post("/file", (req, res) => {
//     console.log(req.body.msg);
//     res.end();
// });

exports.apiHub = apiHub;