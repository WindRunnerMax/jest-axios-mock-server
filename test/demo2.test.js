import { counter } from "./demo";
import * as request from "./demo/wrap-request";

jest.mock("./demo/wrap-request", () => {
    let hook = () => ({ result: 0 });
    return {
        setHook: cb => (hook = cb),
        request: (...args) => {
            return new Promise(resolve => {
                resolve(hook(...args));
            });
        },
    };
});

describe("Simple mock", () => {
    it("test success", () => {
        request.setHook(() => ({ result: 0 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: 0, msg: "success" });
        });
    });

    it("test need login", () => {
        request.setHook(() => ({ result: -100 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -100, msg: "need login" });
        });
    });

    it("test something wrong", () => {
        request.setHook(() => ({ result: 1111111 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -999, msg: "fail" });
        });
    });

    it("test param transform", () => {
        return new Promise(done => {
            request.setHook(({ data }) => {
                expect(data).toStrictEqual({ id: 1, operate: 1 });
                done();
                return { result: 0 };
            });
            counter(1, 1000);
        });
    });
});
