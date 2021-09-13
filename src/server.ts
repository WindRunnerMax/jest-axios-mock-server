import http from "http";
import { REGEXP_FLAG, CORRESPOND_FLAGS } from "./constant";
interface MapperItem {
    request: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        query?: string | RegExp;
        data?: string | RegExp;
    };
    response: {
        status: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json: any;
    };
}

export interface DataMapper {
    [key: string]: Array<MapperItem>;
}

let dataMapper: DataMapper = {};
let debug = false;

export const setData = (data: DataMapper): void => {
    dataMapper = data;
};

export const setGlobalData = (data: DataMapper): DataMapper => (dataMapper = data);

export const setDebug = (status: boolean): boolean => (debug = status);

const match = (path: string, method: string, query: string, data: string) => {
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
            if (item.request.method !== method) return false;
            if (item.request.query !== void 0) {
                if (
                    typeof item.request.query === "string" &&
                    item.request.query.indexOf(REGEXP_FLAG) === 0
                ) {
                    item.request.query = new RegExp(item.request.query.replace(REGEXP_FLAG, ""));
                }
                if (typeof item.request.query === "string" && item.request.query !== query) {
                    return false;
                }
                if (item.request.query instanceof RegExp && !item.request.query.test(query)) {
                    return false;
                }
            }
            if (item.request.data !== void 0) {
                if (
                    typeof item.request.data === "string" &&
                    item.request.data.indexOf(REGEXP_FLAG) === 0
                ) {
                    item.request.data = new RegExp(item.request.data.replace(REGEXP_FLAG, ""));
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
    } catch (error) {
        console.log(error);
        return defaultRes;
    }
};

export const app = http.createServer((req, res) => {
    res.setHeader("Content-type", "application/json; charset=utf-8");
    let content = "";
    req.on("data", chunk => {
        content += chunk;
    });
    req.on("end", () => {
        let [resCode, resData] = [200, {}];
        const urlObj = new URL(req.url);
        if (urlObj.pathname === CORRESPOND_FLAGS.SET_DATA) {
            const body = JSON.parse(content);
            dataMapper = body.data;
        } else {
            [resCode, resData] = match(urlObj.pathname, req.method, urlObj.search, content);
        }
        res.writeHead(resCode);
        res.write(JSON.stringify(resData));
        res.end();
    });
});
