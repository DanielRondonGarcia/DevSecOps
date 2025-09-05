module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    reporters: ['default', ['jest-sonar', {
        outputDirectory: 'coverage',
        outputName: 'test-reporter.xml',
        reportedFilePath: 'relative'
    }]],
    coverageReporters: ['lcov', 'text', 'text-summary'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
