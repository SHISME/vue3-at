module.exports = {
  lintOnSave: false,
  outputDir: "docs",
  publicPath: "/vue3-at/",
  css: {
    extract: false,
  },
  pages: {
    index: {
      entry: "demo/main.ts",
    },
  },
};
