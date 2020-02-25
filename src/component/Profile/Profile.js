import React, { Component } from 'react';
import './Profile.css';
import { Row, Col, Descriptions, Breadcrumb,Tabs, Input as Search } from 'antd';
import '../Clock/Clock.css';
import ClockItem from '../Clock/clock-list';
import ArticleItem from '../Articles/article-list';
import storage from '../storage';
import { withRouter, Link } from 'react-router-dom';
import UserTasks from "../Project/userTasks";
import UserOrderList from "../Shop/UserOrderList";
import { getCollectedArticles, getOtherUserInfo, getFriendNumber, getOtherUserFriendNumber, getUserClocks, getOtherUserClocks, getUserArticles, getUserInfo, getInvitationCode, getOtherUserArticles } from '../../fetch'
import { getArticles, searchCollectedArtcles, searchMyCollectedArticles, follow, cancelFollow, getMyUserFollowList, getOtherUserCollectedArticles } from "../../fetch";
const { TabPane } = Tabs;

class Profile extends Component{
    constructor(props, context) {
        super(props, context);
        console.log('参数: ', props.location.search)
        this.state = {
            key: 'home',
            collectedArtcile: [],
            otherUserId: this.props.match.params.id,
            friendNumber: {
              folow: 0,
              fans: 0
            },
            type: '',
            current: 1,
            userArticle: [],
            isFollow: false,
            loginUserInfo: '',
            defaultActiveKey: props.location.search.indexOf('defaultActiveKey') === -1? '1':'3'
        };
    }

    componentWillMount() {
        let token = storage.get('token');
        this.setState({
            token: token
        });

        getUserInfo().then((res) => {
          console.log('res: ', res)
          this.setState({
            loginUserInfo: res.data
          }, () => {
            console.log('loginUserInfo: ', this.state.loginUserInfo.id)
          })
        }).then((res) => {
          this.getData(token)
          // 判断用户ID 是否在我的关注列表当中
        })
    }

    getData (token) {
      if (token && this.isMyProfile()) {
          getUserInfo().then((res) => {
            this.setState({
                userInfo: res.data
            })
          })

          getInvitationCode().then((res) => {
              this.setState({
                  inviteCode: res.data
              });
          });

          getUserClocks().then((res) => {
              console.log(res);
              this.setState({
                  userDaka: res.data.records
              });
          });

          getUserArticles().then((res) => {
              console.log(res);
              this.setState({
                  userArticle: res.data.records
              });
          });

          this.getCollectedArticles();

          getFriendNumber().then((res) => {
            this.setState({
              friendNumber: res.data
            }, () => {
              console.log('friendNumber', this.state.friendNumber)
            })
          })

          fetch('https://api.bangneedu.com/orderForm/0', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  "Authorization": "Bearer " + token
              }})
              .then((res) => res.json())
              .then( res => {
                  console.log(res.data);
                  this.setState({
                      allOrders: res.data
                  });
              })
              .catch( err => console.log(err))

      } else if (token && !this.isMyProfile()) {
        getOtherUserInfo(this.state.otherUserId).then((res) => {
          this.setState({
            userInfo: res.data
          }, () => {
            console.log('getOtherUserInfo: ', this.state.userInfo)
          })
        })

        //  根据token 获取该用户的该关注列表
        //  判断ID 是否存在于该列表当中 isFollow: true

        getMyUserFollowList().then((res) => {
          let followList = res.data
          let isFollow = ''
          console.log('followList: ', followList)
          console.log('this.state.otherUserId: ', this.state.otherUserId)
          for (let i = 0; i < followList.length; i++) {
              if (followList[i].bbtUserId === this.state.otherUserId) {
                isFollow = true
              }
          }

          if (isFollow) {
            this.setState({
              isFollow: true
            }, () => {
              console.log('isFollow:: ', this.state.isFollow)
            })
          } else {
            this.setState({
              isFollow: false
            })
          }
        })

        getOtherUserClocks(this.state.otherUserId).then((res) => {
          this.setState({
            userDaka: res.data
          })
        })

        getOtherUserFriendNumber(this.state.otherUserId).then((res) => {
          this.setState({
            friendNumber: res.data
          })
        })

        getOtherUserArticles (this.state.otherUserId).then((res) => {
          this.setState({
            userArticle: res.data
          }, () => {
            console.log('学习日记: ', this.state.userArticle)
          })
        })

        this.getCollectedArticles()

      } else {
          storage.set('token', false);
          getOtherUserInfo(this.state.otherUserId).then((res) => {
            this.setState({
              userInfo: res.data
            })
          })
          getOtherUserClocks(this.state.otherUserId).then((res) => {
            this.setState({
              userDaka: res.data
            })
          })

          getOtherUserFriendNumber(this.state.otherUserId).then((res) => {
            this.setState({
              friendNumber: res.data
            })
          })
          this.getCollectedArticles()

      }
    }

    isMyProfile () {
      if (this.state.otherUserId === undefined) {
        return true
      } else if (this.state.loginUserInfo.id === this.state.otherUserId) {
        return true
      } else {
        return false
      }
    }

    callback () {
      console.log('取消分享')
    }

    getCollectedArticles () {
      if (this.isMyProfile()) {
        getCollectedArticles().then((res) => {
          this.setState({
            collectedArtcile: res.data
          })
        })
      } else {
        getOtherUserCollectedArticles(this.state.otherUserId).then((res) => {
          this.setState({
            collectedArtcile: res.data
          })
        })
      }
    }

    handleClick = () => {

      if (this.isMyProfile()) {
        console.log('查看我自己的信息')
        let id = this.state.userInfo.id
        this.props.history.push("/userProfile/" + id)
      } else {
        console.log('查看别人的信息')
        let id = this.state.otherUserId
        this.props.history.push("/userProfile/" + id)
      }

    };

    handleFollow = (id) => {
      // 点击关注之后，变成取消关注
      // 取消关注之后，就会变成关注某人的状态 之中发生、
      //
      follow({fid: id}).then((res) => {
        this.setState({
          isFollow: true
        })
      }).then((res) => {
        if (this.isMyProfile()) {
          getFriendNumber().then((res) => {
            // 回调函数执行的顺序
            this.setState({
              friendNumber: res.data
            })
          })
        } else {
          getOtherUserFriendNumber(this.state.otherUserId).then((res) => {
            this.setState({
              friendNumber: res.data
            })
          })
        }
      })
    }

    handleCancelFollow = (id) => {
      // 取消关注之后，更新该用的粉丝数量 ，演示 变成关注
      cancelFollow(id).then((res) => {
        this.setState({
          isFollow: false
        })
      }).then((res) => {
        if (this.isMyProfile()) {
          getFriendNumber().then((res) => {
            this.setState({
              friendNumber: res.data
            })
          })
        } else {
          getOtherUserFriendNumber(this.state.otherUserId).then((res) => {
            this.setState({
              friendNumber: res.data
            })
          })
        }
      })
    }

    getArticles = (page, type) => {
      getArticles(page, type).then((res) => {
          this.setState({
              userArticle: res.data.records,
              pages: parseInt(res.data.pages),
              changed: true
          })
      })
    };

    getSearchArticle (event) {
      let content =  event.target.value
      if (this.isMyProfile()) {
        searchMyCollectedArticles(content).then((res) => {
          this.setState({
            collectedArtcile: res.data
          })
        })
      } else {
        searchCollectedArtcles(this.state.otherUserId, content).then((res) => {
          this.setState({
            collectedArtcile: res.data
          })
        })
      }
    };


    render() {
        return (
            <div>
                <div className='header'>
                    <Row>
                        <Col md={4}/>
                        <Col md={16}>
                            {
                                (this.state.userInfo && (
                                <div className='head-container'>
                                  <div className='head-wrapper'>
                                    <img src={this.state.userInfo.headPortrait} alt='' onClick={() => this.handleClick()} style={{cursor: 'pointer'}}/>
                                    {
                                      (!this.isMyProfile() &&
                                        (!this.state.isFollow
                                          ?(<div className="follow-container">
                                              <span className="follow" onClick={() => this.handleFollow(this.state.userInfo.id)}>+关注</span>
                                            </div>)
                                          :(<div className="cancel-button">
                                              <span className="cancel-follow" onClick={() => this.handleCancelFollow(this.state.userInfo.id)}>已关注</span>
                                            </div>)
                                        ))
                                    }
                                  </div>
                                  <div className="userinfo-wrapper">
                                    <Descriptions title={this.state.userInfo.name} className='user-info' column={1}>
                                        <Descriptions.Item label="微信号 ">{this.state.userInfo.weixin}</Descriptions.Item>
                                        <Descriptions.Item label="个人简介 ">{this.state.userInfo.description ? this.state.userInfo.description : '什么都没有'}</Descriptions.Item>
                                    </Descriptions>
                                    <Link to={{pathname: '/follow', query: {id: this.state.userInfo.id, type: 1}}}>
                                    <div className="fans-wrapper">
                                      <span className="fans">粉丝 </span>
                                        <span className="fans-number">{this.state.friendNumber.fans}</span>
                                    </div>
                                      </Link>
                                        <Link to={{pathname: '/follow', query: {id: this.state.userInfo.id, type: 2}}}>
                                    <div className="followers-wrapper">
                                      <span className="followers">关注 </span>
                                        <span className="followers-number">{this.state.friendNumber.follow}</span>
                                    </div>
                                      </Link>
                                  </div>
                                </div>
                                ))
                            }
                        </Col>
                        <Col md={4}/>
                    </Row>
                </div>
                <Tabs defaultActiveKey={this.state.defaultActiveKey} className='profile-tabs'>
                    <TabPane tab="动态" key="1">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                {
                                    (this.state.userDaka &&
                                        <ClockItem dakaList={this.state.userDaka} />)
                                }
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    <TabPane tab="学习日记" key="2">
                        <Row>
                            <Col md={4}/>
                            <Col md={16}>
                                {
                                    (this.state.userArticle &&
                                        <ArticleItem articles={this.state.userArticle} getArticles={this.getArticles.bind(this, this.state.current, this.state.type)}/>)
                                }
                            </Col>
                            <Col md={4}/>
                        </Row>
                    </TabPane>
                    {
                      (this.isMyProfile() &&
                          <TabPane tab="个人中心" key="3">
                                <Row>
                                    <Col md={4}/>
                                    <Col md={16}>
                                        <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 14, marginTop: 30, marginBottom: 30}}>
                                            <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                                            <Breadcrumb.Item>我的任务</Breadcrumb.Item>
                                        </Breadcrumb>
                                        <UserTasks />
                                    </Col>
                                    <Col md={4}/>
                                </Row>
                            </TabPane>)
                    }
                    {
                      (this.isMyProfile() &&
                      <TabPane tab="积分商城" key="4">
                          <Row>
                              <Col md={4}/>
                              <Col md={16}>
                                  <Breadcrumb className='con-header' style={{ paddingLeft: 10, fontSize: 14, marginTop: 30, marginBottom: 30}}>
                                      <Breadcrumb.Item>个人中心</Breadcrumb.Item>
                                      <Breadcrumb.Item>积分商城</Breadcrumb.Item>
                                  </Breadcrumb>
                                  <Tabs defaultActiveKey="1" className='order-tab'>
                                      <TabPane tab="所有订单" key="1">
                                          <UserOrderList orders={this.state.allOrders} />
                                      </TabPane>
                                      <TabPane tab="待兑换" key="2">
                                          Content of Tab Pane 2
                                      </TabPane>
                                      <TabPane tab="待发货" key="3">
                                          Content of Tab Pane 3
                                      </TabPane>
                                      <TabPane tab="待收货" key="4">
                                          Content of Tab Pane 3
                                      </TabPane>
                                  </Tabs>
                              </Col>
                              <Col md={4}/>
                          </Row>
                      </TabPane>)
                    }
                    {(this.isMyProfile() &&
                      <TabPane tab="我的邀请码" key="5">
                          <Row>
                              <Col md={4}/>
                              <Col md={16}>
                                  {
                                      this.state.inviteCode && <div className='invite-code'>
                                          <div>我的邀请码: {this.state.inviteCode}</div>
                                          <div>邀请好友注册，既可获赠积分，积分可到积分商城兑换学习课程或精美礼品。</div>
                                      </div>
                                  }
                              </Col>
                              <Col md={4}/>
                          </Row>
                      </TabPane>)
                    }
                    {
                      this.isMyProfile()
                      ?(                    <TabPane tab="我的收藏" key="6">
                          <Row>
                              <Col md={4}/>
                              <Col md={16}>
                                    <div className="collect-number">
                                      收藏 {this.state.collectedArtcile.length} 条
                                    </div>
                                    <div className="search">
                                    <Search
                                      placeholder="搜索你的收藏"
                                      style={{width: "300px", height: "40px", border: "solid 1px #dddddd", backgroundColor: "#ffffff", borderRadius: "4px"}}
                                      onPressEnter={(e) => {this.getSearchArticle(e)}}
                                      />
                                    </div>
                                  {
                                      (this.state.collectedArtcile &&
                                          <ArticleItem articles={this.state.collectedArtcile} getArticles={this.getCollectedArticles.bind(this)} />)
                                  }
                              </Col>
                              <Col md={4}/>
                          </Row>

                                          </TabPane>)
                      :(                    <TabPane tab="TA的收藏" key="6">
                                            <Row>
                                                <Col md={4}/>
                                                <Col md={16}>
                                                      <div className="collect-number">
                                                        收藏 {this.state.collectedArtcile.length} 条
                                                      </div>
                                                      <div className="search">
                                                        <Search
                                                          placeholder="搜索你的收藏"
                                                          style={{width: "300px", height: "40px", border: "solid 1px #dddddd", backgroundColor: "#ffffff", borderRadius: "4px"}}
                                                          onPressEnter={(e) => {this.getSearchArticle(e)}}
                                                          />
                                                      </div>
                                                    {
                                                        (this.state.collectedArtcile &&
                                                            <ArticleItem articles={this.state.collectedArtcile} getArticles={this.getCollectedArticles.bind(this)}/>)
                                                    }
                                                </Col>
                                                <Col md={4}/>
                                            </Row>
                                          </TabPane>)
                    }

                </Tabs>
            </div>
        )
    }
}

export default withRouter(Profile);
