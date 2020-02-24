import React, { Component } from "react";
import {
  List,
  Card,
  Descriptions,
  Breadcrumb,
  Row,
  Col,
  Layout,
  Divider
} from "antd";
import "./Master.css";
import { Link, withRouter } from "react-router-dom";
import { getMasterList } from "../../fetch";
const { Sider, Content } = Layout;

class RecommendMasterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data:[]
    };
  }
  componentDidMount() {
    this.getMasterList(10, 1);
  }
  getMasterList = (size, current) => {
    getMasterList(size, current).then(res=>{
      if(res.data){
        this.setState({
          data:res.data.records
        })
      }
      console.log(res.data)
    })
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  checkOrderSatus = (type, id) => {
    console.log('付款type',type)
    if(type === '1'){
      return <Link to={'/masterPay/'+id}>付款</Link>
    }
  }
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
            <Breadcrumb.Item>师徒计划师傅列表</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={this.state.data}
              renderItem={item => (
                <List.Item>
                  <Card
                    style={{ background: "#fff", border: "none" }}
                    onClick={this.showModal}
                  >
                    <Layout
                      style={{
                        background: "#fff",
                        padding: "0px 10px",
                        margin: "0"
                      }}
                    >
                      <Sider
                        theme="light"
                        width="120px"
                        style={{ height: "120px" }}
                      >
                        <img
                          className="master-image"
                          src={item.image}
                          alt="师傅带徒"
                        />
                      </Sider>
                      <Layout style={{ backgroundColor: "#fff" }}>
                        <Content style={{ paddingLeft: "10px", margin: 0 }}>
                          <Descriptions title={item.projectTaskName} column={1}>
                            <Descriptions.Item label="周期">
                                <p style={{ color: "blue", display: "inline" }}>{item.cycle}</p>天
                            </Descriptions.Item>
                            <Descriptions.Item label="定价">
                                <p style={{ color: "red", display: "inline" }}>￥{item.price}</p>
                            </Descriptions.Item>
                          </Descriptions>
                        </Content>
                      </Layout>
                    </Layout>
                    <Divider />
                    <div style={{ margin: "0 auto" }}>
                      <div
                        style={{
                          float: "right",
                          width: "180px",
                          textAlign: "center"
                        }}
                      >
                        <div
                          style={{
                            float: "right",
                            border: "1px solid #ddd",
                            width: "80px"
                          }}>
                          <Link to={"/masterDetail/"+item.id}>查看详情</Link>
                        </div>
                        
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default withRouter(RecommendMasterList)
