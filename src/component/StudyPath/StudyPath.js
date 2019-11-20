import React, { Component } from 'react';
import {Row, Col} from 'antd';
import './StudyPath.css';
import PathInfo from "./PathInfo";
import { getStudyPaths } from '../../fetch'

class StudyPath extends Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 1
        }
    }

    componentWillMount() {
        this.getStudyPaths(this.state.current);
    }

    getStudyPaths = (current) => {
        getStudyPaths(current).then((res) => {
            console.log(res)
            this.setState({
                path: res.records,
            });
        })
    };

    render() {
        return(
            <Row>
                <Col md={5} />
                <Col md={14}>
                    <div className='con-header'>学习路径</div>
                    {
                        this.state.path && this.state.path.map((item, index) => {
                            return <div key={index}>
                                <div className='path-header'>
                                    <div>{item.title}</div>
                                    <div>用时： {item.time}</div>
                                </div>
                                <PathInfo item={item} />
                            </div>
                        })
                    }
                </Col>
                <Col md={5} />
            </Row>
        )
    }
}

export default StudyPath;


