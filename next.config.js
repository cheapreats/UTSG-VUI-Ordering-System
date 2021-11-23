/** @type {import('next').NextConfig} */
const path = require("path");
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/oauth",
        has: [
          {
            type: "query",
            key: "code",
          },
        ],
        destination: "/",
        permanent: false,
      },
    ];
  },

  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "styled-components": path.resolve("./node_modules/styled-components"),
    };
    return config;
  },
};
