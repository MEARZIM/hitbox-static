module.exports = function (api) {
    // Detect Jest reliably: babel-jest always identifies itself via the caller,
    // which is more dependable than NODE_ENV (not always "test" at transform time).
    const isTest =
        api.caller((caller) => !!caller && caller.name === "babel-jest") ||
        process.env.NODE_ENV === "test";

    // Under Jest, skip NativeWind's babel transform — it injects a
    // _ReactNativeCSSInterop global that trips Jest's jest.mock() sandbox.
    // className props simply become inert on RN components in tests.
    if (isTest) {
        return {
            presets: ["babel-preset-expo"],
        };
    }

    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
    };
};
