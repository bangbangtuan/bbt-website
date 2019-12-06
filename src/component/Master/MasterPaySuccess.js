import React from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Descriptions,
  Layout,
  Breadcrumb
} from "antd";
import "./Master.css";
const { Sider, Content } = Layout;

class MasterPaySuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log('this.props',this.props)
  }

  componentDidMount() {
    this.getMasterPay();
  }

  getMasterPay = () => {

  };
  render() {
    document.body.style.backgroundColor = "#f8fbfd";
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
            <Breadcrumb.Item>支付页面</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: "#fff", marginTop:"80px"}}>
            <Layout
              style={{
                background: "#fff"
              }}
            >
              <Sider theme="light" width="360px" style={{backgroundColor:"#8bc34a", textAlign:"center"}}>
              <div className="pay">
                <h2 >支付成功</h2>
                <p>￥10.0</p>
                <div className="seeDetailContent">
                    <Link to={"/MasterDetail/1"} className="seeDetail">查看订单详情</Link>
                </div>
                <p className="payNote">本公司不会用任何理由要求您登录银行卡信息或支付额外费用 请谨防钓鱼链接或诈骗电话</p>
              </div>
              </Sider>
              <Layout style={{ backgroundColor: "#fff" }}>
                <Content style={{ margin: 0, padding: "40px"}}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="订单编号">哈哈哈哈</Descriptions.Item>
                    <Descriptions.Item label="下单时间">哈哈哈</Descriptions.Item>
                    <Descriptions.Item label="任务名称">还好</Descriptions.Item>
                    <Descriptions.Item label="师傅昵称">哈哈哈</Descriptions.Item>
                    <Descriptions.Item label="周期">哈哈哈</Descriptions.Item>
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

export default MasterPaySuccess;
