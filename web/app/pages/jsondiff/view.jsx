/**
 * Created by liyanjie on 2017/4/23.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import { Button, Modal } from 'antd'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/monokai'

let jsonlint = require("jsonlint")

import './style.css'

export default class jsonView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            jsonStr: `
           {
  "@context": {
    "name": "http://schema.org/name","description": "http://schema.org/description",
    "image": {
      "@id": "http://schema.org/image","@type": "@id"
    },
    "geo": "http://schema.org/geo",
    "latitude": {
      "@id": "http://schema.org/latitude",
      "@type": "xsd:float"
    },
    "longitude": {
      "@id": "http://schema.org/longitude",
      "@type": "xsd:float"
    },
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "name": "The Empire State Building",
  "description": "The Empire State Building is a 102-story landmark in New York City.",
  "image": "http://www.civil.usherbrooke.ca/cours/gci215a/empire-state-building.jpg",
  "geo": {
    "latitude": "40.75",
    "longitude": "73.98"
  }
}`,
            formatErrorKey: 1,
            formatErrorVisible: false
        }

        this.formatJson = this.formatJson.bind(this)
        this.changeJsonStr = this.changeJsonStr.bind(this)
    }

    changeJsonStr(newVal) {
        this.setState({jsonStr: newVal})
    }

    formatJson() {
        let parseJson = {}
        try{
            parseJson = jsonlint.parse(this.state.jsonStr)
            let jsonStr = JSON.stringify(parseJson, null, "\t")
            this.setState({jsonStr: jsonStr})
        }catch(e){
            Modal.info({
                title: "提示",
                content: "JSON格式不正确，异常如下：" + e
            })
        }
    }
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
                onChange={this.changeJsonStr}
                value={this.state.jsonStr}
                editorProps={{$blockScrolling: true}}
              />
              <div className="button-group">
                <Button type="primary" onClick={this.formatJson}>格式化</Button>
              </div>
          </main>
        </div>
    );
  }
}