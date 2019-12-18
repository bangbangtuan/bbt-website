import React, { Component } from 'react';
import { Row, Col, Upload, Icon, message, Input, Form, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import storage from "../storage";
import './UserProfile.css';
import { getUserInfo, changeUserInfo } from '../../fetch'
const { TextArea } = Input;

class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: storage.get('token'),
            imgLoading: false,
            userInfo: ''
        }
    }

    componentWillMount() {
        console.log(this.props.match.params.id);
        this.getUserInfo();
    };

    getUserInfo = () => {
        getUserInfo().then((res) => {
            console.log(res)
            this.setState({
                userInfo: res,
            });
        })
    };

    handleChange = (info, record) => {
        if (info.file.status === 'uploading') {
            this.setState({ imgLoading: true });
            return;
        }
        if (info.file.status !== 'uploading') {
            console.log(info.file.response.data);
            console.log(record)
        }
        if (info.file.status === 'done') {
            const data = {
                "id": record.id,
                "headPortrait": info.file.response.data
            };
            changeUserInfo(data).then((res) => {
                console.log(res)
                this.setState({
                    imgLoading: false,
                });
                this.getUserInfo();
                message.success("修改成功", 1);
            })
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.state.userInfo.id;
                console.log('Received values of form: ', values);
                changeUserInfo(values).then((res) => {
                    console.log(res)
                    this.getUserInfo();
                    message.success("修改成功", 1);
                })
            }
        })
    };

    render() {
        let userInfo = this.state.userInfo;
        const uploadButton = (
            <div>
                <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                md: { span: 6},
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                md: { span: 15},
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Row>
                <Col md={4} />
                <Col md={16}>
                    {
                        userInfo && <div className='user-profile-container'>
                            <div className='headPortrait'>
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://api.bangneedu.com/upload"
                                    headers={
                                        {"Authorization": "Bearer " + storage.get('token')}
                                    }
                                    onChange={(value)=>{this.handleChange(value,userInfo)}}
                                >
                                    {userInfo.headPortrait ? <img src={userInfo.headPortrait} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </div>
                            <Form onSubmit={this.handleSubmit} {...formItemLayout}>
                                <Form.Item label="用户名 ">
                                    {getFieldDecorator('username', {
                                        initialValue: this.state.userInfo.username
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                                <Form.Item label="昵称 ">
                                    {getFieldDecorator('name', {
                                        initialValue: this.state.userInfo.name
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                                <Form.Item label="微信号 ">
                                    {getFieldDecorator('weixin', {
                                        initialValue: this.state.userInfo.weixin
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label="手机号 ">
                                    {getFieldDecorator('phone', {
                                        initialValue: this.state.userInfo.phone
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label="个人简介 ">
                                    {getFieldDecorator('description', {
                                        initialValue: this.state.userInfo.description
                                    })(
                                        <TextArea rows={3} />
                                    )}
                                </Form.Item>
                                <Form.Item className="sub-button">
                                    <Button type="primary" htmlType="submit">提交</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    }
                </Col>
                <Col md={4} />
            </Row>
        )
    }
}

export default Form.create({ name: 'login' })(withRouter(UserProfile));
