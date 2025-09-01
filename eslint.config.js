// eslint.config.js - ESLint v9 Flat Config
import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        exports: "writable",
        global: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly"
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn", 
      "no-console": "off"
    }
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"]
  }
];
