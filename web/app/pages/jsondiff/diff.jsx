/**
 * Created by liyanjie on 2017/4/23.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import { Row, Col, Button, Modal } from 'antd'
import AceEditor from 'react-ace'
import ace from 'brace';

import 'brace/mode/json'
import 'brace/theme/monokai'
import jdd from '../../utils/jdd'

let jsonlint = require("jsonlint")
const { Range } = ace.acequire('ace/range')

import './style.css'

export default class jsonDiff extends Component {

    constructor(props) {
        super(props)
        this.state = {
            originMarker: [],
            compareMarker: [],
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
        if ('origin' === type) {
            this.setState({ jsonStrOrigin: newVal })
        } else if ('compare' === type) {
            this.setState({ jsonStrCompare: newVal })
        }
    }

    compareJson() {
        let parseJsonOrigin = {}
        let parseJsonCompare = {}
        try {
            parseJsonOrigin = jsonlint.parse(this.state.jsonStrOrigin)

        } catch (e) {
            Modal.info({
                title: "提示",
                content: "源JSON格式不正确，异常如下：" + e
            })
        }
        try {
            parseJsonCompare = jsonlint.parse(this.state.jsonStrCompare)
        } catch (e) {
            Modal.info({
                title: "提示",
                content: "对比JSON格式不正确，异常如下：" + e
            })
        }
        jdd.diffs = []
        let config1 = jdd.createConfig()
        jdd.formatAndDecorate(config1, parseJsonOrigin)
        this.setState({ jsonStrOrigin: config1.out })

        let config2 = jdd.createConfig()
        jdd.formatAndDecorate(config2, parseJsonCompare)
        this.setState({ jsonStrCompare: config2.out })

        jdd.diffVal(parseJsonOrigin, config1, parseJsonCompare, config2)
        let originEditor = this.refs.originJson.editor
        let originSession = originEditor.getSession()
        let compareEditor = this.refs.compareJson.editor
        let compareSession = compareEditor.getSession()
        this.state.originMarker.forEach(function(id) {
            originSession.removeMarker(id)
        })
        this.state.compareMarker.forEach(function(id) {
            compareSession.removeMarker(id)
        })
        let originMarker = []
        let compareMarker = []
        jdd.diffs.forEach(function (item) {
            let line1 = item['path1']['line'] - 1
            let line2 = item['path2']['line'] - 1
            // originEditor.selection.moveCursorToPosition({ row: item['path1']['line'] - 1, column: 0 });
            // originEditor.selection.selectLine();
            originMarker.push(originSession.addMarker(new Range(line1, 0, line1, -1), "changeMarker", "fullLine"))
            compareMarker.push(compareSession.addMarker(new Range(line2, 0, line2, -1), "changeMarker", "fullLine"))
        })
        this.setState({originMarker, originMarker})
        this.setState({compareMarker, compareMarker})
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
                                name="compareJson"
                                ref="originJson"
                                onChange={this.changeJsonStr.bind(this, 'origin')}
                                value={this.state.jsonStrOrigin}
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                        <Col span={2}>
                            <Button type="primary" onClick={this.compareJson}>对比</Button>
                        </Col>
                        <Col span={11}>
                            <AceEditor
                                mode="json"
                                theme="monokai"
                                name="compareJson"
                                ref="compareJson"
                                onChange={this.changeJsonStr.bind(this, 'compare')}
                                value={this.state.jsonStrCompare}
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                    </Row>
                </main>
            </div>
        );
    }
}
