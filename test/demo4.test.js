import { counter } from "./demo";
import { setSuitesData } from "../src/index";
import data from "./data/demo1.data";

beforeAll(() => {
    return setSuitesData(data);
});

describe("Simple mock", () => {
    it("test success", () => {
        return counter(1, 2).then(res => {
            expect(res).toStrictEqual({ result: 0, msg: "success" });
        });
    });

    it("test need login", () => {
        return counter(2, -3).then(res => {
            expect(res).toStrictEqual({ result: -100, msg: "need login" });
        });
    });
});
