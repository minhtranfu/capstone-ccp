const presets = [
  [
    "@babel/env",
    {
        targets: {
          esmodules: true
        },
        useBuiltIns: "entry",
    },
  ],
  ["@babel/react",],
];

const plugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/proposal-class-properties",
]

module.exports = {
  presets,
  plugins
};