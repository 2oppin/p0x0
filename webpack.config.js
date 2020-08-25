const path = require('path');

module.exports = () => ({
  mode: "production",
  devtool: "source-map",
  node: {

  },
  entry: {
    bin: './src/generator.ts',
  },
  output: {
    path: __dirname + '/bin',
    filename: 'p0x0'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules")
    ],
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.([tj]s)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      }
    ]
  },
  target: 'node'
});
