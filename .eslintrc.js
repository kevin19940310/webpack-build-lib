module.exports = {
  parser: "babel-eslint",
  extends: [
    "airbnb-base",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "prettier/unicorn",
  ],
  env: {
    browser: true,
    node: true,
  },
};
