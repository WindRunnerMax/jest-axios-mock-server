module.exports = {
    moduleFileExtensions: ["js", "ts"],
    setupFiles: ["./test/config/setup.js"],
    globalSetup: "./test/config/global-setup.js",
    globalTeardown: "./test/config/global-teardown.js",
    moduleDirectories: ["node_modules", "src"],
    transform: {
        "\\.ts$": "ts-jest",
        "\\.js$": "babel-jest",
    },
    collectCoverage: false,
    testMatch: ["**/test/**/*.test.js"],
    globals: {
        host: "127.0.0.1",
        port: "5000",
        debug: false,
    },
};
