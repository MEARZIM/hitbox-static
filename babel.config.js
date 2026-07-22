module.exports = function (api) {
    // Cache key varies by env so the test build differs from dev/prod.
    api.cache.using(() => process.env.NODE_ENV);
    const isTest = process.env.NODE_ENV === "test";

    // Under Jest, skip NativeWind's babel transform (it injects a
    // _ReactNativeCSSInterop global that trips Jest's babel sandbox).
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