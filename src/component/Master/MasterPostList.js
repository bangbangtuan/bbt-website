import React from "react";
import { Row, Col, Descriptions, Layout, Breadcrumb, List } from "antd";
import "./Master.css";
import { getPostList, getMasterWorkDetail, getProjectTaskDetail, getProjectDetail} from "../../fetch";
const { Sider, Content } = Layout;
class MasterPostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      initLoading: true,
      projectDetail:'',
      projectImage:''
    };
  }

  componentDidMount() {
    this.getPostList();
  }

  getPostList = () => {
    getPostList().then(async (res) => {      
      if (res.data) {
        await getMasterWorkDetail(res.data.id).then( master => {
          res.data['master'] = master.data.userName;
        })
        getProjectTaskDetail(res.data.projectTaskId).then(projectTask =>{
          this.setState({
            projectDetail: projectTask.data.details
          })
          getProjectDetail(projectTask.projectId).then(project =>{
            this.setState({
              projectImage: project.data.image
            })
          })
        })
        this.setState({
          initLoading: false,
          data:[res]
        })
      }
    });
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
            <Breadcrumb.Item>我发布的</Breadcrumb.Item>
          </Breadcrumb>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item>
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <Layout style={{ background: "#fff", padding: "20px 30px" }}>
                    <Sider
                      theme="light"
                      width="210px"
                      style={{ height: "230px" }}
                    >
                      <img
                        className="master-image"
                        src={this.state.projectImage}
                        alt="师傅带徒"
                      />
                    </Sider>
                    <Layout style={{ backgroundColor: "#fff" }}>
                      <Content style={{ paddingLeft: "20px", margin: 0 }}>
                        <Descriptions title={item.name} column={1}>
                          <Descriptions.Item label="师傅昵称">
                            {item.master}
                          </Descriptions.Item>
                          <Descriptions.Item label="任务名称">
                            {item.name}
                          </Descriptions.Item>
                          <Descriptions.Item label="项目介绍" span={1}>
                            {this.state.projectDetail}
                          </Descriptions.Item>
                          <Descriptions.Item label="周期">
                            <p style={{ color: "#00FF00", display: "inline" }}>
                              {item.cycle}
                            </p>
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
                              ￥{item.price}
                            </p>
                          </Descriptions.Item>
                        </Descriptions>
                      </Content>
                    </Layout>
                  </Layout>
                </div>
              </List.Item>
            )}
          />
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default MasterPostList;
