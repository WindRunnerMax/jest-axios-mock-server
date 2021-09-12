'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var http = require('http');
var axios = require('axios');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

let dataMapper = {};
let debug = false;
const setDebug = (status) => (debug = status);
const match = (path, method, query, data) => {
    if (debug) {
        console.log("path:", path);
        console.log("method:", method);
        console.log("query:", query);
        console.log("data:", data);
    }
    const defaultRes = [500, { result: -999 }];
    try {
        if (dataMapper[path] === void 0) {
            return defaultRes;
        }
        const curPathData = dataMapper[path];
        const [matchingItem] = curPathData.filter(item => {
            if (item.request.method !== method)
                return false;
            if (item.request.query !== void 0) {
                if (typeof item.request.query === "string" &&
                    item.request.query.indexOf("RegExp-") === 0) {
                    item.request.query = new RegExp(item.request.query.replace("RegExp-", ""));
                }
                if (typeof item.request.query === "string" && item.request.query !== query) {
                    return false;
                }
                if (item.request.query instanceof RegExp && !item.request.query.test(query)) {
                    return false;
                }
            }
            if (item.request.data !== void 0) {
                if (typeof item.request.data === "string" &&
                    item.request.data.indexOf("RegExp-") === 0) {
                    item.request.data = new RegExp(item.request.data.replace("RegExp-", ""));
                }
                if (typeof item.request.data === "string" && item.request.data !== data) {
                    return false;
                }
                if (item.request.data instanceof RegExp && !item.request.data.test(data)) {
                    return false;
                }
            }
            return true;
        });
        if (matchingItem !== void 0) {
            if (debug) {
                console.log("json:", matchingItem.response.json);
            }
            return [matchingItem.response.status, matchingItem.response.json];
        }
        return defaultRes;
    }
    catch (error) {
        console.log(error);
        return defaultRes;
    }
};
const app = http__default['default'].createServer((req, res) => {
    res.setHeader("Content-type", "application/json; charset=utf-8");
    let content = "";
    req.on("data", chunk => {
        content += chunk;
    });
    req.on("end", () => {
        let [resCode, resData] = [200, {}];
        const urlObj = new URL(req.url);
        if (urlObj.pathname === "/_set/_data/axios-mock") {
            const body = JSON.parse(content);
            dataMapper = body.data;
        }
        else {
            [resCode, resData] = match(urlObj.pathname, req.method, urlObj.search, content);
        }
        res.writeHead(resCode);
        res.write(JSON.stringify(resData));
        res.end();
    });
});

const config = {
    debug: false,
    host: "localhost",
    port: 7890,
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestConfig = require(path__default['default'].join(process.cwd(), "jest.config.js"));
if (jestConfig && jestConfig.globals) {
    const externalConfig = jestConfig.globals;
    config.debug = externalConfig.debug || config.debug;
    config.host = externalConfig.host || config.host;
    config.port = externalConfig.port || config.debug;
}
const init = (axiosInstance) => {
    axiosInstance.defaults.proxy = {
        host: config.host,
        port: config.port,
    };
};
const run = async () => {
    setDebug(config.debug);
    return new Promise(done => app.listen(config.port, () => done()));
};
const close = async () => {
    return new Promise(done => app.close(() => done()));
};
const setSuitesData = (data) => {
    return new Promise(resolve => {
        Object.keys(data).forEach(item => {
            data[item].forEach(v => {
                if (v.request.query && v.request.query instanceof RegExp) {
                    v.request.query = "RegExp-" + v.request.query.toString().slice(1, -1);
                }
                if (v.request.data && v.request.data instanceof RegExp) {
                    v.request.data = "RegExp-" + v.request.data.toString().slice(1, -1);
                }
            });
        });
        axios__default['default']
            .post(`http://${config.host}:${config.port}/_set/_data/axios-mock`, { data }, { timeout: 2000 })
            .then(() => {
            resolve(true);
        })
            .catch(err => {
            console.log(err);
            resolve(false);
        });
    });
};

exports.close = close;
exports.init = init;
exports.run = run;
exports.setSuitesData = setSuitesData;
