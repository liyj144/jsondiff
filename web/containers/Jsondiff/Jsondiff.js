/**
 * Created by liyanjie on 2017/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';

require('./Jsondiff.scss');

class Jsondiff extends Component {
  render() {
    return (
        <div className="mega">
          <div className="header">
            JSON 字符串格式化
          </div>
          <main>
            <AceEditor
                mode="json"
                theme="monokai"
                name="origin_json"
                editorProps={{$blockScrolling: true}}
              />
          </main>
        </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    news: state.news,
    selectors: state.selectors,
  };
}

export default connect(mapStateToProps)(Jsondiff);
