/// <reference types="@types/node" />
import http from "http";
interface MapperItem {
    request: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        query?: string | RegExp;
        data?: string | RegExp;
    };
    response: {
        status: number;
        json: any;
    };
}
export interface DataMapper {
    [key: string]: Array<MapperItem>;
}
export declare const setData: (data: DataMapper) => void;
export declare const setGlobalData: (data: DataMapper) => DataMapper;
export declare const setDebug: (status: boolean) => boolean;
export declare const app: http.Server;
export {};
