import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore legacy/admin folders to unblock deploy
    "app/admin/**",
    "app/api/admin/**",
    "app/api/platforms/**",
  ]),
]);

export default eslintConfig;
