module.exports = {
  '/api': {
    'target': 'http://10.15.111.15:12201/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
