// Conventional commits, checked by the commit-msg hook (design.md section 10).
// The extra rule enforces the house writing rule: no em dash (U+2014) in commit messages.
import type { UserConfig } from "@commitlint/types";

const EM_DASH = "—";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-em-dash": ({ raw }) => [
          !raw?.includes(EM_DASH),
          "no em dash (U+2014): use a colon, comma, parentheses or a full stop",
        ],
      },
    },
  ],
  rules: {
    "no-em-dash": [2, "always"],
  },
};

export default config;
