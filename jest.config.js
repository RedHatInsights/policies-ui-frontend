module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!test/**'
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/utils/Expression/*',
        '<rootDir>/src/cli/*'
    ],
    setupFiles: [
        '<rootDir>/config/setupTests.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/setupTestFramework.ts'
    ],
    roots: [
        '<rootDir>/src/',
        '<rootDir>/test/'
    ],
    moduleNameMapper: {
        '\\.(svg)$': 'identity-obj-proxy',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '^axios$': require.resolve('axios')
    }
};
