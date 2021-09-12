import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
    timeout: 3000,
});

export const request = (options: AxiosRequestConfig): Promise<any> => {
    // do something wrap
    return instance.request(options).then(res => res.data);
};
