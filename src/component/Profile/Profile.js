import React, { Component } from 'react';
import './Profile.css';
import { Row, Col, Descriptions, Breadcrumb,Tabs } from 'antd';
import '../Clock/Clock.css';
import ClockItem from '../Clock/clock-list';
import ArticleItem from '../Articles/article-list';
import storage from '../storage';
import { withRouter } from 'react-router-dom';
import UserTasks from "../Project/userTasks";
import UserOrderList from "../Shop/UserOrderList";
import { getUserClocks, getUserArticles, getUserInfo, getInvitationCode } from '../../fetch'
const { TabPane } = Tabs;

class Profile extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            key: 'home'
        };
    }

    componentWillMount() {
        let token = storage.get('token');
        this.setState({
            token: token
        });
        if (token) {
            getUserInfo().then((res) => {
                console.log(res.data);
                this.setState({
                    userInfo: res.data
                });
            });
            getInvitationCode().then((res) => {
                console.log(res.data);
                this.setState({
                    inviteCode: res.data
                });
            });
            getUserClocks().then((res) => {
                console.log(res.data);
                this.setState({
                    userDaka: res.data.records
                });
            });
            getUserArticles().then((res) => {
                console.log(res.data);
                this.setState({
                    userArticle: res.data.records
                });
            });

            fetch('https://api.bangneedu.com/orderForm/0', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                }})
                .then((res) => res.json())
                .then( res => {
                    console.log(res.data);
                    this.setState({
                        allOrders: res.data
                    });
                })
                .catch( err => console.log(err))
        } else {
            storage.set('token', false);
        }

    }


    handleClick = (id) => {
        this.props.history.push("/userProfile/" + id)
    };

    render() {
        return (
            <div>
                <div className='header'>
                    <Row>
                        <Col md={4}/>
                        <Col md={16}>
                            {
                                (this.state.userInfo && (
                                <div className='head-container'>
                                    <img src={this.state.userInfo.headPortrait} alt='' onClick={() => this.handleClick(this.state.userInfo.id)} style={{cursor: 'pointer'}}/>
                                    <Descriptions title={this.state.userInfo.name} className='user-info' column={1}>
                                        <Descriptions.Item label="微信号 ">{this.state.userInfo.weixin}</Descriptions.Item>
                                        <Descriptions.Item label="个人简介 ">{this.state.userInfo.description ? this.state.userInfo.description : '什么都没有'}</Descriptions.Item>
                                    </Descriptions>
                                </div>
                                ))
                            }
                        </Col>
                        <Col md={4}/>
                    </Row>
                </div>
                <Tabs defaultActiveKey="1" className='profile-tabs'>
                    <TabPane tab="动态" key="1">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                {
                                    (this.state.userDaka &&
                                        <ClockItem dakaList={this.state.userDaka} />)
                                }
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    <TabPane tab="学习日记" key="2">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                {
                                    (this.state.userArticle &&
                                        <ArticleItem articles={this.state.userArticle} />)
                                }
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    <TabPane tab="个人中心" key="3">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 14, marginTop: 30, marginBottom: 30}}>
                                    <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                                    <Breadcrumb.Item>我的任务</Breadcrumb.Item>
                                </Breadcrumb>
                                <UserTasks />
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    <TabPane tab="积分商城" key="4">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 14, marginTop: 30, marginBottom: 30}}>
                                    <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                                    <Breadcrumb.Item>积分商城</Breadcrumb.Item>
                                </Breadcrumb>
                                <Tabs defaultActiveKey="1" className='order-tab'>
                                    <TabPane tab="所有订单" key="1">
                                        <UserOrderList orders={this.state.allOrders} />
                                    </TabPane>
                                    <TabPane tab="待兑换" key="2">
                                        Content of Tab Pane 2
                                    </TabPane>
                                    <TabPane tab="待发货" key="3">
                                        Content of Tab Pane 3
                                    </TabPane>
                                    <TabPane tab="待收货" key="4">
                                        Content of Tab Pane 3
                                    </TabPane>
                                </Tabs>
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    <TabPane tab="我的邀请码" key="5">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                {
                                    this.state.inviteCode && <div className='invite-code'>
                                        <div>我的邀请码: {this.state.inviteCode}</div>
                                        <div>邀请好友注册，既可获赠积分，积分可到积分商城兑换学习课程或精美礼品。</div>
                                    </div>
                                }
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(Profile);
