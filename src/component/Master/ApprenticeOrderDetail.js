import React, { Component } from "react";
import { Descriptions, Breadcrumb, Row, Col, Layout, Steps } from "antd";
import "./Master.css";
import { withRouter } from "react-router-dom";
import {} from "../../fetch";
const { Sider, Content } = Layout;
const { Step } = Steps;

class ApprenticeOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: 2,
      data: ""
    };
    console.log('state',this.props.location.state)
  }
  componentDidMount() {}
  render() {
    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          <Breadcrumb
            className="con-header"
            style={{
              paddingLeft: 10,
              fontSize: 16,
              marginTop: 30,
              marginBottom: 30
            }}
          >
            <Breadcrumb.Item>
              <a href="/master">师徒计划</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>订单信息</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{"padding":"20px 80px"}}>
            <Steps current={3}>
              <Step title="已拜师"/>
              <Step title="已收款"/>
              <Step title="已收徒"/>
              <Step title="交易成功"/>
            </Steps>
          </div>
          <div>
            <Layout
              style={{
                background: "#fff",
                padding: "0px 10px",
                margin: "0"
              }}
            >
              <Sider theme="light" width="120px" style={{ height: "120px" }}>
                <img className="master-image" src={this.props.location.state.commodityImage} alt="师傅带徒" />
              </Sider>
              <Layout style={{ backgroundColor: "#fff" }}>
                <Content style={{ paddingLeft: "10px", margin: 0 }}>
                  <Descriptions title={this.props.location.state.commodityName} column={1}>
                    <Descriptions.Item>
                      <p
                        style={{
                          color: "#FFD700",
                          display: "inline",
                          fontSize: "24px"
                        }}
                      >
                        ￥{this.props.location.state.commodityPrice}
                      </p>
                    </Descriptions.Item>
                    <Descriptions.Item>
                      <p style={{ display: "inline", fontSize: "14px" }}>
                        {this.props.location.state.orderFormStatus==='1'?'等待付款'
                        :this.props.location.state.orderFormStatus==='2'?'拜师成功'
                        :this.props.location.state.orderFormStatus==='3'?'已收徒'
                        :"拜师已取消"}
                      </p>
                    </Descriptions.Item>
                  </Descriptions>
                </Content>
              </Layout>
            </Layout>
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default withRouter(ApprenticeOrderDetail);
