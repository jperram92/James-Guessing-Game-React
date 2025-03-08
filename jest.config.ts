module.exports = {
  // other Jest settings...
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",  // Map the "@" alias to the "src" directory
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Use ts-jest for TypeScript files
    '^.+\\.(js|jsx)$': 'babel-jest',  // Use babel-jest for JavaScript files
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        sourceMap: true,
        module: 'ESNext',
        target: 'ES2020',
        // You may want to ensure `allowImportingTsExtensions` is not included in this configuration
      },
    },
  },
  testEnvironment: 'jsdom',  // Use jsdom for browser-like testing environment
  preset: 'ts-jest',  // Make sure you're using ts-jest preset for TypeScript
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
