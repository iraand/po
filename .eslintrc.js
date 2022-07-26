module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true,
    "browser": true,
    "mocha": true
  },
  "globals": {
    "expect": true,
    "should": true
  },
  "extends": "eslint:recommended",
  "plugins": [
    "react"
  ],
  "parserOptions": {
    "ecmaVersion": 2019,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    "modules": true
    },
    "sourceType": "module"
  },
  "rules": {
    "react/jsx-filename-extension": [1, {"extensions": [".js", ".jsx"]}],
    "implicit-arrow-linebreak": "off",
    "no-console": ["error", {allow: ["log", "error"]}],
    "comma-dangle": ["error", "only-multiline"],
    "no-unused-vars": ["error", {"vars": "all", "args": "none"}],
    "accessor-pairs": "error",
    "array-bracket-spacing": ["error", "never"],
    "array-callback-return": "error",
    "arrow-body-style": "error",
    "arrow-parens": ["error", "always"],
    "arrow-spacing": [
      "error",
      { "after": true,
        "before": true }
    ],
    "block-scoped-var": "error",
    "block-spacing": ["error", "always"],
    "brace-style": [
      "error",
      "1tbs",
      { "allowSingleLine": true }
    ],
    "callback-return": "error",
    "camelcase": "off",
    "comma-spacing": [
      "error",
      { "after": true,
        "before": false }
    ],
    "comma-style": ["error", "last"],
    "complexity": "warn",
    "computed-property-spacing": ["error", "never"],
    "consistent-return": "off",
    "consistent-this": ["error", "that"],
    "curly": ["error", "multi-line"],
    "default-case": "error",
    "dot-location": ["error", "property"],
    "dot-notation": ["error", { "allowKeywords": true }],
    "eol-last": ["error", "unix"],
    "eqeqeq": ["error", "always"],
    "func-names": ["error", "as-needed"],
    "func-style": ["error"],
    "generator-star-spacing": "error",
    "global-require": "error",
    "guard-for-in": "error",
    "handle-callback-err": "error",
    "id-blacklist": "error",
    "id-length": "off",
    "id-match": "error",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "init-declarations": "off",
    "key-spacing": "error",
    "keyword-spacing": [
      "error",
      { "after": true,
        "before": true }
    ],
    "linebreak-style": ["error", "unix"],
    "lines-around-comment": ["error", { "beforeBlockComment": true }],
    "max-depth": "error",
    "max-len": "off",
    // "max-lines": "warn",
    "max-nested-callbacks": "error",
    "max-params": ["error", 5],
    "max-statements": "off",
    "max-statements-per-line": ["error", { "max": 1 }],
    "new-cap": "error",
    "new-parens": "error",
    "newline-after-var": "off",
    "newline-before-return": "off",
    "newline-per-chained-call": "off",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-catch-shadow": "error",
    "no-confusing-arrow": "warn",
    "no-continue": "error",
    "no-div-regex": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": ["error", { "allow": ["arrowFunctions"] }],
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-extra-parens": ["error", "all", { "nestedBinaryExpressions": false }],
    "no-floating-decimal": "error",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-inline-comments": "off",
    "no-inner-declarations": ["error", "both"],
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-magic-numbers": "off",
    "no-mixed-operators": "error",
    "no-mixed-requires": "error",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "error",
    "no-native-reassign": "error",
    "no-negated-condition": "error",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": ["error", { "props": false }],
    "no-path-concat": "error",
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-process-env": "warn",
    "no-process-exit": "warn",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-restricted-globals": "error",
    "no-restricted-imports": "error",
    "no-restricted-modules": "error",
    "no-restricted-syntax": "error",
    "no-return-assign": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-spaced-func": "error",
    "no-sync": "error",
    "no-ternary": "off",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-undefined": "error",
    "no-underscore-dangle": "off",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "error",
    "no-use-before-define": ["error", {"functions": false, "classes": false}],
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-useless-rename": "error",
    "no-var": "error",
    "no-void": "error",
    "no-warning-comments": ["warn", {"terms": ["todo", "fixme", "xxx"], "location": "anywhere"}],
    "no-whitespace-before-property": "error",
    "no-with": "error",
    "object-curly-newline": "off",
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": [
      "error",
      { "allowMultiplePropertiesPerLine": true }
    ],
    "object-shorthand": "error",
    "one-var": ["error", { uninitialized: "always", initialized: "never" }],
    "one-var-declaration-per-line": "off",
    "operator-assignment": "error",
    "operator-linebreak": ["error", "before", { "overrides": { "=": "after" } }],
    "padded-blocks": "off",
    "prefer-arrow-callback": "off",
    "prefer-const": "error",
    "prefer-reflect": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": "off",
    "quotes": [
      "error",
      "single"
    ],
    "radix": "error",
    "require-jsdoc": "off",
    "require-yield": "error",
    "rest-spread-spacing": "error",
    "semi": "error",
    "semi-spacing": [
      "error",
      { "after": true,
        "before": false }
    ],
    "sort-vars": "off",
    "space-before-blocks": "error",
    "space-before-function-paren": "off",
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": [
      "error",
      "always"
    ],
    "strict": "error",
    "template-curly-spacing": ["error", "never"],
    "unicode-bom": ["error", "never"],
    "valid-jsdoc": "error",
    "vars-on-top": "off",
    "wrap-iife": "error",
    "wrap-regex": "error",
    "yield-star-spacing": "error",
    "yoda": ["error", "never"],
    "react/jsx-boolean-value": 1,
    "react/jsx-closing-bracket-location": 1,
    "react/jsx-curly-spacing": 1,
    "react/jsx-key": 1,
    "react/jsx-max-props-per-line": [1, { "maximum": 5 }],
    "react/jsx-no-duplicate-props": 1,
    "react/jsx-no-literals": 1,
    "react/jsx-no-undef": 1,
    "react/jsx-pascal-case": 1,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/no-danger": 1,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-direct-mutation-state": 1,
    "react/no-set-state": 1,
    "react/no-unknown-property": 1,
    "react/prefer-es6-class": 1,
    "react/react-in-jsx-scope": 1,
    "react/self-closing-comp": 1,
    "react/sort-comp": 1,
  }
};
