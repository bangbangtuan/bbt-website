import React, { Component } from 'react';
import {Row, Col, Descriptions, Layout, Icon, Modal, Radio, message} from 'antd';
import './Project.css';
import '../Team/Team.css';
import { Link } from 'react-router-dom'
import storage from "../storage";
import yangshu from "../../images/yangshu.png"
const { Sider, Content } = Layout;

class Project extends Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            visible: false,
            visible2: false,
            radioValue:'',
            flag: false
        }
    }

    componentDidMount() {
        this.getProjects();
        this.getStacks();
    }

    getProjects = () => {
        fetch('https://api.bangneedu.com/project?current' + this.state.current +'&size=10', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res);
                for(let i = 0; i < res.data.records.length; i++) {
                    fetch('https://api.bangneedu.com/projectTeam/' + res.data.records[i].id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }})
                        .then((result) => result.json())
                        .then( result => {
                            console.log(result)
                            res.data.records[i].teamMembers = result.data
                            this.setState({
                                flag: true
                            })
                        })
                        .catch( err => console.log(err))
                }
                this.setState({
                    projects: res.data.records,
                    pages: parseInt(res.data.pages)
                });
                console.log(this.state.projects)
            })
            .catch( err => console.log(err))
    };

    getStacks = () => {
        let token = storage.get('token');
        fetch('https://api.bangneedu.com/classify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token ? "Bearer " + token : ''
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res.data[0].childList);
                this.setState({
                    frontend: res.data[0].childList[1].childList,
                    backend: res.data[0].childList[0].childList
                });
            })
            .catch( err => console.log(err))
    };

    handleChangeStack = (e) => {
        console.log(e.target.value);
        this.setState({
            radioValue:e.target.value
        })
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel2 = e => {
        console.log(e);
        this.setState({
            visible2: false,
        });
    };

    formSubmit = (id) => {
        console.log(this.state.radioValue)
        let body = {
            "projectId" : id,
            "technology": this.state.radioValue
        };
        let token = storage.get('token');
        if(!token) {
            message.error("请登陆后再提交", 2);
            this.props.history.push("/login")
        }
        if(this.state.radioValue) {
            fetch('https://api.bangneedu.com/projectTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)})
                .then((res) => res.json())
                .then(res => {
                    console.log(res);
                    if(res.status === 200) {
                        message.success(res.msg);
                        this.setState({
                            visible: false,
                            visible2: true
                        });
                    } else {
                        message.error(res.msg);
                    }
                })
                .catch( err => console.log(err))
        } else {
            message.error("请选择技术栈")
        }
    };

    render() {
        const{radioValue}=this.state;
        return(
        <div>
            <Row>
                <Col md={4} />
                <Col md={16}>
                    <div className='con-header'>实战演练</div>
                    <div>
                        {
                            this.state.flag && this.state.projects && this.state.projects.map((item, index) => {
                                return <div key={index} className='relative-box'>
                                    <div style={{marginBottom: 20}}>
                                        <Layout style={{ background: '#fff' }}>
                                            <Sider width={200} height={200}  className="project-img-con">
                                                <img className='pro-image' src={item.image} alt='' />
                                            </Sider>
                                            <Layout style={{ background: '#fff' }}>
                                                <Content style={{ padding: '20px 20px 0', margin: 0}}>
                                                    <Descriptions title={item.name} column={1}>
                                                        <Descriptions.Item label="技术栈">{item.technology}</Descriptions.Item>
                                                        <Descriptions.Item label="项目介绍">{item.details}</Descriptions.Item>
                                                        <Descriptions.Item label="组队">
                                                            <div className='project-team-members'>
                                                                {
                                                                    item.teamMembers?item.teamMembers.map((member, index) => {
                                                                        return <div key={index} className='team-members'>
                                                                            <img src={member.headPortrait} alt={member.name} />
                                                                        </div>
                                                                    }):null
                                                                }
                                                                <div><Icon type="plus-circle" className='add-team' style={{ fontSize: 34, color: '#999'}} onClick={this.showModal} /></div>
                                                            </div>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Content>
                                                <div style={{float: 'right', marginBottom: 10}}>
                                                    <Link to={'/project/' + item.id} className='btn-detail-1'>查看详情</Link>
                                                </div>
                                            </Layout>
                                        </Layout>
                                    </div>
                                    <Modal
                                        title="组队信息"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        footer={
                                            []
                                        }
                                        className='add-team-con'
                                    >
                                        <div>
                                            <div>技术点</div>
                                            <div className='stack-container'>
                                                <Radio.Group onChange={this.handleChangeStack} >
                                                    <div className='stack-row'>
                                                        <Radio.Button value="frontend" className={radioValue ==='frontend' ? 'radioActive':''}><span className='head'>前端</span></Radio.Button>
                                                        {
                                                            this.state.frontend && this.state.frontend.map((item, index) => {
                                                                return <Radio.Button key={index} value={item.name} className={radioValue ===item.name ? 'radioActive':''}><span>{item.name}</span></Radio.Button>
                                                            })
                                                        }
                                                    </div>
                                                    <div className='stack-row'>
                                                        <Radio.Button value="backend" className={radioValue ==='backend' ? 'radioActive':''}><span className='head'>后端</span></Radio.Button>
                                                        {
                                                            this.state.backend && this.state.backend.map((item, index) => {
                                                                return <Radio.Button key={index} value={item.name} className={radioValue ===item.name ? 'radioActive':''}><span>{item.name}</span></Radio.Button>
                                                            })
                                                        }
                                                    </div>
                                                </Radio.Group>
                                            </div>
                                            <div>项目经验</div>
                                            <textarea name='experience' placeholder='请详细的介绍自己的成功经验吧～' className='team-textarea'/>
                                        </div>
                                        <button className='submit-btn' onClick={() => this.formSubmit(item.id)}> 提交 </button>
                                    </Modal>
                                </div>
                            })
                        }
                    </div>
                    <Modal
                        visible={this.state.visible2}
                        onCancel={this.handleCancel2}
                        footer={
                            []
                        }
                        className='success-modal'
                    >
                        <div className='success-box'>
                            <div>
                                <Icon type="check-circle" style={{fontSize: 33, marginRight: 10, color: '#ff6e37'}} />
                                <span style={{fontSize: 28, verticalAlign: 'middle'}}>提交成功</span>
                            </div>
                            <div style={{fontSize: 26, marginTop: 20}}>请扫描二维码添加微信进群</div>
                            <div style={{color: '#ff6e37'}}>（添加微信时请备注xx项目组队）</div>
                            <div className='success-box-img'>
                                <img src={yangshu} alt='yangshu'/>
                            </div>
                        </div>
                    </Modal>
                </Col>
                <Col md={4} />
            </Row>
        </div>)
    }
}

export default Project;


