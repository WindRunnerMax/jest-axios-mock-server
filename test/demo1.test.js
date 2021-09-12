import { counter } from "./demo";
import { request } from "./demo/wrap-request";

jest.mock("./demo/wrap-request");

describe("Simple mock", () => {
    it("test success", () => {
        request.mockResolvedValue({ result: 0 });
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: 0, msg: "success" });
        });
    });

    it("test need login", () => {
        request.mockResolvedValue({ result: -100 });
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -100, msg: "need login" });
        });
    });

    it("test something wrong", () => {
        request.mockResolvedValue({ result: 1111111 });
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: -999, msg: "fail" });
        });
    });
});
