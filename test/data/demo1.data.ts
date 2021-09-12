import { DataMapper } from "../../src";

const data: DataMapper = {
    "/api/setCounter": [
        {
            request: {
                method: "POST",
                data: '{"id":1,"operate":1}',
            },
            response: {
                status: 200,
                json: {
                    result: 0,
                },
            },
        },
        {
            request: {
                method: "POST",
                data: /"id":2,"operate":-1/,
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
