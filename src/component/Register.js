import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import {Icon, Input, Form, Button, message} from "antd";
import { userRegister, getValidCode } from '../fetch';
const { Search } = Input;

class Register extends Component{
    constructor(props) {
        super(props);

        this.state = {
            key: 'register',
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

    registerFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                delete values.password1;
                console.log('Received values of form: ', values);
                userRegister(values).then((res) => {
                    console.log(res);
                    if(res.status === 200) {
                        message.success("登陆成功");
                        this.props.history.push("/login")
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        })
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
            <Form onSubmit={this.registerFormSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                            placeholder="请输入用户名"
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
                    {getFieldDecorator('weixin', {
                        rules: [{ required: true, message: '请输入微信号' }],
                    })(
                        <Input
                            prefix={<Icon type="wechat" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                            type="text"
                            placeholder="请输入微信号"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号' }],
                    })(
                        <Search
                            prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16, padding: 0 }} />}
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
                    {getFieldDecorator('activationCode')(
                        <Input
                            prefix={<Icon type="barcode" style={{ color: 'rgba(0,0,0,.25)', fontSize: 16 }} />}
                            type="text"
                            placeholder="输入邀请码（选填）"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'login' })(withRouter(Register));
