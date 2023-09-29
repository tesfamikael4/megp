module.exports = {
  extends: ['@megp/eslint-config-custom/react-internal'],
  rules: {
    // Add any project-specific rules or overrides here
    '@typescript-eslint/no-extraneous-class': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
