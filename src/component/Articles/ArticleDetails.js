import React, { Component } from 'react';
import {Row, Col, Comment, List} from 'antd';
import { withRouter } from 'react-router-dom';
import storage from "../storage";
import noAuthor from "../../images/no-author.png";
import ReactMarkdown from 'react-markdown';
import {toast} from "react-toastify";

class ArticleDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: storage.get('token'),
            usercomment: '',
            articleId: this.props.match.params.id
        }
    }

    componentWillMount() {
        console.log(this.props.match.params.id);
        this.getArticleDetails(this.state.articleId);
        this.getArticleComments(this.state.articleId);
    };

    getArticleDetails = (id) => {
        fetch('https://api.bangneedu.com/article/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.state.token ? "Bearer " + this.state.token : ''
            }})
            .then((res) => res.json())
            .then( res => {
                console.log("article: " + res.data);
                this.setState({
                    article: res.data[0]
                });
            })
            .catch( err => console.log(err));
    };

    getArticleComments = (id) => {
        fetch('https://api.bangneedu.com/articleComment/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.state.token ? "Bearer " + this.state.token : ''
            }})
            .then((res) => res.json())
            .then( res => {
                console.log("comments: " + res.data);
                this.setState({
                    comments: res.data
                });
            })
            .catch( err => console.log(err));
    };

    onFieldChange = (e) => {
        this.setState({usercomment: e.target.value});
    };

    commentSubmit = () => {
        let body = {
            "content": this.state.usercomment,
            "articleId": this.state.articleId
        };
        if(!this.state.token) {
            toast.error("请登陆后再评论", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=>{
                this.props.history.push("/login")
            },1500);
        } else {
            fetch('https://api.bangneedu.com/articleComment', {
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
                        this.getArticleComments(this.state.articleId);
                    }
                })
                .catch( err => console.log(err));
        }
    };

    render() {
        let article = this.state.article;
        return (
            <div>
                <Row>
                    <Col md={4} />
                    <Col md={16}>
                        <div className='article-box'>
                            {
                                article && <div className='article'>
                                    <Comment
                                        author={
                                            <div>
                                                <div className='article-name'>{article.title}</div>
                                                <div>作者 <span style={{color: '#ff6e37'}}>{article.name}</span></div>
                                            </div>

                                        }
                                        content={
                                            <div style={{marginTop: 40}}>
                                                <ReactMarkdown className='content-markdown' source={article.content} />
                                            </div>
                                        }
                                        datetime={
                                            <div className='article-date'>{article.createTime}</div>
                                        }
                                    />
                                </div>
                            }
                            <div className='art-comments'>
                                <div className='comment-input'>
                                    <img src={this.state.headPortrait ? this.state.headPortrait : noAuthor} alt='' />
                                    <input onChange={this.onFieldChange} value={this.state.usercomment} placeholder='说点什么...'/>
                                    <button onClick={() => this.commentSubmit()}>评论</button>
                                </div>
                                <div className='comment-list'>
                                    {
                                        this.state.comments && <List
                                            className="comment-list"
                                            header={`${this.state.comments.length} 条评论`}
                                            itemLayout="horizontal"
                                            dataSource={this.state.comments}
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
                    </Col>
                    <Col md={4} />
                </Row>
            </div>
        )
    }
}

export default withRouter(ArticleDetails);
