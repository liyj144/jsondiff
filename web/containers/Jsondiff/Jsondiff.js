/**
 * Created by liyanjie on 2017/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

require('./Jsondiff.scss');

class Jsondiff extends Component {

}

function mapStateToProps(state) {
  return {
    news: state.news,
    selectors: state.selectors,
  };
}

export default connect(mapStateToProps)(Jsondiff);