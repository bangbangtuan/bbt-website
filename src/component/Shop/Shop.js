/*
Created by peng on 08/19/2019
*/

import React, { Component } from 'react';
import { Row, Col, Comment, Avatar, Button, Card } from 'antd';
import storage from "../storage";
import noAuthor from '../../images/no-author.png';
import './Shop.css';
import { withRouter } from 'react-router-dom';
import ExchangeActivity from "./ExchangeActivity";
const { Meta } = Card;

class Shop extends Component{
    constructor(props) {
        super(props);
        this.state = {
            goods: []
        }
    }

    componentWillMount() {
        if(storage.get('token')) {
            fetch('https://testapi.bangneedu.com/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + storage.get('token')
                }})
                .then((res) => res.json())
                .then( res => {
                    this.setState({
                        userInfo: res.data
                    });
                })
                .catch( err => console.log(err));
        }
        fetch('https://api.bangneedu.com/commodity?current=1&size=10', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res.data.records);
                this.setState({
                    goods: res.data.records
                });
            })
            .catch( err => console.log(err))
    }

    chooseShopItem = (id) => {
        this.props.history.push("/shopitem/" + id)
    };

    render() {
        return(
            <Row>
                <Col md={5} />
                <Col md={14}>
                    {
                        this.state.userInfo && <div className='shop-head'>
                            <Comment
                                className='points'
                                avatar={
                                    <Avatar
                                        src={this.state.userInfo.headPortrait ? this.state.userInfo.headPortrait : noAuthor}
                                        alt="avatar"
                                    />
                                }
                                author={this.state.userInfo.name}
                                content={
                                    <p>积分：{this.state.userInfo.integral ? this.state.userInfo.integral : 0}</p>
                                }
                            />
                            <Button shape='round'>兑换记录</Button>
                        </div>
                    }
                    <div>
                        <Col span={18}>
                            {
                                this.state.goods && this.state.goods.map((item, index) => {
                                    return <Col span={8} key={index} className='col'>
                                        <Card
                                            hoverable
                                            style={{ width: 190 }}
                                            bordered={false}
                                            cover={<img alt="商品图片" src={item.commodityImage} />}
                                        >
                                            <Meta title={item.commodityName}
                                                  className='item-desc'
                                                  description={
                                                      <div>
                                                          <div>价值： {item.commodityPrice}积分 + ¥{item.commodityFreight}</div>
                                                          <div align="center">
                                                              <Button shape='round' onClick={() => this.chooseShopItem(item.id)}>兑换商品</Button>
                                                          </div>
                                                      </div>
                                                  }
                                            />
                                        </Card>
                                    </Col>
                                })
                            }
                        </Col>
                        <Col span={6}>
                            <ExchangeActivity />
                        </Col>
                    </div>
                </Col>
                <Col md={5} />
            </Row>
        )
    }
}

export default withRouter(Shop);
