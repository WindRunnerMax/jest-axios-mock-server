import { JSDOM } from "jsdom";
import { init } from "../../src/index";
import axios from "axios";

const config = {
    url: "https://www.example.com/",
    domain: "example.com",
};
const dom = new JSDOM("", config);
global.document = dom.window.document;
global.document.domain = config.domain;
global.window = dom.window;
global.location = dom.window.location;

init(axios);
