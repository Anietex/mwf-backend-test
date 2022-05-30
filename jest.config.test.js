module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    moduleDirectories: ["node_modules", "src"],

    testEnvironment: "node",
    testMatch: [
        "/**/*.test.ts"
    ],
    'roots': [
        '<rootDir>/src'
    ],
    'moduleNameMapper': {
        '@/(.*)': '<rootDir>/src'
    }
};
