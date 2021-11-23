const baseConfig = require("../../tailwind.config.js");

module.exports = {
  ...baseConfig,
  darkMode: "media",
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      width: {
        ...baseConfig.theme.extend.width,
        "3xl": "48rem",
      },
    },
  },
};
