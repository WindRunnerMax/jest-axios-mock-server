import { counter } from "./demo";
import { setSuitesData } from "../src/index";
import data from "./data/demo2.data";

beforeAll(() => {
    return setSuitesData(data);
});

describe("Simple mock", () => {
    it("test success", () => {
        return counter(3, -30).then(res => {
            expect(res).toStrictEqual({ result: -100, msg: "need login" });
        });
    });

    it("test no match response", () => {
        return counter(6, 2).then(res => {
            expect(res).toStrictEqual({ result: -999, msg: "fail" });
        });
    });
});
