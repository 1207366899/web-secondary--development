module.exports = {
  '/api': {
    'target': 'http://10.15.111.15:8848/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
