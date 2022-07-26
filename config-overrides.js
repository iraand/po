const path = require('path');
const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@body-background': 'rgb(240, 242, 245)',
        // '@component-background': 'rgb(240, 242, 245)',
        '@primary-color': '#d8c072',
        '@link-color': '#a8a8a8',
        '@btn-default-bg': 'white',
        '@btn-default-color': '#d8c072',
        '@btn-default-border': '#d8c072',
        '@border-radius-base': '4px'
      }
    }
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
);

// All customizable variables: https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less