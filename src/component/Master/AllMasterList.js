import React from 'react';
import {Button, Col, Descriptions, Icon, Layout, Row} from "antd";
import { getAllMasterList } from '../../fetch'
import {Link} from "react-router-dom";
const { Sider, Content } = Layout;

class AllMasterList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        this.getAllMasterList();
    }

    getAllMasterList = () => {
        getAllMasterList().then((res) => {
            console.log(res)
            this.setState({
                allMasters: res.records,
            });
        })
    };
    render() {
        return (
            <Row>
                <Col md={5} />
                <Col md={14}>
                    <div className='con-header'>师傅列表</div>
                    <div style={{marginBottom: 20}}>
                        <Layout style={{ background: '#fff' }}>
                            <Sider width={200} height={200}  className="project-img-con">
                                <img className='pro-image' src="http://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-10-18/bd09d9d4ab444f3090e7d2ad7fc66e66-file?Expires=4724990603&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=nCu7bOESrYT86ru0KEPp4cP2dQ8%3D" alt='' />
                            </Sider>
                            <Layout style={{ background: '#fff' }}>
                                <Content style={{ padding: '20px 20px 0', margin: 0}}>
                                    <Descriptions title="你从哪里来" column={1}>
                                        <Descriptions.Item label="技术栈">Vue</Descriptions.Item>
                                        <Descriptions.Item label="地区">上海</Descriptions.Item>
                                    </Descriptions>
                                </Content>
                                <div style={{float: 'right', marginBottom: 10}}>
                                    <Link to={'/project/' } ><Button type="danger" shape='round' className='detail-btn' onClick={this.showModal}>查看详情</Button></Link>
                                </div>
                            </Layout>
                        </Layout>
                    </div>
                    {/*{*/}
                    {/*    this.state.allMasters && this.state.allMasters.map((item, index) => {*/}
                    {/*        return <div key={index}>*/}
                    {/*            <div style={{marginBottom: 20}}>*/}
                    {/*                <Layout style={{ background: '#fff' }}>*/}
                    {/*                    <Sider width={200} height={200}  className="project-img-con">*/}
                    {/*                        <img className='pro-image' src={item.image} alt='' />*/}
                    {/*                    </Sider>*/}
                    {/*                    <Layout style={{ background: '#fff' }}>*/}
                    {/*                        <Content style={{ padding: '20px 20px 0', margin: 0}}>*/}
                    {/*                            <Descriptions title={item.name} column={1}>*/}
                    {/*                                <Descriptions.Item label="技术栈">{item.technology}</Descriptions.Item>*/}
                    {/*                                <Descriptions.Item label="项目介绍">{item.details}</Descriptions.Item>*/}
                    {/*                            </Descriptions>*/}
                    {/*                        </Content>*/}
                    {/*                        <div style={{float: 'right', marginBottom: 10}}>*/}
                    {/*                            <Link to={'/project/' + item.id} className='btn-detail-1'>查看详情</Link>*/}
                    {/*                        </div>*/}
                    {/*                    </Layout>*/}
                    {/*                </Layout>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    })*/}
                    {/*}*/}
                </Col>
                <Col md={5} />
            </Row>
        )
    }

}
export default AllMasterList;
