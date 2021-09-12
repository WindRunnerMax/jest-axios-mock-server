import { DataMapper } from "../../src";

const data: DataMapper = {
    "/api/setCounter": [
        {
            request: {
                method: "POST",
                data: /"id":3,"operate":-1/,
            },
            response: {
                status: 200,
                json: {
                    result: -100,
                },
            },
        },
    ],
};

export default data;
