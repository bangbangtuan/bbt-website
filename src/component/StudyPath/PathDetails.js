import React, { Component } from 'react';
import {List, Col, Row, Descriptions} from 'antd';
import { withRouter} from 'react-router-dom';
import './StudyPath.css';
import { getPathDetail } from '../../fetch'

class PathDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        console.log(this.props.match);
        this.getPathDetail(this.props.match.params.id);
    }

    getPathDetail = (id) => {
        getPathDetail(id).then((res) => {
            console.log(res)
            this.setState({
                pathDetail: res[0],
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
                        this.state.pathDetail && <List className='path-detail'>
                            <List.Item className='detail-title'>
                                {this.state.pathDetail.title}
                            </List.Item>
                            <List.Item>
                                <Descriptions title={
                                    <div>
                                        内容简介
                                        <div style={{float: 'right', fontWeight: 400, fontSize: 14}}>用时
                                            <span className='mainColor'>{this.state.pathDetail.time}</span>
                                        </div>
                                    </div>
                                } column={1}>
                                    <Descriptions.Item>{this.state.pathDetail.details}</Descriptions.Item>
                                </Descriptions>
                            </List.Item>
                        </List>
                    }
                </Col>
                <Col md={5} />
            </Row>
        )
    }
}

export default withRouter(PathDetails);
