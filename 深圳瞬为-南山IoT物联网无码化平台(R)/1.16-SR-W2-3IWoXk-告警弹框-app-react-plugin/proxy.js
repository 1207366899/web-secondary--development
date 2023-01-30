module.exports = {
  '/api': {
    // 'target': 'http://10.15.111.12:12200',
    // 'target': 'http://36.139.182.140:18080/',
    'target': 'http://14.21.43.41:18080/',
    'changeOrigin': true,
    'pathRewrite': { '^/api': '' },
  },
}