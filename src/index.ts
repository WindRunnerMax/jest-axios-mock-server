import { app, setDebug, DataMapper } from "./server";
import axios, { AxiosStatic } from "axios";
import path from "path";
import { REGEXP_FLAG, CORRESPOND_FLAGS } from "./constant";
export { DataMapper } from "./server";

interface Config {
    debug?: boolean;
    host?: string;
    port?: number;
}

const config: Config = {
    debug: false,
    host: "localhost",
    port: 7890,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestConfig = require(path.join(process.cwd(), "jest.config.js"));
if (jestConfig && jestConfig.globals) {
    const externalConfig = jestConfig.globals;
    config.debug = externalConfig.debug || config.debug;
    config.host = externalConfig.host || config.host;
    config.port = externalConfig.port || config.debug;
}

export const init = (axiosInstance: AxiosStatic): void => {
    axiosInstance.defaults.proxy = {
        host: config.host,
        port: config.port,
    };
};

export const run = async (): Promise<void> => {
    setDebug(config.debug);
    return new Promise<void>(done => app.listen(config.port, () => done()));
};

export const close = async (): Promise<void> => {
    return new Promise<void>(done => app.close(() => done()));
};

export const setSuitesData = (data: DataMapper): Promise<boolean> => {
    return new Promise(resolve => {
        Object.keys(data).forEach(item => {
            data[item].forEach(v => {
                if (v.request.query && v.request.query instanceof RegExp) {
                    v.request.query = REGEXP_FLAG + v.request.query.toString().slice(1, -1);
                }
                if (v.request.data && v.request.data instanceof RegExp) {
                    v.request.data = REGEXP_FLAG + v.request.data.toString().slice(1, -1);
                }
            });
        });
        axios
            .post(
                `http://${config.host}:${config.port}${CORRESPOND_FLAGS.SET_DATA}`,
                { data },
                { proxy: { host: config.host, port: config.port }, timeout: 2000 }
            )
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
};
