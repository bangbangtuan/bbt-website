import React, { Component } from 'react';
import './Clock.css';
import noAuthor from '../../images/no-author.png';
import countImg from '../../images/count.png';
import storage from "../storage";
import { withRouter } from 'react-router-dom';
import { message, Comment, Avatar, Icon, List } from "antd";

class ClockItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token: storage.get('token'),
            usercomment: '',
            headPortrait: storage.get('headPortrait'),
        }
    }

    componentWillMount() {
        let dakaList = this.props.dakaList;
        if(this.state.token) {
            fetch('https://api.bangneedu.com/punchTheClock/allLike' , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + this.state.token
                }})
                .then((res) => res.json())
                .then( res => {
                    console.log(res);
                    this.setState({
                        myLikes: res.data
                    })
                    for(let item of dakaList) {
                        let found = res.data.find(function(element) {
                            return element.punchTheClockId === item.id;
                        });
                        item.liked = found ? true : false;
                    }
                    this.setState({
                        dakaList: dakaList,
                    });
                    console.log(dakaList);
                })
                .catch( err => console.log(err))
        }
        for(let item of dakaList) {
            item.comments = []
            if(item.comments && item.comments.length === 0) {
                fetch('https://api.bangneedu.com/punchTheClockComment/' + item.id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": this.state.token ? "Bearer " + this.state.token : ''
                    }})
                    .then((res) => res.json())
                    .then( res => {
                        item.comments = res.data;
                    })
                    .catch( err => console.log(err))
            }
            item.isToggleOn = false;
            item.display = 'none';
        }

        // let likeCollection = storage.get('like_collection');
        // if (likeCollection) {
        //     for(let i = 0; i < dakaList.length; i++) {
        //         if(likeCollection[dakaList[i].id] === true) {
        //             dakaList[i].liked = true;
        //         } else {
        //             dakaList[i].liked = false;
        //         }
        //     }
        // } else {
        //     let likeCollection = {};
        //     storage.set('like_collection', likeCollection)
        // }
        this.setState(function(prevState, props){
            return {dakaList: dakaList}
        });
        console.log(dakaList);
    }

    getComments = (index) => {
        let dakaList = this.state.dakaList;
        fetch('https://api.bangneedu.com/punchTheClockComment/' + dakaList[index].id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.state.token
            }})
            .then((res) => res.json())
            .then( res => {
                dakaList[index].comments = res.data;
            })
            .catch( err => console.log(err))
        this.setState(function(prevState, props){
            return {dakaList: dakaList}
        });
    };

    handleClick = (id) => {
        let dakaList = this.state.dakaList;
        dakaList[id].isToggleOn = !dakaList[id].isToggleOn;
        dakaList[id].display = dakaList[id].isToggleOn ? 'block' : 'none';

        this.setState({
            dakaList: this.state.dakaList,
        });
        console.log(this.state.dakaList)
    };

    onLikeTap = (id) => {
        let dakaList = this.state.dakaList;
        // let likeCollection = storage.get('like_collection');
        // let likeCollected = likeCollection[dakaList[id].id];
        // likeCollected = !likeCollected;
        // likeCollection[dakaList[id].id] = likeCollected;
        // storage.set('like_collection', likeCollection);
        //
        // let extension = likeCollected ? 'like' : 'not_like';

        let likeCollected = dakaList[id].liked;
        likeCollected = !likeCollected;

        let extension = likeCollected ? 'like' : 'not_like';

        let body = {
            "punchTheClockId": this.state.dakaList[id].id
        }
        fetch('https://api.bangneedu.com/punchTheClock/' + extension, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.state.token
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then( res => {
                console.log(res);
                message.info(res.msg, 2);
                if (res.status === 200) {
                    dakaList[id].liked = likeCollected;
                    dakaList[id].praiseNumber = (parseInt(dakaList[id].praiseNumber) + (likeCollected ? 1 : (-1))).toString();
                    this.setState({
                        dakaList: dakaList
                    });
                    console.log(dakaList)
                }
            })
            .catch( err => console.log(err));
    };

    onFieldChange = (e) => {
        this.setState({usercomment: e.target.value});
    };

    commentSubmit = (index) => {
        let dakaList = this.state.dakaList;
        let body = {
            "content": this.state.usercomment,
            "punchTheClockId": dakaList[index].id
        };
        if(this.state.token) {
            fetch('https://api.bangneedu.com/punchTheClockComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + this.state.token
                },
                body: JSON.stringify(body)
            })
                .then((res) => res.json())
                .then( res => {
                    console.log(res);
                    if(res.status === 200) {
                        this.setState({
                            usercomment: ''
                        });
                        dakaList[index].commentNumber = (parseInt(dakaList[index].commentNumber) + 1).toString();
                        this.getComments(index);
                        this.props.history.push("/clock")
                    }
                })
                .catch( err => console.log(err));
        } else {
            message.error("请登陆后再评论", 2);
            this.props.history.push("/login");
        }
    };

    render() {
        let dakaList = this.state.dakaList;
        return (
            <div className='dakas'>
                <div className='daka-container'>
                        {
                             dakaList && dakaList.map((item, index) => {
                                return <div key={index} className='daka-box'>
                                    <div className='daka-item'>
                                        <Comment
                                            author={
                                                <div>
                                                    {item.name}
                                                    <div className='count'>
                                                        <img src={countImg} alt=''/>
                                                        <div>坚持{item.day}天</div>
                                                    </div>
                                                </div>

                                            }
                                            avatar={
                                                <Avatar src={item.headPortrait} alt={item.name} />
                                            }
                                            content={
                                                <div>
                                                    <p className='content' style={{marginTop: 30}}>{item.type ? "#" + item.type + "#" : ''} {item.content}</p>
                                                </div>
                                            }
                                            datetime={item.createTime}
                                            actions={
                                                [
                                                    <span className='comment-like'>
                                                        <div className='vertical-alain'>
                                                            <Icon
                                                                type="message"
                                                                onClick={() => this.handleClick(index)}
                                                                style={{fontSize: 15}}
                                                            />
                                                            <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.commentNumber}</span>
                                                        </div>
                                                        <div className='vertical-alain'>
                                                            <Icon
                                                                type="like"
                                                                theme={item.liked ? 'filled' : 'outlined'}
                                                                onClick={() => this.onLikeTap(index)}
                                                                style={{fontSize: 15}}
                                                                className={item.liked ? 'twoTone' : 'outlined'}
                                                            />
                                                            <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.praiseNumber}</span>
                                                        </div>
                                                    </span>
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className='comments' style={{display: item.display}}>
                                        <div className='comment-input'>
                                            <img src={this.state.headPortrait ? this.state.headPortrait : noAuthor} alt='' />
                                            <input onChange={this.onFieldChange} value={this.state.usercomment}/>
                                            <button onClick={() => this.commentSubmit(index)}>评论</button>
                                        </div>
                                        <div className='comment-list'>
                                            {
                                                item.comments &&
                                                <List
                                                    className="comment-list"
                                                    header={`${item.comments.length} 条评论`}
                                                    itemLayout="horizontal"
                                                    dataSource={item.comments}
                                                    renderItem={key => (
                                                        <li>
                                                            <Comment
                                                                author={<span style={{color: '#ff6e37'}}>{key.name}</span>}
                                                                avatar={key.headPortrait}
                                                                content={key.content}
                                                                datetime={key.createTime}
                                                            />
                                                        </li>
                                                    )}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                </div>
            </div>
        )
    }
}

export default withRouter(ClockItem);
