import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Icon } from "antd";
import { AirPlane, BusinessMan, Student } from "./svgIcon";
import "./Master.css";
import { getMasterAndApprentice, getNewMessage } from "../../fetch";

class Master extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apprentice:0,
            masterWorker:0,
            post:1,
            timer:null,
            newMessage:''
        }
    }

    componentDidMount() {
        this.getNewMessagePush();
        this.getMasterAndApprentice();
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
            console.log('new', this.state.newMessage)
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
  render() {
    document.body.style.backgroundColor = "#f8fbfd";
    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          <div className="con-header">师徒计划
            <div style={{height:"100%", lineHeight:"100%", float:"right"}}><Icon type="notification" /></div>
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
          </div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default Master;
