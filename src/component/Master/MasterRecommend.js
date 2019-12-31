import React, { Component } from "react";
import { Divider, List, Card, Descriptions} from "antd";
import "./Master.css";
import { getMasterList } from "../../fetch";
import { Link } from "react-router-dom";

export default class MasterRecommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data:[]
    };
  }

  componentDidMount() {
    this.getMasterList(3, 1);
  }

  getMasterList = (size, current) => {
    getMasterList(size, current).then(res=>{
      if(true){
        this.setState({
        data:res.records
      })
      }
    })
  }

  showModal = () => {
    return null
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

  render() {
    return (
      <div>
        <Divider />
        <p>看下我给你的推荐吧</p><Link to="/recommendMasterList">查看更多</Link>      
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item>
              <Link to={"/masterDetail/"+item.id}>
              <Card
                style={{ background: "#eee", borderRadius: "5px" }}
              >
                <Descriptions title={item.name} column={1}>
                  <Descriptions.Item label="周期">
                    <p style={{ color: "blue", display: "inline" }}>{item.cycle}</p>天
                  </Descriptions.Item>
                  <Descriptions.Item label="定价">
                    <p style={{ color: "red", display: "inline" }}>￥{item.price}</p>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              </Link>
            </List.Item>
          )}
        />
        
      </div>
    );
  }
}
