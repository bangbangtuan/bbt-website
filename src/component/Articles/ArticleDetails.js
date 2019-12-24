import React, { Component } from 'react';
import {Row, Col, Comment, List, Input, Button, message, Modal} from 'antd';
import { withRouter } from 'react-router-dom';
import storage from "../storage";
import noAuthor from "../../images/no-author.png";
import ReactMarkdown from 'react-markdown';
import { getArticleDetails, getArticleComments, postArticleComment,  getMyLikeArtilce, addLike, cancelLike} from '../../fetch';
import shareLogo from '../../images/share.png';
import like from '../../images/like.png';
import likeAct from '../../images/like-act.png';
import QRCode  from 'qrcode.react';

class ArticleDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            usercomment: '',
            articleId: this.props.match.params.id,
            myLikeArtilce: [],
            like: like
        }
    }

    componentWillMount() {
        console.log(this.props.match.params.id);
        this.getArticleDetails(this.state.articleId);
        this.getArticleComments(this.state.articleId);
        // 如果已经登录，则显示likeAct, 如果没有登录，则显示普通的图片
        this.getMyLikeArtilce();
        this.getLikePic(this.state.myLikeArtilce)
    };

    getArticleDetails = (id) => {
        getArticleDetails(id).then((res) => {
            console.log('文章内容: ', res)
            this.setState({
                article: res[0]
            });
        })
    };

    addLike = () => {
      // 对文章进行点赞
      // 捕获异常
      // 还差一个请求体
      addLike(
        {"articleId": this.state.articleId}
      ).then((res) => {
        console.log('对文章进行点赞')
        this.setState({
          like: likeAct
        })
        this.getArticleDetails(this.state.articleId)
        // 重新获取我喜欢的文章
        this.getMyLikeArtilce()
      })
    }

    cancelLike = () => {
      // 取消对文章的点赞
      cancelLike(
        {"articleId": this.state.articleId}
      ).then((res) => {
        console.log('取消对文章的点赞')
        this.setState({
          like: like
        })
        this.getArticleDetails(this.state.articleId)
        // 重新获取我喜欢的文章
        this.getMyLikeArtilce()

      })
    }

    getArticleComments = (id) => {
        getArticleComments(id).then((res) => {
            console.log(res)
            this.setState({
                comments: res
            });
        })
    };

    getMyLikeArtilce = () => {
      if (storage.get('token')) {
        // 获取我喜欢的文章  并 显示 点赞状态
        getMyLikeArtilce().then((res) => {
          console.log('我喜欢的文章: ', res)
          this.setState({
              myLikeArtilce: res
          })
        })
      }
    }

    onFieldChange = (e) => {
        this.setState({usercomment: e.target.value});
    };

    commentSubmit = () => {
        let body = {
            "content": this.state.usercomment,
            "articleId": this.state.articleId
        };
        if(!storage.get('token')) {
            message.error("请登陆后再评论", 2);
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(()=>{
                this.props.history.push("/login")
            },1500);
        } else {
            postArticleComment(body).then((res) => {
                console.log(res)
                if(res.status === 200) {
                    this.getArticleComments(this.state.articleId);
                }
            })
            // fetch('https://api.bangneedu.com/articleComment', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         "Authorization": "Bearer " + this.state.token
            //     },
            //     body: JSON.stringify(body)
            // })
            //     .then((res) => res.json())
            //     .then( res => {
            //         console.log(res);
            //
            //     })
            //     .catch( err => console.log(err));
        }
    };


    showShare = () => {
      let path = window.location.href
      let articlePath = path.replace("localhost", "10.48.84.226")
      console.log('wx二维码链接: ', articlePath)

      Modal.info({
          title: '打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮',
          content: (
              <div className='share-modal'>
                  <QRCode
                      value = {articlePath}  //value参数为生成二维码的链接
                      size = {100} //二维码的宽高尺寸
                      fgColor = "#000000"  //二维码的颜色
                 />
              </div>
          ),
          onOk() {},
      });
    };

    Like = () => {
      console.log('点赞/取消点赞')
      if (!storage.get('token')) {
        // 提示请登录
        message.error("请登陆后再点赞", 2);
      } else {
        // 可以进行点赞 或者 取消点赞
        if (this.isInMyLike(this.state.myLikeArtilce)) {
          console.log('取消点赞')
          this.cancelLike()
        } else {
          console.log('点赞')
          this.addLike()
        }
      }
    };

    isInMyLike = (myLikeArtilce) => {
      // 判断是不是我喜欢的文章
      console.log('myLikeArtilce: ', myLikeArtilce)
      // console.log('this.state.articleId: ',  this.state.articleId)
      // myLikeArtilce.forEach((item) => {
      //   if (item.articleId === this.state.articleId) {
      //     console.log('成功判断这文章是不是自己喜欢的')
      //     return true
      //   }
      // })
      for (let item of myLikeArtilce) {
        if (item.articleId === this.state.articleId) {
          return true
        }
      }
      return false
    };

    getLikePic = (myLikeArtilce) => {
      // 判断是不是自己点赞的文章
      // 判断文章是否能作为新的时代
      if (this.isInMyLike(myLikeArtilce)) {
        console.log('确实是我喜欢')
        this.setState({
          like: likeAct
        })
      } else {
        console.log('不是我喜欢的文章')
        this.setState({
          like: like
        })
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
                                    <Input onChange={this.onFieldChange} value={this.state.usercomment} placeholder='说点什么...'/>
                                    <Button onClick={() => this.commentSubmit()}>评论</Button>
                                    <img className="like" src={this.state.like} onClick={this.Like} style={{width: '22px', height: '22px'}}></img>
                                    {
                                        article && <span className="like-count">{article && article.praiseNumber}</span>
                                    }
                                    <img className="article-share" src={shareLogo} onClick={this.showShare}></img>
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
