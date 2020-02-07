import React, { Component } from 'react';
import './Login.css';
import { Row, Col, message, Tabs, Form, Input, Icon, Button, Radio } from 'antd';
import storage from './storage';
import {  withRouter } from 'react-router-dom';
import Register from "./Register";
const { TabPane } = Tabs;

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    loginFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            fetch('https://testapi.bangneedu.com/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)})
                .then((res) => res.json())
                .then(res => {
                    console.log(res.data);
                    this.setState({
                        token: res.data
                    });
                    if(res.data) {
                        message.success("登陆成功", 2);
                        storage.set('token',res.data.toString());
                        // localStorage.setItem('token', res.data);
                        this.props.history.push("/profile");
                    } else {
                        message.error("登陆失败");
                    }

                });
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col md={6} />
                <Col md={12} className='box'>
                    <Col md={4} />
                    <Col md={16}>
                        <Tabs defaultActiveKey="1" className='nav-tab'>
                            <TabPane tab="登陆" key="1">
                                <Form onSubmit={this.loginFormSubmit}>
                                    <Form.Item>
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true, message: '请输入用户名或手机号' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                                                placeholder="请输入用户名"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('type', {
                                            rules: [{ required: true, message: '请选择登陆方式' }],
                                        })(
                                            <Radio.Group>
                                                <Radio value="1">账号登陆</Radio>
                                                <Radio value="2">手机号登陆</Radio>
                                            </Radio.Group>,
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                                                type="password"
                                                placeholder="请输入密码"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <a className="login-form-forgot" href="/reset">忘记密码？</a>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">登陆</Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="注册" key="2">
                                <Register />
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col md={6} />
                </Col>
                <Col md={6} />
            </Row>
        )
    }
}

export default Form.create({ name: 'login' })(withRouter(Login));
