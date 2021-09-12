import { DataMapper } from "./server";
import { AxiosStatic } from "axios";
export { DataMapper } from "./server";
export declare const init: (axiosInstance: AxiosStatic) => void;
export declare const run: () => Promise<void>;
export declare const close: () => Promise<void>;
export declare const setSuitesData: (data: DataMapper) => Promise<boolean>;
