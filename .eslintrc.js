module.exports = {
  "rules": {
    "indent": [2, 2,
      {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}
    ],
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],
    "consistent-return": 2,
    "block-scoped-var": 2,
    "no-alert": 2,
    "no-console": 0,
    "comma-dangle": [2, "always-multiline"],
    "array-bracket-spacing": [2, "never"],
    "block-spacing": [2, "always"]
  },
  "env": {
    "node": true
  },
  "extends": "eslint:recommended"
};
