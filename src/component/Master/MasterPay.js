import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Descriptions, Layout, Breadcrumb, Divider, message } from "antd";
import "./Master.css";
import { getMasterOrder, masterPay, postAddMaster} from "../../fetch";
import QRCode from 'qrcode.react';
import storage from "../storage";
const { Sider, Content } = Layout;

class MasterPay extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      projectDetail:'',
      payURL:'',
      order:{},
      outTradeNo:'',
      body:{
        'commodityName' : this.props.location.state.name,
        'commodityImage' : this.props.location.state.image,
        'commodityNumber' : 1,
        'commodityPrice' : this.props.location.state.price,
        'commodityId' : this.props.location.state.id,
        'commoditySpecifications' : '',
        'commodityFreight' : '',
        'deliveryTime' : '',
        'bbtUserAddressId' : '1198094253084844034',
        'aggregateScore' : '',
        'type' : 2
      }
    }
  }
  componentDidMount(){
    this.getMasterOrder(this.props.match.params.id);
    this.getMasterPay(this.props.location.state);
  }
  componentWillUnmount(){

    this.state.socket.removeEventListener("message", this.paySocket)
    this.state.socket.removeEventListener("open", this.openSocket)
  }
  getMasterOrder = (id) => {
    getMasterOrder(id).then(res => {
      this.setState({
        order: res
      });
    });
  };
  getNowTime() {
        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        this.milliSeconds = date.getMilliseconds();
        var currentTime = this.year+this.month + this.date + this.hour + this.minute + this.second + this.milliSeconds+'';
        return currentTime;
  };
  addMasterWork = () => {
    if(storage.get('token')){
      postAddMaster(this.state.body).then(res => {
      if (res.status === 200 && res.msg === '添加成功') {
        message.success('拜师成功,请到师徒计划中查看');
      }
      else{
        message.error(res.msg);
      }
    })
    }
    else{
      message.error('用户未登录');
    }

  }
  getMasterPay = (data,socket) => {
    const body = {};
    body['outTradeNo'] = data.id+this.getNowTime();
    body['body'] = data.name;
    body['totalFee'] = 0.1*100;//parseInt(data.price)*100;
    body['spbillCreateIp'] = '192.168.1.21';
    body['tradeType'] ='NATIVE';
    this.setState({
      outTradeNo:body['outTradeNo'],
    })
    
    masterPay(body).then(res => {
      if (res.codeUrl) {
        this.setState({
          payURL: res.codeUrl
        }); 
        let socket = new WebSocket("ws://api.bangneedu.com/myHandler/ID="+this.state.outTradeNo);
        let state = {...this.state}
        state['body']['paymentOrderNo'] = this.state.outTradeNo
        this.setState({
          ...state
        })
        socket.addEventListener('open', this.openSocket);
        socket.addEventListener("message", this.paySocket);
        this.setState({
          'socket':socket
        })
        console.log('添加之后',this.state.socket)
      } else {
        message.error(res.msg);
      }
    });
  };
  openSocket(event){
    console.log("Message from server open", event);
    this.send("Hello Server!");
  }
  paySocket = (event) =>{
    console.log("Message from server", event);
    if (event.data.includes("付款成功")) {
      this.addMasterWork();
      this.props.history.push({
      pathname: "/masterPaySuccess",
      state: this.props.location.state
    });
    } else if (event.data.includes("付款失败")) {
      this.props.history.push({
      pathname: "/masterPayFail",
      state: this.props.location.state
      });
    }
  }
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
          <div style={{ background: "#fff", height: "550px" }}>
            <Layout
              style={{
                background: "#fff",
                paddingLeft: "30px",
                paddingTop: "30px"
              }}
            >
              <Sider theme="light" width="230px" style={{ height: "230px" }}>
                <img className="master-image" src={this.props.location.state.image} alt="师傅带徒" />
              </Sider>
              <Layout style={{ backgroundColor: "#fff" }}>
                <Content style={{ margin: 0, paddingLeft: "20px" }}>
                  <Descriptions title="师傅有偿带徒做任务" column={1}>
                    <Descriptions.Item label="师傅昵称">
                      {this.props.location.state.userName}
                    </Descriptions.Item>
                    <Descriptions.Item label="任务名称">
                      {this.props.location.state.projectTaskName}
                      <Link
                        to={"/task/" + this.props.location.state.projectTaskId}
                        style={{ fontSize: "10px" }}
                      >
                        [查看详情]
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="项目介绍">
                      {this.props.location.state.projectDetail}
                    </Descriptions.Item>
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
                        ￥{this.props.location.state.price}
                      </p>
                    </Descriptions.Item>
                  </Descriptions>
                </Content>
              </Layout>
            </Layout>
            <div style={{ padding: "0px 30px" }}>
              <Divider />
            </div>
            <div style={{ padding: "0px 30px" }}>
              <h6>支付方式：</h6>
              <div style={{ textAlign: "center" }}>
                <p>微信扫码，支付{this.props.location.state.price}元</p>
                <QRCode value={this.state.payURL} />
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}
export default withRouter(MasterPay);
