import React, { Component } from "react";
import {
  List,
  Card,
  Descriptions,
  Breadcrumb,
  Row,
  Col,
  Layout,
  Divider, Modal
} from "antd";
import "./Master.css";
import { Link, withRouter } from "react-router-dom";
import { getMasterPayOrder,getMasterDetail, getProjectTaskDetail, cancelOrder, closeOrder, getMasterOrder} from "../../fetch";
const { Sider, Content } = Layout;

class MasterPayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: 2,
      data: '',
      projectDetail:'',
      orderFormStatus:1,
    }; 
  }
  componentDidMount() {
    this.getMasterPayOrder(this.state.orderFormStatus);
  }
  getMasterPayOrder = orderFormStatus => {
    getMasterPayOrder(orderFormStatus).then(res => {
      if (res.data) {
       res.data.forEach(function(item){
          getMasterDetail(item.commodityId).then(master =>{           
            if(master){
              getProjectTaskDetail(master.data.projectTaskId).then(projectTask =>{
              item['projectDetail'] = projectTask.data.details;
            })
            }
          })
        })
        this.setState({
          data:res.data
        })
        console.log('res',this.state.data)
      }
    });
  };

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
  success(data) {
    Modal.success({
      content: data,
    });
  }
  checkOrderSatus = (type, id) => {
    console.log('付款type',type)
    if(type === '1'){
      return <Link to={'/masterPay/'+id}>付款</Link>
    }
  }
    cancelOrder = (price, transactionId, id) => {
    getMasterOrder(id).then(res => {
        closeOrder(res.paymentOrderNo).then(res => {
          console.log(res)
          this.success('取消成功');
        })
    })
    const orderBody = {};
    orderBody['orderFormStatus'] = 6;
    orderBody['id'] = id
    cancelOrder(orderBody).then(res => {
    })
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
            <Breadcrumb.Item>
              <a href="/master">师徒计划</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>待支付的</Breadcrumb.Item>
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
                          src={item.commodityImage}
                          alt="师傅带徒"
                        />
                      </Sider>
                      <Layout style={{ backgroundColor: "#fff" }}>
                        <Content style={{ paddingLeft: "10px", margin: 0 }}>
                          <Descriptions title={item.commodityName} column={1}>
                            <Descriptions.Item>
                              <p
                                style={{
                                  color: "#FFD700",
                                  display: "inline",
                                  fontSize: "24px"
                                }}
                              >
                                ￥{item.commodityPrice}
                              </p>
                            </Descriptions.Item>
                            <Descriptions.Item>
                              <p
                                style={{ display: "inline", fontSize: "14px" }}
                              >
                                {item.orderFormStatus==='1'?'等待付款'
                                :item.orderFormStatus==='2'?'拜师成功'
                                :item.orderFormStatus==='3'?'等待师傅收徒':'拜师失败'}
                              </p>
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
                            border: "1px solid #000",
                            width: "80px"
                          }}>
                          <Link to={{pathname: '/masterPay/'+item.id, state:item}}>付款</Link>
                        </div>
                        {item.orderFormStatus==='1'?
                          <div
                          style={{
                            float: "left",
                            border: "1px solid #000",
                            width: "80px", height:'23px'
                          }}>
                          <button onClick={this.cancelOrder.bind(this, item.commodityPrice, item.transactionId, item.id)} style={{border:'none', background:'none', height:'23px', width:'80px'}}>
                          取消拜师</button></div>
                          :''}
                        
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

export default withRouter(MasterPayList)
