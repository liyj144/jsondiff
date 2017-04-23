/**
 * Created by liyanjie on 2017/4/16.
 */
module.exports = process.env.NODE_ENV === 'production' ? require('./webpack.production.config.js') : require('./webpack.development.config.js');
