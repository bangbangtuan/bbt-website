import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Icon } from "antd";
import { AirPlane, BusinessMan, Student } from "./svgIcon";
import storage from "../storage";
import "./Master.css";

class Master extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getApprentices();
    this.getMasters();
    this.getPosts();
  }

  getApprentices = () => {
    let token = storage.get("token");
    fetch()
      .then(res => res.json())
      .then(res => {})
      .catch(err => console.log(err));
  };
  getMasters = () => {
    let token = storage.get("token");
    fetch()
      .then(res => res.json())
      .then(res => {})
      .catch(err => console.log(err));
  };
  getPosts = () => {
    let token = storage.get("token");
    fetch()
      .then(res => res.json())
      .then(res => {})
      .catch(err => console.log(err));
  };
  render() {
    document.body.style.backgroundColor = "#f8fbfd";
    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          <div className="con-header">师徒计划</div>
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
                              <p className="infoNumber">5</p>
                          </div>
                      </Link>
                      <Link to={"/apprenticeList"}>
                          <div className="apprenticeInfo">
                              <div className="infoIcon">
                                  <BusinessMan />
                              </div>
                              <p className="infoTitle">我收徒的</p>
                              <p className="infoNumber">5</p>
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
                              <p className="infoNumber">5</p>
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
