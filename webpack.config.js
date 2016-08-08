module.exports = {
  entry: {
    app: './client/app.js'
  },
  output: {
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|server|public|www)/,
        loader: 'babel',
        query: {
          presets: ["es2015"]
        }
      }
    ]
  }
};