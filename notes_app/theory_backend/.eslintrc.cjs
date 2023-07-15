module.exports = {
  env: {
    commonjs: true,
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true,
        jest: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    indent: [
        "error",
        4
    ],
    'no-console':0
  }
}
