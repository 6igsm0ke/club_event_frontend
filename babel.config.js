module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'], // Adjust this path to your project structure
        alias: {
          '@components': './src/components', // Example of using alias
        },
      }],
    ],
  };
  