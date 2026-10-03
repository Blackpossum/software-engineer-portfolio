import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import perfectionist from "eslint-plugin-perfectionist";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  sonarjs.configs.recommended,
  // Override default ignores of eslint-config-next.
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    plugins: { unicorn, perfectionist },
    rules: {
      ...unicorn.configs.recommended.rules,
      ...perfectionist.configs["recommended-natural"].rules,

      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "max-params": ["error", 3],

      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration, ImportAllDeclaration",
          message: "Export/Import all (*) is forbidden",
        },
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain, which is often not what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
        },
        {
          selector: "LabeledStatement",
          message:
            "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],

      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "sonarjs/todo-tag": "off",
      "sonarjs/no-hardcoded-password": "off",
    },
  },

  prettier,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
