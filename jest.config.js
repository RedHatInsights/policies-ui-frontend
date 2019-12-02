module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.js',
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
