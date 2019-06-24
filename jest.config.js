module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": ".?(test|spec)\\.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  coverageReporters: ['lcov', 'clover'],
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  }
};