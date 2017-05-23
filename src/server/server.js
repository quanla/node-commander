const express = require("express");
const open = require("open");
const bodyParser = require("body-parser");
const {apiHub} = require("./api-hub/api-hub");

var app = express();

app.use(express.static(__dirname + "/../../dist"));
app.use(express.static(__dirname));
app.use("/data", express.static(__dirname + "/../mock-data"));

app.use("/api", bodyParser.json());

let router = new express.Router();
apiHub(router);
app.use("/api", router);

let port = 6572;
app.listen(port, () => {
    console.log(`Server listening ${6572}`);

    open(`http://localhost:${port}`);
});