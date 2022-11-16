const webpack = require("webpack");
module.exports = function override(config, env) {
  if (typeof config.resolve.fallback === "object") {
    Object.assign(config.resolve.fallback, {
      fs: false,
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      vm: require.resolve("vm-browserify"),
      url: require.resolve("url/"),
      constants: require.resolve("constants-browserify"),
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
    });
  } else {
    config.resolve.fallback = {
      fs: false,
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      vm: require.resolve("vm-browserify"),
      url: require.resolve("url/"),
      constants: require.resolve("constants-browserify"),
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
    };
  }

  if (Array.isArray(config.plugins)) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      })
    );
  } else {
    config.plugins = [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ];
  }

  return config;
};
