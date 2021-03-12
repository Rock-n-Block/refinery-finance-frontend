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
