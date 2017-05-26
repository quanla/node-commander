var fileApiS = require("./file-api-s.js").fileApiS;

exports.apiHub = (router) => {
    fileApiS(router);
};