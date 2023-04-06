module.exports = {
  tabWidth: 2, // 缩进2个空格
  jsxSingleQuote: true, // jsx中使用单引号
  jsxBracketSameLine: true, // jsx标签闭合位置
  printWidth: 100, // 一行最多100个字符
  singleQuote: true, // 使用单引号
  semi: false, // 不使用分号
  overrides: [ // 重写规则
    {
      files: '*.json', // json文件
      options: {
        printWidth: 200, // 一行最多200个字符
      },
    },
  ],
  arrowParens: 'always', // 箭头函数参数只有一个时是否要有小括号
}
