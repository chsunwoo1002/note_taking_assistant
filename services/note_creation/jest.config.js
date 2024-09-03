module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^tests/(.*)$": "<rootDir>/tests/$1",
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
