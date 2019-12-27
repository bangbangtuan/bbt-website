import React from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Descriptions,
  Layout
} from "antd";
import "./Master.css";
const { Sider, Content } = Layout;

class MasterPayFail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
          <div style={{ background: "#fff", marginTop:"80px"}}>
            <Layout
              style={{
                background: "#fff"
              }}
            >
              <Sider theme="light" width="360px" style={{backgroundColor:"#f64b4c", textAlign:"center"}}>
              <div className="pay">
                <h2 >支付失败</h2>
                <p>￥{this.props.location.state.commodityPrice}</p>
                <div className="seeDetailContent">
                    <Link to={"/masterOrderDetails/"+this.props.location.state.id} className="seeDetail">查看订单详情</Link>
                </div>
                <p className="payNote">本公司不会用任何理由要求您登录银行卡信息或支付额外费用 请谨防钓鱼链接或诈骗电话</p>
              </div>
              </Sider>
              <Layout style={{ backgroundColor: "#fff" }}>
                <div className="payFailReason">
                    <h3>失败原因：</h3><h3>未知</h3>
                    <p>（建议换个付款方式或向银行查询失败原因）</p>
                </div>
                <Content style={{ margin: 0, padding: "10px 40px"}}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="订单编号">{this.props.location.state.id}</Descriptions.Item>
                    <Descriptions.Item label="下单时间">{this.props.location.state.createTime}</Descriptions.Item>
                    <Descriptions.Item label="任务名称">{this.state.master.projectTaskName}</Descriptions.Item>
                    <Descriptions.Item label="师傅昵称">{this.state.master.userName}</Descriptions.Item>
                    <Descriptions.Item label="周期">{this.state.master.cycle}天</Descriptions.Item>
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

export default MasterPayFail;
