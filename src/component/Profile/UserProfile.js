import React, { Component } from 'react';
import { Row, Col, Upload, Icon, message, Input, Form, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import storage from "../storage";
import './UserProfile.css';
import { getOtherUserInfo, getUserInfo } from '../../fetch'

const { TextArea } = Input;

class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: storage.get('token'),
            imgLoading: false,
            userInfo: '',
            isMyProfile: false
        }
    }

    componentWillMount() {
        this.getUserInfo();
        this.getOtherUserInfo();

    };

    getOtherUserInfo = () => {
        getOtherUserInfo(this.props.match.params.id)
          .then( res => {
              console.log('getOtherUserInfo then');
              this.setState({
                  userInfo: res.data,
              }, () => {
                console.log('getOtherUserInfo： ', '回调')
              });
          }).then((res) => {
            this.isMyProfile()
          })
          .catch( err => console.log(err));
    };



    getUserInfo = () => {
      getUserInfo()
      .then((res) => {
        console.log('getUserInfo then')
        this.setState({
          loginUserInfo: res.data
        }, () => {
          console.log('getUserInfo ', '回调')
        })
      })
      .catch(err => console.log(err))
    }


    handleChange = (info, record) => {
        if (info.file.status === 'uploading') {
            this.setState({ imgLoading: true });
            return;
        }
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            const data = {
                "id": record.id,
                "headPortrait": info.file.response.data
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
                values.id = this.state.userInfo.id;
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
                        this.getUserInfo();
                        message.success("修改成功", 1);
                    })
                    .catch( err => console.log(err));
            }
        })
    };


    isMyProfile () {
      console.log('this.props.match.params.id: ', this.props.match.params.id)
      console.log(' this.state.loginUserInfo: ',  this.state.loginUserInfo.id)
      if (this.props.match.params.id === this.state.loginUserInfo.id ) {
        this.setState({
          isMyProfile: true
        })
      } else {
        this.setState({
          isMyProfile: false
        })
      }
    }

    render() {
        let userInfo = this.state.userInfo;
        console.log('render')
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
                                    disabled={!this.state.isMyProfile}
                                >
                                    {userInfo.headPortrait ? <img src={userInfo.headPortrait} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </div>
                            <Form onSubmit={this.handleSubmit} {...formItemLayout}>
                                <Form.Item label="用户名 ">
                                    {getFieldDecorator('username', {
                                        initialValue: this.state.userInfo.username
                                    })(
                                        <Input disabled={!this.state.isMyProfile} />,
                                    )}
                                </Form.Item>
                                <Form.Item label="昵称 ">
                                    {getFieldDecorator('name', {
                                        initialValue: this.state.userInfo.name
                                    })(
                                        <Input disabled={!this.state.isMyProfile} />,
                                    )}
                                </Form.Item>
                                <Form.Item label="微信号 ">
                                    {getFieldDecorator('weixin', {
                                        initialValue: this.state.userInfo.weixin
                                    })(
                                        <Input disabled={!this.state.isMyProfile}/>
                                    )}
                                </Form.Item>
                                <Form.Item label="手机号 ">
                                    {getFieldDecorator('phone', {
                                        initialValue: this.state.userInfo.phone
                                    })(
                                        <Input disabled={!this.state.isMyProfile} />
                                    )}
                                </Form.Item>
                                <Form.Item label="个人简介 ">
                                    {getFieldDecorator('description', {
                                        initialValue: this.state.userInfo.description
                                    })(
                                        <TextArea rows={3}  disabled={!this.state.isMyProfile}/>
                                    )}
                                </Form.Item>
                                {
                                  this.state.isMyProfile? (
                                    <Form.Item className="sub-button">
                                        <Button type="primary" htmlType="submit" disabled={!this.state.isMyProfile}>提交</Button>
                                    </Form.Item>
                                  ):(
                                    <div></div>
                                  )
                                }
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
