module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",  // This maps '@' to the src directory
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Use ts-jest for TypeScript files
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
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
  testEnvironment: 'jsdom',
};
