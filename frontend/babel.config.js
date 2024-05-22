module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: ['@babel/plugin-transform-private-methods'] // Certifique-se de que está dentro da matriz "plugins"
};