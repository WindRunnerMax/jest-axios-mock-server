import { counter } from "./demo";
import { request } from "./demo/wrap-request";

jest.mock("./demo/wrap-request");

describe("Simple mock", () => {
    it("test success", () => {
        request.mockImplementation(() => Promise.resolve({ result: 0 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: 0, msg: "success" });
        });
    });

    it("test need login", () => {
        request.mockImplementation(() => Promise.resolve({ result: -100 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -100, msg: "need login" });
        });
    });

    it("test something wrong", () => {
        request.mockImplementation(() => Promise.resolve({ result: 1111111 }));
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -999, msg: "fail" });
        });
    });

    it("test param transform", () => {
        return new Promise(done => {
            request.mockImplementation(({ data }) => {
                expect(data).toStrictEqual({ id: 1, operate: 1 });
                done();
                return Promise.resolve({ result: 0 });
            });
            counter(1, 1000);
        });
    });
});
