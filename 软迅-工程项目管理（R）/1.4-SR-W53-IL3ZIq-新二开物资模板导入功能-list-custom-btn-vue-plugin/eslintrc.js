module.exports = {
  parser: "babel-eslint",
  plugins: ["react", "prettier", "standard", "react-hooks"],
  extends: ["standard", "plugin:react/recommended", "prettier"],
  env: { node: true, es6: true, browser: true },
  rules: {
    "prettier/prettier": "error",
    "standard/no-callback-literal": "off",
    camelcase: "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      // rules: fileConfig.rules,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
};
