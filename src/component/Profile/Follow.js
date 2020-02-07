import React, { Component } from 'react';
import './Follow.css';
import { Link } from 'react-router-dom';
import { Row, Col, Descriptions, Breadcrumb,Tabs, Input as Search } from 'antd';
import ReactMarkdown from 'react-markdown';
import FollowItem from './FollowItem';
import { getFriendNumber, getOtherUserFollowList,  getOtherUserFansList, getMyUserFollowList} from '../../fetch'


const FANS = 1
const FOLLOW = 2

class Follow extends Component{
    constructor(props) {
        super(props);
        console.log('type: ',  props.location.query.type)
        this.state = {
          visible: false,
          friends: [],
          type: props.location.query.type,
          userId: props.location.query.id
        }
    }

    componentWillMount () {
      if (this.state.type === FANS) {
        Promise.all([this.getMyUserFollowList(), this.getOtherUserFansList()]) // 查看他的粉丝有没有在我的关注列表当中
        .then((res) => {
          let fansList = res[1]
          let followList = res[0]
          console.log('fansList: ', fansList)
          console.log('followList: ', followList)
          for (let i = 0; i < fansList.length; i++) {
            // 如果是自己的id 则不显示关注
            if (this.isFollowed(fansList[i], followList)) {
              fansList[i].isFollow = true // 有问题
            } else {
              fansList[i].isFollow = false // 这个罗炯
            }
          }
          this.setState({
            friends: fansList
          }, () => {
            console.log('关注失败: ', this.state.friends)
          })
        })
      } else if (this.state.type === FOLLOW) {
        getOtherUserFollowList(this.state.userId).then((res) => {
          // 遍历设置isFollow 的值为false
          for (let i = 0; i < res.length; i ++) {
            res[i].isFollow = true
          }
          this.setState({
            friends: res
          })
        })
      }
    }

    isFollowed (fan, followList) {
      for (let i =0; i < followList.length; i++) {
        if (followList[i].id === fan.id) {
          return true
        }
      }
      return false
    }

    getMyUserFollowList() {
      let p = new Promise( (resolve, reject) => {
        let followList = getMyUserFollowList(this.state.userId)
        resolve(followList)
      })
      return p
    }

    getOtherUserFollowList() {
      let p = new Promise( (resolve, reject) => {
        let followList = getOtherUserFollowList(this.state.userId)
        resolve(followList)
      })
      return p
    }

    getOtherUserFansList() {
      let p = new Promise( (resolve, reject) => {
        let fansList = getOtherUserFansList(this.state.userId)
        resolve(fansList)
      })
      return p
    }

    render () {
      return (
        <Row>
          <Col md={4}/>
          <Col md={16}>
            <div className="title-wrapper">
            {
              this.state.type === 1
              ? (<span className="texts">
                    TA的粉丝
                  </span>)
              :(<span className="texts">
                    TA的关注
                  </span>
              )}
              <span className="number">
                {this.state.friends.length}
              </span>
            </div>
            <div className="item-wrapper">
              {
                this.state.friends && this.state.friends.map((item, index) => {
                    return <FollowItem follower = {item} key={index} />
                })
              }
            </div>
          </Col>
          <Col md={4}/>
      </Row>
      )
    }

  }

  export default Follow;
