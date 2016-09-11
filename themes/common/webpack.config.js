module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? null : 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
    extensions: ['', '.js', '.json']
  }
};
