module.exports = {
    "roots": [
      "<rootDir>"
    ],
    "modulePathIgnorePatterns": [
      "<rootDir>/out",
      "<rootDir>/dist",
      "<rootDir>/src/__tests__/utils/"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "collectCoverage": true,
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts}",
        "resources/**/*.{js,jsx,ts}",
        "!**/node_modules/**",
        "!**/coverage/**"
    ]
  }
