module.exports = {
  "/api": {
    target: "http://10.15.111.12:12200/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
