import React, { Component } from "react";
import {
  Button,
  Modal,
  Descriptions,
  Form,
  Input,
  message
} from "antd";
import storage from "../storage";
import { withRouter } from "react-router-dom";
import {getUserInfo} from "../../fetch"
const FormItem = Form.Item;

class FinishTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data:[],
      userId:'',
      projectTaskId: this.props.projectTask.projectTaskId,
      taskName: this.props.projectTask.taskName
    }; 
    console.log('token: ', storage.get("token"));
  }
  componentDidMount(){
    this.getUserInfo();
  }
  getUserInfo = () =>{
    getUserInfo().then(res => {
      this.setState({
        userId: res.data.id
      })
    })
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
        values["projectTaskId"] = this.state.projectTaskId;
        values["name"] = this.state.taskName;
        console.log("Received values of form: ", values);
        fetch("https://api.bangneedu.com/projectMentor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storage.get("token")
          },
          body: JSON.stringify(values)
        })
          .then(res => res.json())
          .then(res => {
            if (res.status === 200 && res.msg === true) {
              message.success("提交成功");
              form.resetFields();
              this.setState({ visible: false });
            }
            else{
              message.error("只能提交一个");
              form.resetFields();
              this.setState({ visible: false });
            }
          })
          .catch(err => console.log(err));
      }
    });
  };
  saveFormRef = form => {
    this.form = form;
  };
  render() {
    const SubmitTaskForm = Form.create()(props => {
      const {form } = props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="成为师傅"
          visible={this.state.visible}
          onOk={this.submitTask}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <div className="masterModal">
            <p>{this.props.projectTask.taskName}</p>
            <div>
              <Descriptions colon={false} column={2} layout="inline">
                <Form layout="inline">
                  <div style={{width:'230px', float:'left', padding:'5px'}}>
                  周期：
                  <FormItem>
                    {getFieldDecorator("cycle", {
                      rules: [{ required: true }]
                    })(
                        <Input placeholder="请输入周期"/>
                    )}
                  </FormItem>
                  </div>
                  <div style={{width:'230px', float:'left', padding:'5px'}}>
                  定价：
                  <FormItem >
                    {getFieldDecorator("price", {
                      rules: [{ required: true }]
                    })(
                        
                        <Input placeholder="请输入价格"/>
                    )}
                  </FormItem>
                  </div>
                </Form>
              </Descriptions>
            </div>
          </div>
        </Modal>
      );
    });
    return (
      <div>
        <Button
          type="danger"
          shape="round"
          className="finish-btn"
          onClick={this.showModal}
        >
          成为师傅
        </Button>
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
