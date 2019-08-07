import React, { Component } from 'react';
import { Row, Col, Upload, Icon, message, Input, Form, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import storage from "../storage";
import './UserProfile.css';
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
        fetch('https://api.bangneedu.com/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.state.token
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res.data);
                this.setState({
                    userInfo: res.data,
                });
            })
            .catch( err => console.log(err));
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
                "image": info.file.response.data
            };
            fetch('https://api.bangneedu.com/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + this.state.token
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then( res => {
                    console.log(res);
                    this.setState({
                        imgLoading: false,
                    });
                    this.getUserInfo();
                    message.success("修改成功", 1);
                })
                .catch( err => console.log(err));
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                fetch('https://api.bangneedu.com/user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + this.state.token
                    },
                    body: JSON.stringify(values)
                })
                    .then((res) => res.json())
                    .then( res => {
                        console.log(res.data);
                        this.getUserInfo();
                        message.success("修改成功", 1);
                    })
                    .catch( err => console.log(err));
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
                        userInfo && <div>
                            <div className='headPortrait'>
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://api.bangneedu.com/upload"
                                    headers={
                                        {'Authorization': 'Bearer ' + localStorage.getItem('token')}
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
