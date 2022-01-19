// 通过react脚手架[create-react-app]创建的项目，如果需要在项目中配置一些webpack配置
// 需要在根目录下新建一个名称为config-overrides.js的文件
// react-app-rewired  customize-cra
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const {
  override,
  addWebpackModuleRule,
  addWebpackPlugin,
  addWebpackAlias,
  overrideDevServer
} = require('customize-cra');
const ArcoWebpackPlugin = require('@arco-design/webpack-plugin');
const addLessLoader = require('customize-cra-less-loader');

module.exports = {
  webpack: override(
    addLessLoader(),
    addWebpackModuleRule({
      test: /\.svg$/,
      loader: '@svgr/webpack',
    }),
    addWebpackPlugin(new ArcoWebpackPlugin()),
    // 配置文件路径别名
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
    })
  ),
  devServer: overrideDevServer(config => {
    config.proxy = {
      '/api': {
        target: 'https://t0.tianditu.gov.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
    return config
  })
};
