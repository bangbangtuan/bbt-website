import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Descriptions, Layout, Breadcrumb, Modal } from "antd";
import "./Master.css";
import { withRouter} from 'react-router-dom';
import {getMasterDetail, getProjectTaskDetail, postAddMaster} from '../../fetch'
import storage from "../storage";
const { Sider, Content } = Layout;

class MasterDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      projectDetail:''
    };
  }

  componentDidMount() {
    this.getMasterDetail(this.props.match.params.id);
  }

  getMasterDetail = (id) => {
    getMasterDetail(id).then(res =>{
      this.setState({
        data: res.data
      })      
      getProjectTaskDetail(res.data.projectTaskId).then(projectTask =>{
          this.setState({
            projectDetail: projectTask.data.details
          })
      })
    })
  };
  acceptSuccess(data) {
    Modal.success({
      content: data,
    });
  }
  acceptError(data) {
    Modal.error({
      title: '错误提示',
      content: data,
    });
  }
  addMasterWork = () => {
    const body = {};
    body['commodityName'] = this.state.data.name;
    body['commodityImage'] = this.state.data.image;
    body['commodityNumber'] = 1;
    body['commodityPrice'] = this.state.data.price;
    body['commodityId'] = this.state.data.id;
    body['commoditySpecifications'] = '';
    body['commodityFreight'] = '';
    body['deliveryTime'] = '';
    body['bbtUserAddressId'] = '1198094253084844034';
    body['aggregateScore'] = '';
    body['type'] = 2;
    console.log("log",body);
    if(storage.get('token')){
     postAddMaster(body).then(res => {
      if (res.status === 200 && res.msg === '添加成功') {

        this.acceptSuccess('拜师成功，请到师徒计划中支付');
      }
      else{
        this.acceptError(res.msg);
      }
    })
    }
    else{
      this.acceptError('用户未登录');
    }

  }
  render() {
    document.body.style.backgroundColor = "#f8fbfd";
    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 16, marginTop: 30, marginBottom: 30}}>
               <Breadcrumb.Item>师徒带徒详情</Breadcrumb.Item>
            </Breadcrumb>
          <div>
            <Layout style={{ background: "#fff", padding: "30px" }}>
              <Sider theme="light" style={{ height: "320px" }}>
                <img className="master-image" src={this.state.data.image} alt="师傅带徒" />
              </Sider>
              <Layout style={{ backgroundColor: "#fff" }}>
                <Content style={{ padding: "20px 20px 0", margin: 0 }}>
                  <Descriptions title={this.state.data.name} column={1}>
                    <Descriptions.Item label="师傅昵称">
                      {this.state.data.userName}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务名称">
                      {this.state.data.projectTaskName}
                      <Link to={"/task/"+this.state.data.projectTaskId} style={{ fontSize: "10px" }}>
                        [查看详情]
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="项目介绍">{this.state.projectDetail}</Descriptions.Item>
                    <Descriptions.Item label="周期">
                      <p style={{ color: "#00FF00", display: "inline" }}></p>
                      天
                    </Descriptions.Item>
                    <Descriptions.Item label="价格">
                      <p
                        style={{
                          color: "red",
                          display: "inline",
                          fontSize: "20px",
                          fontWeight: "bold"
                        }}
                      >
                        ￥{this.state.data.price}
                      </p>
                    </Descriptions.Item>
                  </Descriptions>
                </Content>
                <div style={{ padding: "20px" }}>
                  <button className="btnDetail" onClick={this.addMasterWork}>拜师</button>
                </div>
              </Layout>
            </Layout>
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default withRouter(MasterDetail);
