module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",  // Adjust the alias for your project structure
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Use ts-jest for TypeScript files
    '^.+\\.(js|jsx)$': 'babel-jest',  // Use babel-jest for JavaScript files
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx', // For JSX handling
        sourceMap: true,
        module: 'ESNext',
        target: 'ES2020',
      },
    },
  },
  testEnvironment: 'jsdom',  // Required for testing in a browser-like environment
  preset: 'ts-jest',  // Set ts-jest as the preset
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],  // Handle the appropriate extensions
};
