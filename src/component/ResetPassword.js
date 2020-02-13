import React, { Component } from 'react';
import './Login.css';
import {Row, Col, message, Form, Input, Icon, Button, Divider} from 'antd';
import {  withRouter } from 'react-router-dom';
import {  getValidCode, resetPWD } from '../fetch'
const { Search } = Input;

class ResetPassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
            count: 60
        };
    }

    getValidCode = (value) => {
        console.log(value);
        if (value && this.state.count === 60) {
            this.tick();
            getValidCode(value).then((res) => {
                console.log(res);
                if(res.message !== "OK") {
                    message.error(res.message)
                }
            });
        } else if (!this.state.phone) {
            message.error("请填写电话号码")
        }
    };

    tick =  () => {
        let vm = this;
        if (vm.state.count > 0) {
            vm.setState({
                count: vm.state.count - 1
            });
            setTimeout(function () {
                return vm.tick()
            }, 1000)
        } else {
            vm.setState({
                count: 60
            });
        }
    };

    resetFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                delete values.password1;
                console.log('Received values of form: ', values);
                resetPWD(values).then((res) => {
                    console.log(res);
                    if(res.status === 200) {
                        message.success("重置成功", 2);
                        this.props.history.push("/login");
                    } else if(res.status === 500) {
                        message.error(res.msg, 2);
                    } else {
                        message.error("重置失败");
                    }
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let handleConfirmPassword = (rule, value, callback) => {
            console.log(this.props.form.getFieldValue('password'));
            if (value !== this.props.form.getFieldValue('password') ) {
                callback('两次密码不同');
                return;
            }
            callback()
        };
        return (
            <Row>
                <Col md={6} />
                <Col md={12} className='box'>
                    <Col md={4} />
                    <Col md={16}>
                        <div className='reset-form'>
                            <Divider>重置密码</Divider>
                            <Form onSubmit={this.resetFormSubmit}>
                                <Form.Item>
                                    {getFieldDecorator('phone', {
                                        rules: [{ required: true, message: '请输入手机号' }],
                                    })(
                                        <Search
                                            prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                                            placeholder="请输入手机号" onSearch={this.getValidCode} enterButton={this.state.count !== 60 ? this.state.count +' s' : '获取验证码'} />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: '请输入验证码' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="insurance" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                                            type="text"
                                            placeholder="请输入验证码"
                                        />,
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
                                    {getFieldDecorator('password1', {
                                        rules: [
                                            { required: true, message: '请确认密码' },
                                            { validator: handleConfirmPassword }
                                        ],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                                            type="password"
                                            placeholder="请确认密码"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">重置密码</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={6} />
                </Col>
                <Col md={6} />
            </Row>
        )
    }
}

export default Form.create({ name: 'login' })(withRouter(ResetPassword));
