/**
 * Created by liyanjie on 2017/4/23.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import { Row, Col, Button, Modal } from 'antd'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/monokai'

let jsonlint = require("jsonlint")

import './style.css'

export default class jsonDiff extends Component {

    constructor(props) {
        super(props)
        this.state = {
            jsonStrOrigin: `
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
            jsonStrCompare: `
           {
  "@context": {
    "name": "http://schema.org/name","description": "http://schema.org/description",
    "image": {
      "@id": "http://schema.org/image","@type": "@id"
    },
    "geo": "http://schema.org/geo",
    "latitude": {
      "@id": "http://schema.org/latitude2",
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
    "longitude": "74.98"
  }
}`,
            formatErrorKey: 1,
            formatErrorVisible: false
        }

        this.compareJson = this.compareJson.bind(this)
        this.changeJsonStr = this.changeJsonStr.bind(this)
    }

    changeJsonStr(type, newVal) {
        if('origin' === type){
            this.setState({jsonStrOrigin: newVal})
        }else if('compare' === type){
            this.setState({jsonStrCompare: newVal})
        }
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

    compareJson() {
        let parseJsonOrigin = {}
        let parseJsonCompare = {}
        try{
            parseJsonOrigin = jsonlint.parse(this.state.jsonStrOrigin)
            let jsonStr = JSON.stringify(parseJsonOrigin, null, "\t")
            this.setState({jsonStrOrigin: jsonStr})
        }catch(e){
            Modal.info({
                title: "提示",
                content: "源JSON格式不正确，异常如下：" + e
            })
        }
        try{
            parseJsonCompare = jsonlint.parse(this.state.jsonStrCompare)
            let jsonStr = JSON.stringify(parseJsonCompare, null, "\t")
            this.setState({jsonStrCompare: jsonStr})
        }catch(e){
            Modal.info({
                title: "提示",
                content: "对比JSON格式不正确，异常如下：" + e
            })
        }

    }

    render() {
        return (
        <div className="mega">
          <div className="header">
            JSON 字符串对比
          </div>
          <main>
            <Row type="flex" align="middle" gutter={16}>
                <Col span={11}>
                    <AceEditor
                        mode="json"
                        theme="monokai"
                        name="origin_json"
                        onChange={this.changeJsonStr.bind(event, 'origin')}
                        value={this.state.jsonStrOrigin}
                        editorProps={{$blockScrolling: true}}
                      />
                </Col>
                <Col span={2}>
                    <Button type="primary" onClick={this.compareJson}>对比</Button>
                </Col>
                <Col span={11}>
                    <AceEditor
                        mode="json"
                        theme="monokai"
                        name="compare_json"
                        onChange={this.changeJsonStr.bind(event, 'compare')}
                        value={this.state.jsonStrCompare}
                        editorProps={{$blockScrolling: true}}
                      />
                </Col>
            </Row>
          </main>
        </div>
    );
  }
}
