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
            originAnnotation: [],
            compareAnnotation: [],
            jsonStrOrigin: '{"Aidan Gillen": {"array": ["Game of Thron\\"es","The Wire"],"string": "some string","int": 2,"aboolean": true, "boolean": true,"object": {"foo": "bar","object1": {"new prop1": "new prop value"},"object2": {"new prop1": "new prop value"},"object3": {"new prop1": "new prop value"},"object4": {"new prop1": "new prop value"}}},"Amy Ryan": {"one": "In Treatment","two": "The Wire"},"Annie Fitzgerald": ["Big Love","True Blood"],"Anwan Glover": ["Treme","The Wire"],"Alexander Skarsgard": ["Generation Kill","True Blood"], "Clarke Peters": null}',
            jsonStrCompare: `
           {"Aidan Gillen": {"array": ["Game of Thrones","The Wire"],"string": "some string","int": "2","otherint": 4, "aboolean": "true", "boolean": false,"object": {"foo": "bar"}},"Amy Ryan": ["In Treatment","The Wire"],"Annie Fitzgerald": ["True Blood","Big Love","The Sopranos","Oz"],"Anwan Glover": ["Treme","The Wire"],"Alexander Skarsg?rd": ["Generation Kill","True Blood"],"Alice Farmer": ["The Corner","Oz","The Wire"]}`,
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
            return
        }
        try {
            parseJsonCompare = jsonlint.parse(this.state.jsonStrCompare)
        } catch (e) {
            Modal.info({
                title: "提示",
                content: "对比JSON格式不正确，异常如下：" + e
            })
            return
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
        let originAnnotation = []
        let compareAnnotation = []
        console.log(jdd.diffs)
        jdd.diffs.forEach(function (item) {
            let line1 = item['path1']['line'] - 1
            let line2 = item['path2']['line'] - 1
            let markerType = ''
            let annotationText = item['msg']
            switch(item['type']){
                case 'type':
                    markerType = 'changeMarker-type'
                    break;
                case 'eq':
                    markerType = 'changeMarker-unequal'
                    break;
                case 'missing':
                    markerType = 'changeMarker-missing'
                    break;
                default:
                    break;
            }
            originAnnotation.push({row: line1, column: 0, type: 'warning', text: annotationText})
            compareAnnotation.push({row: line2, column: 0, type: 'warning', text: annotationText})
            if(markerType){
                originMarker.push(originSession.addMarker(new Range(line1, 0, line1, -1), markerType, "fullLine"))
                compareMarker.push(compareSession.addMarker(new Range(line2, 0, line2, -1), markerType, "fullLine"))
            }
        })
        this.setState({originMarker, originMarker})
        this.setState({compareMarker, compareMarker})
        this.setState({originAnnotation, originAnnotation})
        this.setState({compareAnnotation, compareAnnotation})
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
                                width="100%"
                                ref="originJson"
                                annotations={this.state.originAnnotation}
                                onChange={this.changeJsonStr.bind(this, 'origin')}
                                value={this.state.jsonStrOrigin}
                                editorProps={{ $blockScrolling: true, $useWorker: false }}
                            />
                        </Col>
                        <Col span={2} className={"align-center"}>
                            <Button type="primary" onClick={this.compareJson}>对比</Button>
                        </Col>
                        <Col span={11}>
                            <AceEditor
                                mode="json"
                                theme="monokai"
                                name="compareJson"
                                width="100%"
                                ref="compareJson"
                                annotations={this.state.compareAnnotation}
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
