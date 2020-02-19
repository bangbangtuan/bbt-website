import React, { Component } from 'react';
import './Friend.css';
import { Link } from 'react-router-dom';
import { Row, Col, Descriptions, Breadcrumb,Tabs, Input as Search } from 'antd';
import ReactMarkdown from 'react-markdown';
import FriendItem from './FriendItem';
import { getFriendNumber, getOtherUserFollowList,  getOtherUserFansList, getMyUserFollowList, getUserInfo} from '../../fetch'


const FANS = 1
const FOLLOW = 2

class Friend extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          friends: [],
          type: props.location.query.type,
          userId: props.location.query.id
        }
    }

    componentWillMount () {
      if (this.state.type === FANS) {
        Promise.all([this.getMyUserFollowList(), this.getOtherUserFansList(), this.getUserInfo()])
        .then((res) => {
          let fansList = res[1]
          let followList = res[0]
          let userInfo = res[2]

          for (let i = 0; i < fansList.length; i++) {
            if (this.hasLoginUserId(fansList[i], userInfo.id)) {
                fansList[i].isFollow = undefined
            } else {
              if (this.isFollowed(fansList[i], followList)) {
                fansList[i].isFollow = true
              } else {
                fansList[i].isFollow = false
              }
            }
          }

          this.setState({
            friends: fansList
          })
        })
      } else if (this.state.type === FOLLOW) {
        Promise.all([this.getMyUserFollowList(), this.getOtherUserFollowList()])
        .then((res) => {
          let myFollowers = res[0]
          let otherUserFollowers = res[1]

          for (let i = 0; i < otherUserFollowers.length; i++) {
            if (this.isFollowed(otherUserFollowers[i], myFollowers)) {
              otherUserFollowers[i].isFollow = true
            } else {
              otherUserFollowers[i].isFollow = false
            }
          }

          this.setState({
            friends: otherUserFollowers
          })
        })
      }
    }

    hasLoginUserId (fan, loginUserId) {
      if (fan.bbtUserId === loginUserId) {
        return true
      } else {
        return false
      }
    }

    isFollowed (fan, followList) {
      for (let i =0; i < followList.length; i++) {
        if (followList[i].bbtUserId === fan.bbtUserId) {
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

    getUserInfo () {
      let p = new Promise( (resolve, reject) => {
        let userInfo = getUserInfo()
        resolve(userInfo)
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
                    return <FriendItem follower = {item} key={index} />
                })
              }
            </div>
          </Col>
          <Col md={4}/>
      </Row>
      )
    }

  }

  export default Friend;
