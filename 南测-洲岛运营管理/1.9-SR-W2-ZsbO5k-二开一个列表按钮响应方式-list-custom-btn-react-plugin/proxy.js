module.exports = {
  '/api': {
    'target': 'http://10.15.111.9:7251/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
