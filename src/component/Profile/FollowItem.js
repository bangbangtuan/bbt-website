import React, { Component } from 'react';
import './FollowItem.css';
import { Link } from 'react-router-dom';
import { Row, Col, Descriptions, Breadcrumb,Tabs, Input as Search } from 'antd';
import ReactMarkdown from 'react-markdown';
import { follow, cancelFollow } from '../../fetch';



class FollowItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
          fansNumber: 0,
          followerNumber: 0,
          isFollow: this.props.follower.isFollow
        }
    }

    componentWillMount () {
      this.getFriendNumber()
    }

    getFriendNumber () {
      this.setState({
        fansNumber: 1,
        followerNumber: 1
      })
    }

    handleFollow (userId) {
      if (this.state.isFollow) {
        cancelFollow(userId)
        .then((res) => {
          this.setState({
            isFollow: false
          })
        })
      }
      else {
        follow({fid: userId})
        .then((res) => {
          this.setState({
            isFollow: true
          })
        })
      }
    }

    render () {
      return (
        <div className="follow-wrapper">
          <img className="follow-avatar" src={this.props.follower.headPortrait}></img>
          <div className="follow-info">
            <div className="follow-title">
              {this.props.follower.username}
            </div>
            <div className="follower-wrapper">
              <span className="follower">关注</span>
              <span className="follower-number">{this.state.followerNumber}</span>
            </div>
            <div className="fan-wrapper">
              <span className="fan">粉丝</span>
              <span className="fan-number">{this.state.fansNumber}</span>
            </div>
            <div className="follow-personal-data">
              {this.props.follower.description}
            </div>
          </div>
              {
                !this.state.isFollow
                ? (<div className="follow-button" onClick = {this.handleFollow.bind(this, this.props.follower.bbtUserId)}>
                    <span className="follow-text" >+关注</span>
                  </div>)
                : (<div className="cancel-follow-button" onClick = {this.handleFollow.bind(this, this.props.follower.bbtUserId)}>
                    <span className="cancel-text" >取消关注</span>
                  </div>)
              }
        </div>
      )
    }

  }

  export default FollowItem;
