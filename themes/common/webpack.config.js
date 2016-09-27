module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|vendor/,
        loader: 'babel'
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json']
  }
};
