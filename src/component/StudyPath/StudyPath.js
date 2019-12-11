import React, { Component } from 'react';
import {Row, Col, Modal, Button} from 'antd';
import './StudyPath.css';
import PathInfo from "./PathInfo";
import { getStudyPaths } from '../../fetch'
import yangshu from '../../images/yangshu.png';
const { confirm } = Modal;

class StudyPath extends Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            visible: false
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

     showConfirm = () => {
         Modal.info({
             title: '请添加阳叔微信sunyangsheep,既可加入自学团',
             content: (
                 <div className='path-modal'><img src={yangshu} alt='sunyangshee' /></div>
             ),
             onOk() {},
         });
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
                                <div className='path-con'>
                                    <div className='path-header'>
                                        <div>{item.title}</div>
                                        <div>用时： {item.time}</div>
                                    </div>
                                    <Button type="primary" onClick={this.showConfirm}>加入自学团</Button>
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


