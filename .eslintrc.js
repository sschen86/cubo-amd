module.exports = {
  env: {
    commonjs: true,
    es6: true
  },
  extends: [
    'standard', 'plugin:vue/essential'
  ],
  globals: {

  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    ...require('./rules/basic'),
    ...require('./rules/vue'),
  }
}
