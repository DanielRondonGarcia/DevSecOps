module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    reporters: ['default', ['jest-sonar', { 
        outputDirectory: 'coverage',
        outputName: 'test-reporter.xml' 
    }]],
    coverageReporters: ['lcov'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],

};