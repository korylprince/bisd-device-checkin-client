module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "vue",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-console": ["error", {allow: ["error"]}],
        "camelcase": 0,
        "space-before-function-paren": ["error", "never"],
        "object-curly-spacing": ["error", "never"],
        "arrow-parens": ["error", "always"],
        "arrow-body-style": ["error", "always"]
    },
    "plugins": [
        "html"
    ]
};
