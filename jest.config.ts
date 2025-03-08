module.exports = {
  // Jest configuration
  moduleNameMapper: {
    // Map '@' alias to the 'src' folder
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Enable Babel transformation for JS/TS files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',  // Use ts-jest for TS files
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        sourceMap: true,
        module: 'ESNext',  // Ensure module resolution is ESNext
        target: 'ES2020',
      },
    },
  },
  testEnvironment: 'jsdom',
};
