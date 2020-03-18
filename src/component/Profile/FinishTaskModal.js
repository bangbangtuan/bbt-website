/**
 * Created by peng on 2019/8/6.
 */
import React, { Component } from 'react';
import {Button, Modal, Layout, PageHeader, Form, Input, Divider, message} from 'antd';
import './FinishTaskModal.css';
import storage from "../storage";
import { withRouter, Link } from 'react-router-dom'
const FormItem = Form.Item;
const { Content, Sider } = Layout;
const { TextArea } = Input;

class FinishTaskModal extends Component {
    state = {
        visible: false,
    };
    showModal = () => {
        this.setState({ visible: true });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    submitTask = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (!err) {
                values['projectTaskUserId'] = this.props.id
                console.log('Received values of form: ', values);
                fetch('https://api.bangneedu.com/projectTaskUser', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + storage.get('token')
                    },
                    body: JSON.stringify(values)
                })
                    .then((res) => res.json())
                    .then( res => {
                        console.log(res);
                        if(res.status === 200 && res.data === true) {
                            message.success("提交成功，稍后查看成绩");
                            form.resetFields();
                            this.setState({ visible: false });
                        }
                        this.props.getTasksInfo(storage.get('token'));
                    })
                    .catch( err => console.log(err));
            }

        });
    };
    saveFormRef = (form) => {
        this.form = form;
    };
    render() {
        const SubmitTaskForm = Form.create()(
            (props) => {
                const { visible, onCancel, form } = props;
                const { getFieldDecorator } = form;
                const formItemLayout = {
                    labelCol: {
                        md: { span: 6 },
                        xs: { span: 24 },
                        sm: { span: 8 },
                    },
                    wrapperCol: {
                        md: { span: 16 },
                        xs: { span: 24 },
                        sm: { span: 16 },
                    },
                };
                return (
                    <Modal
                        visible={visible}
                        title={null}
                        footer={null}
                        onCancel={onCancel}
                        wrapClassName={'web'}
                        width={620}
                    >
                        {/*<p>{this.props.id}</p>*/}
                        <Layout className='modal-form'>
                            <Content>
                                <PageHeader title="填写资料" />
                                <Form {...formItemLayout}>
                                    <FormItem label="代码地址">
                                        {getFieldDecorator('codeAddress', {
                                            rules: [{ required: true, message: '请输入项目名称!' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem label="demo地址">
                                        {getFieldDecorator('demoAddress', {
                                            rules: [{required: true}]
                                        })(<TextArea rows={3} />)}
                                    </FormItem>
                                </Form>
                            </Content>
                            <Sider>
                                <div className='side-header'>
                                    <Divider>注意</Divider>
                                </div>
                                <div className='side-content'>提交完作业后可在个人中心查看成绩</div>
                            </Sider>
                        </Layout>
                        <div className='task-button'>
                            <Button type="primary" htmlType="submit" onClick={this.submitTask}>提交作业</Button>
                        </div>
                    </Modal>
                );
            }
        );
        return (
            <div>
                <div class="daka-schedule-wrapper">
                  <Link to={'/clock/' + 'daka'}>
                    <Button type="primary" shape='round' className='finish-btn'>打卡进度</Button>
                  </Link>
                </div>
                <Button type="danger" shape='round' className='finish-btn' onClick={this.showModal}>完成任务</Button>
                <SubmitTaskForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                />
            </div>
        );
    }
}

export default withRouter(FinishTaskModal);
