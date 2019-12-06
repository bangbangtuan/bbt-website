import React, { Component } from 'react';
import { Row, Col, Breadcrumb, Layout, Button, message } from 'antd';
import './Project.css';
import { withRouter} from 'react-router-dom';
import storage from "../storage";
import MasterRecommend from "../Master/MasterRecommend"
const { Content } = Layout;

class ProjectTasks extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            task:'',
        }
    }

    componentDidMount() {
        console.log(this.props.match.params.id);
        this.getTaskDetails();
    }

    getTaskDetails = () => {
        fetch('https://api.bangneedu.com/projectTask/task?id=' + this.props.match.params.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res)
                this.setState({
                    task: res.data,
                });                
            })
            .catch( err => console.log(err))
    };

    receiveTask = () => {
        const body = {
            "projectTaskId": this.state.task.id
        };
        fetch('https://api.bangneedu.com/projectTaskUser', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + storage.get('token')
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res)
                if(res.status === 200 && res.data === true) {
                    message.success('任务领取成功，请到个人中心查看');
                } else {
                    message.error(res.msg);
                }
            })
            .catch( err => console.log(err))
    };
    render() {
        const detail = {
            margin: '30px 0',
            color: '#999999'
        };
        return(
            <div>
                <Row>
                    <Col md={4}></Col>
                    <Col md={16}>
                        {
                            this.state.task &&
                            <div>
                                <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 16, marginTop: 30, marginBottom: 30}}>
                                    <Breadcrumb.Item>
                                        <a href="/projects">实战演练</a>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <a href={"/project/" + this.state.task.projectId}>项目详情</a>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>任务详情</Breadcrumb.Item>
                                </Breadcrumb>

                                <div className='relative-box'>
                                    <Content style={{background: '#fff', padding: 20, marginTop: 10}} className='border-shadow'>
                                        <div className='task-card'>
                                            任务<span>{this.state.task.title}</span>： {this.state.task.name}
                                        </div>
                                        <div style={detail}>
                                            任务详情： {this.state.task.details}
                                        </div>
                                        <p align="right"><Button type='primary' shape='round' onClick={this.receiveTask}>领取任务</Button></p>
                                    </Content>
                                    <MasterRecommend {...this.props}/>
                                </div>
                            </div>
                        }
                    </Col>
                    <Col md={4}></Col>
                </Row>
            </div>)
    }
}

export default withRouter(ProjectTasks);


