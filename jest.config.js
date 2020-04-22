module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!**/node_modules/**'
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/utils/Expression/*'
    ],
    setupFiles: [
        '<rootDir>/config/setupTests.ts'
    ],
    roots: [
        '<rootDir>/src/'
    ],
    moduleNameMapper: {
        '\\.(svg)$': 'identity-obj-proxy',
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
};
