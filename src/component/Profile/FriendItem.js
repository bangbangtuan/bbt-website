import React, { Component } from 'react';
import './FriendItem.css';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { follow, cancelFollow, getOtherUserFriendNumber } from '../../fetch';



class FriendItem extends Component{
    constructor(props) {
        super(props);

        this.state = {
          fansNumber: 0,
          followerNumber: 0,
          isFollow: props.follower.isFollow
        }
    }

    componentWillMount () {
      this.getFriendNumber()
    }

    getFriendNumber () {
      // 获取id 获取粉丝数量
      let userId = this.props.follower.bbtUserId
      getOtherUserFriendNumber(userId).then((res) => {
        console.log()
        this.setState({
          fansNumber: res.data.follow,
          followerNumber: res.data.fans
        })
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
        <Link to={'/profile/' + this.props.follower.bbtUserId}>
          <img className="follow-avatar" src={this.props.follower.headPortrait}></img>
        </Link>
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
              { this.state.isFollow === undefined
                ?(<div></div>)
                :(
                !this.state.isFollow
                ? (<div className="follow-button" onClick = {this.handleFollow.bind(this, this.props.follower.bbtUserId)}>
                    <span className="follow-text" >+关注</span>
                  </div>)
                : (<div className="cancel-follow-button" onClick = {this.handleFollow.bind(this, this.props.follower.bbtUserId)}>
                    <span className="cancel-text" >取消关注</span>
                  </div>))
              }
        </div>
      )
    }

  }

  export default FriendItem;
