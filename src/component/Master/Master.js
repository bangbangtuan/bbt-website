import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Icon, Modal, List, message } from "antd";
import { AirPlane, BusinessMan, Student } from "./svgIcon";
import "./Master.css";
import { getMasterAndApprentice, getNewMessage, getMasterPayOrder, acceptApprentice,getPostList } from "../../fetch";

class Master extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apprentice:0,
            masterWorker:0,
            timer:null,
            visible: false,
            orderFormStatus: 1,
            payAccount:0,
            newMessageAccount:'',
            post:0,
            newMessage:''
        }
    }

    componentDidMount() {
        this.getNewMessagePush();
        this.getMasterAndApprentice();
        this.getMasterPayOrder();
        this.getPostList();
        this.setState({
            timer:setInterval(this.getNewMessagePush, 15000)})
    }

    componentWillUnmount(){
        if(this.state.timer!= null) {
            clearInterval(this.state.timer);
        }
    }
    getNewMessagePush = () => {        
        getNewMessage().then((res) => {
            var newMessage = [];
            if(res.data){
                res.data.forEach((currentValue) => {
                    if(currentValue.type === '2'){
                        newMessage.push(currentValue)
                    }
                }, this)
                this.setState({
                    newMessage: newMessage
                })
            }
        })
    };
    getMasterAndApprentice = () => {
        getMasterAndApprentice().then((res) => {
            if(res.data){
              this.setState({
                apprentice: res.data.apprentice,
                masterWorker: res.data.masterWorker
              })
            }
        })
    };
  acceptApprentice = (id) =>{
    const body={};
    body['id'] = id;
    acceptApprentice(body).then((res) => {
        if(res.data.msg==='修改成功'){
            const data = parseInt(this.state.newMessageAccount) -1;
            this.setState({
                visible: false,
                newMessageAccount:data,
            });
            this.getNewMessagePush();
            this.getMasterAndApprentice();
        }
        else{
            message.error(res.data.msg);
        }
    })
  }
  getMasterPayOrder = () => {
      getMasterPayOrder(this.state.orderFormStatus).then((res) => {
        if(res.data){
            this.setState({
                payAccount: res.data.length,
            })
        }
      })
  }
  getPostList = () => {
      getPostList().then((res) => {
          if(res.data){
              this.setState({
                  post:1
              })
          }
      })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    document.body.style.backgroundColor = "#f8fbfd";
    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          <div className="con-header">师徒计划
            <div onClick={this.showModal} style={{height:"100%", lineHeight:"100%", float:"right"}}>拜师信息<Icon type="notification" />{this.state.newMessageAccount}</div>
          
        <Modal
          title="新消息"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          bodyStyle={{backgroundColor:'#f5f5f5'}}
        >
         <List
            grid={{column: 1 }}
            dataSource={this.state.newMessage}
            renderItem={item => (
                <List.Item>
                    <div style={{fontSize:'8px',backgroundColor:'#ddd', margin:'0 180px 8px 180px', textAlign:'center', border:'#ddd 1px solid', borderRadius:'30px'}}>{item.createTime}</div>
                    <Card title={item.message} bodyStyle={{fontSize:'14px', lineHeight:'8px',}}>
                        <button onClick={this.acceptApprentice.bind(this,item.orderFormId)} style={{float:'left',border:'none', background:'none', color:'#007acc'}}>接受</button>
                        <div style={{float:'left', fontSize:'10px'}}>(超过24小时视作拒绝)</div>
                    </Card>
                </List.Item>
            )}
        ></List>
        </Modal>
        </div>
          
          <div className="MasterProfileContext">
              <Card
                  title="成为师傅"
                  bordered={false}
                  headStyle={{ border: "none"}}
              >
                  <div style={{minWidth:"320px" }}>
                      <Link to={"/masterPostList"}>
                          <div className="postInfo">
                              <div className="infoIcon">
                                  <AirPlane />
                              </div>
                              <p className="infoTitle">我发布的</p>
                              <p className="infoNumber">{this.state.post}</p>
                          </div>
                      </Link>
                      <Link to={"/apprenticeList"}>
                          <div className="apprenticeInfo">
                              <div className="infoIcon">
                                  <BusinessMan />
                              </div>
                              <p className="infoTitle">我收徒的</p>
                              <p className="infoNumber">{this.state.apprentice}</p>
                          </div>
                      </Link>
                  </div>
              </Card>
              <Card
                  title="成为徒弟"
                  bordered={false}
                  headStyle={{ border: "none"}}
              >
                  <div style={{  minWidth:"200px" }}>
                      <Link to={"/masterList"}>
                          <div className="masterInfo">
                              <div className="infoIcon">
                                  <Student />
                              </div>
                              <p className="infoTitle">我拜师的</p>
                              <p className="infoNumber">{this.state.masterWorker}</p>
                          </div>
                      </Link>
                  </div>
              </Card>
              <Card
                  title="待支付的"
                  bordered={false}
                  headStyle={{ border: "none"}}
              >
                  <div style={{  minWidth:"200px" }}>
                      <Link to={"/masterPayList"}>
                          <div className="masterInfo">
                              <div className="infoIcon">
                                  <Student />
                              </div>
                              <p className="infoTitle">待支付的</p>
                              <p className="infoNumber">{this.state.payAccount}</p>
                          </div>
                      </Link>
                  </div>
              </Card>
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default Master;
