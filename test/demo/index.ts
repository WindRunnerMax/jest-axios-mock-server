import { request } from "./wrap-request";

export const counter = (id: number, number: number): Promise<{ result: number; msg: string }> => {
    const operate = number > 0 ? 1 : -1;
    return request({
        url: "https://www.example.com/api/setCounter",
        method: "POST",
        data: { id, operate },
    })
        .then(res => {
            if (res.result === 0) return { result: 0, msg: "success" };
            if (res.result === -100) return { result: -100, msg: "need login" };
            return { result: -999, msg: "fail" };
        })
        .catch(err => {
            return { result: -999, msg: "fail" };
        });
};
