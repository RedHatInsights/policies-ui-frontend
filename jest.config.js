module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.ts(x?)',
        '!src/**/stories/*'
    ],
    setupFiles: [
        '<rootDir>/config/setupTests.ts'
    ],
    roots: [
        '<rootDir>/src/'
    ],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
};
