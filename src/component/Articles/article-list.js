import React, { Component } from 'react';
import './Article.css';
import { Link } from 'react-router-dom';
import { Comment, Icon, message} from 'antd';
import ReactMarkdown from 'react-markdown';
import QRCode  from 'qrcode.react';
import Close  from '../../images/close.svg';
import Share from '../../images/share.svg';
import Collect from '../../images/collect.svg'
import Collected from '../../images/collected.svg'
import { getCollectedArticles, addCollection, cancelCollection } from "../../fetch";
import storage from '../storage';



class ArticleItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          collectedArtcile: []
        }
    }

    componentWillMount () {
      this.getCollectedArticles();
    }

    getCollectedArticles () {
      getCollectedArticles().then((res) => {
        console.log('查看自己收藏的文章: ', res)
        this.setState({
          collectedArtcile: res.data
        })
      })
    }

    showShare (articleId) {
      let path = window.location.host + '/article/' + articleId
      this.setState({
        visible: true,
        path: path
      })
    }

    isCollected (articleId) {
      // 判断改文章是否已经被收藏
      let token = storage.get('token');
      if (!token) {
        return false
      } else {
        for (let item of this.state.collectedArtcile) {
          if (item.id === articleId) {
            console.log('item.id: ', item.id)
            // console.log('确认是否只收藏一篇文章')
            return true
          }
        }
        return false
      }
    }

    getArticles () {
      console.log('获取所有文章')
      this.props.getArticles()
    }

    handleCancel (e) {
      console.log('测试是否执行了关闭modal')
      e.stopPropagation();
      this.setState({
        visible: false
      })
    }

    handleClick (e) {
      // 阻止冒泡事件
      e.stopPropagation();
    }

    collect (articleId) {
      // 收藏该商品
      let body = {
        "articleId": articleId
      }
      let token = storage.get('token');
      if (!token) {
        message.error("请登录后再收藏")
      } else {
        if (this.isCollected(articleId)) {
          cancelCollection(body).then((res) => {
            // 取消收藏
            this.getCollectedArticles() // 获取已收藏的文章
            message.success("取消收藏成功");
          }).then((res) => {
            this.getArticles()
          })
        } else {
          // 调用进行收藏的接口
          addCollection(body).then((res) => {
            this.getCollectedArticles() // 获取已收藏的文章  但是
            message.success("收藏成功");
          }).then(() => {
            this.getArticles()
          })
        }
        // 重新获取所有文章
        this.getArticles()
      }
    }

    modal () {
      return <div className="background-modal" onClick={this.handleCancel.bind(this)}>
      <div className="qrcode-modal" onClick={(e) => this.handleClick(e)}>
        <img src={Close} className="close-modal" alt="logo" onClick={(e) => {this.handleCancel(e)}} />
        <div className="title-modal">
          微信分享
        </div>
        <div className="detail-modal">
          打开微信"扫一扫",打开网页后点击屏幕右上角分享按钮
        </div>
        <div className="share-modal">
          <QRCode
              value = {this.state.path}  //value参数为生成二维码的链接
              size = {200} //二维码的宽高尺寸
              fgColor = "#000000"  //二维码的颜色
         />
        </div>
      </div>
      </div>
    }


    render() {
        let articles = this.props.articles;
        console.log('articles: ', articles)
        return (
            <div>
                {
                    articles && articles.map((item, index) => {
                        return <div className='article-item' key={item.id}>
                                <Comment
                                author={
                                    <div>
                                        <Link to={'/article/' + item.id} style={{ textDecoration: 'none', color: '#666666' }} >
                                          <div className='article-name'>{item.title}</div>
                                        </Link>
                                        <div>作者 <span style={{color: '#ff6e37'}}>{item.name}</span></div>
                                    </div>
                                }
                                content={
                                    <Link to={'/article/' + item.id} style={{ textDecoration: 'none', color: '#666666' }} >
                                      <div style={{marginTop: 40}}>
                                          <ReactMarkdown className='content-markdown' source={item.content.substring(0,150)} />
                                      </div>
                                    </Link>
                                }
                                datetime={
                                    <div className='article-date'>{item.createTime}</div>
                                }
                                actions={
                                    [
                                        <span className='comment-like'>
                                            <div className='vertical-alain'>
                                                <Icon type="eye" style={{fontSize: 18}} />
                                                <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.browseNumber}</span>
                                            </div>
                                            <div className='vertical-alain'>
                                                <Icon type="message" style={{fontSize: 16}} />
                                                <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.commentNumber}</span>
                                            </div>
                                            <div className='vertical-alain'>
                                                <Icon type="like" style={{fontSize: 16}} />
                                                <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.praiseNumber}</span>
                                            </div>
                                            <div className='vertical-alain' style={{position: 'relative', top: -2}}>
                                              {
                                                this.isCollected(item.id)
                                                ?(<img src={Collected} alt="logo"  className='collect' onClick={this.collect.bind(this, item.id)} />)
                                                :(<img src={Collect} alt="logo"  className='collect' onClick={this.collect.bind(this, item.id)} />)
                                              }
                                              <span style={{ paddingLeft: 8, cursor: 'auto', fontSize: 14 }}>{item.collectionNumber}</span>
                                            </div>
                                            <div className='vertical-alain' style={{position: 'relative', top: -2}} onClick={this.showShare.bind(this, item.id)}>
                                                <img src={Share} alt="logo"  className='share'/>
                                            </div>
                                        </span>
                                    ]
                                }
                            />
                          </div>
                    })
                }
                {
                  this.state.visible &&
                  this.modal()
                }
            </div>
        )
    }
}

export default ArticleItem;
