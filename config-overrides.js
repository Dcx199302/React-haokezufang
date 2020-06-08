// 创建一个 `config-overrides.js` 用于修改默认配置
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    })
);
