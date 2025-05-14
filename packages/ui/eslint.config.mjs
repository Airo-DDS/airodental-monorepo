import { config as reactInternalConfig } from "@repo/eslint-config/react-internal";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...reactInternalConfig,
  // any ui-specific overrides
];
