module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",  // Adjust path alias for your project
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
      },
    },
  },
  testEnvironment: 'jsdom',  // Simulate a browser environment
  preset: 'ts-jest',  // Ensure that ts-jest is used as the preset
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],  // Add the appropriate extensions
};
