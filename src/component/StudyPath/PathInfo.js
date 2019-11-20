import React, { Component } from 'react';
import {List, Button} from 'antd';
import './StudyPath.css';
import { Link } from 'react-router-dom';
import { getPathInfo } from '../../fetch'

class PathInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        this.getPathInfo(this.props.item.id);
    }

    getPathInfo = (id) => {
        getPathInfo(id).then((res) => {
            console.log(res)
            this.setState({
                pathInfo: res.length > 2 ? res.slice(0,2) : res
            });
        })
    };

    render() {
        const path = {
            pathname: '/pathDetails',
            state: this.props.item,
        };
        return(
            <div>
                {
                    this.state.pathInfo && <div className='path-item'>
                        <List
                            className='path-list'
                            split
                            dataSource={this.state.pathInfo}
                            renderItem={(item, index) => (
                                <div>
                                    <List.Item className={index % 2 === 0 ? 'dark' : 'light'}>
                                        <div>{item.title}</div>
                                        <Link to={'/pathDetail/' + item.id }><Button shape='round'>查看详情</Button></Link>
                                    </List.Item>
                                </div>
                            )}
                        />
                        {
                            this.state.pathInfo.length > 0 &&
                            <div className={this.state.pathInfo.length % 2 === 0 ? 'load dark' : 'load light'}>
                                <Link to={path}>查看更多》</Link>
                            </div>
                        }

                    </div>
                }
            </div>
        )
    }
}

export default PathInfo;
