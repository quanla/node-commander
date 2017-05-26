var MockApi = require("./mock-api.js").MockApi;
var apiHub = require("../server/api-s/api-hub.js").apiHub;

let router = MockApi.createRouter();

apiHub(router);

window.API = router.createClient();
