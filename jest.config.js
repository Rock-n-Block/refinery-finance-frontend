/*
module.exports = {
  "roots": ['<rootDir>/src'],
  "transform": {
    '^.+\\.tsx?$': 'ts-jest',
  },
  "testRegex": '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  "moduleFileExtensions": ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  "snapshotSerializers": ['enzyme-to-json/serializer'],
  "setupFilesAfterEnv": ['<rootDir>/src/config/setupTests.ts'],
  moduleNameMapper: {
    "^.+\\.svg": "<rootDir>/src/__mocks__/svgrMock.tsx",
    "\\.(css|less|sass|scss)$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
};
*/

const path = require('path');

module.exports = {
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/src/config/setupTests.ts'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(
            __dirname,
            './mocks/file-mock.js',
        ),
        '\\.(css|less)$': path.join(__dirname, './mocks/style-mock.js'),
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/*.test.{ts,tsx}'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/types/'],
    collectCoverageFrom: ['**/*.{ts,tsx}'],
    reporters: [
        'default',
        [
            './node_modules/jest-html-reporter',
            {
                pageTitle: 'Test Report ',
                outputPath: './reports/test-report.html',
                includeFailureMsg: true,
            },
        ],
        [
            'jest-junit',
            {
                outputDirectory: './reports',
                suiteName: 'Jest Tests',
            },
        ],
    ],
};