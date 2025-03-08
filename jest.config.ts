module.exports = {
    // Jest configuration
    moduleNameMapper: {
      // Map '@' alias to the 'src' folder
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    // Enable Babel transformation for module support
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // This is important to allow import.meta to work
    globals: {
      'ts-jest': {
        tsconfig: {
          jsx: 'react-jsx',
          sourceMap: true,
        },
      },
    },
    // Additional Jest configurations can go here
    testEnvironment: 'jsdom',
  };
  