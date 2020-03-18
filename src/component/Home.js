import React, { Component } from 'react';
import './Home.css';
import yangshu from '../images/yangshu.png';
import actImg from '../images/act.png';
import {Row, Col, Carousel, Calendar, Descriptions, List } from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Link } from 'react-router-dom';
import CarousalItem from './Carousel/Carousel';
import ArticleItem from './Articles/article-list';
import ClockItem from './Clock/clock-list.js';
import {getLearnDairy, getArticles, getNbPunckClock} from '../fetch/index.js';


moment.locale('zh-cn');

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            current: 1,
            changed: false,
            page: 1,
            type: ''
        }
    }

    componentWillMount() {
        this.getScheduleByDate(moment(this.state.date).format("YYYY-MM-DD"));
        this.getBanners();
        this.getProject();
        this.getLearnDairy();
        this.getArticles(1);
        this.getNbPunckClock();
    }

    onDataSelect = (date) => {
        console.log(moment(date).format("YYYY-MM-DD"));
        let selectedDate = moment(date).format("YYYY-MM-DD");
        this.getScheduleByDate(selectedDate);
    };

    getLearnDairy = () => {
      getLearnDairy().then((res) => {
        this.setState({
          learnDairy: res.data
        })
      })
    };

    getNbPunckClock = () => {
      getNbPunckClock().then((res) => {
        this.setState({
          clocks: res.data
        })
      })
    }

    getArticles = (page, type) => {
    getArticles(page, type).then((res) => {
        console.log('首页获取文章: ', res.data);
        this.setState({
            articles: res.data.records,
            pages: parseInt(res.data.pages),
            changed: true
        })
      })
    };


    getScheduleByDate = (date) => {
        fetch('https://api.bangneedu.com/schedule/' + date, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res)
                this.setState({
                    schedule: res.data
                });
            })
            .catch( err => console.log(err))
    };

    getBanners = () => {
        fetch('https://api.bangneedu.com/carouselImage', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res)
                this.setState({
                    banners: res.data.records
                });
            })
            .catch( err => console.log(err))
    };
    getProject = () => {
        fetch('https://api.bangneedu.com/project?current=1&size=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res)
                this.setState({
                    project: res.data.records[0]
                });
            })
            .catch( err => console.log(err))
    };

    projectDetail = () => {
        this.props.history.push('/project/' + this.state.project.id);
    };

    render() {
        return <div className='home'>
            <div className='carousel-container'>
                <Carousel autoplay>
                    {
                        this.state.banners && this.state.banners.map((item, index) => {
                            if(item.route !== undefined) {
                                return item.route.substring(0,4) === 'http' ?
                                    <a href={item.route} key={index}>
                                        <img src={item.url} alt={item.name}/>
                                    </a>
                                    :
                                    <Link key={index} to={item.route === undefined ? '' : item.route}>
                                        <img  src={item.url} alt={item.name}/>
                                    </Link>
                            }
                            return <img  src={item.url} alt={item.name} key={index} />;
                        })
                    }

                </Carousel>
            </div>
            <Row gutter={8} className='home-container'>
                <Col md={2} className='left-container' />
                <Col md={16}>
                    <div className='mid-container'>
                        <div className='mid-header'>
                            <img src={actImg} alt=''/>
                            <div>实/战/演/练</div>
                            <img src={actImg} alt=''/>
                        </div>
                        <div className='mid-project'>
                            {
                                this.state.project && <Row>
                                    <Col md={6}>
                                        <img src={this.state.project.image} alt='' className='project-img' />
                                    </Col>
                                    <Col md={18}>
                                        <Descriptions title={this.state.project.name} column={1} className='pro-detail'>
                                            <Descriptions.Item label="技术栈: ">{this.state.project.technology}</Descriptions.Item>
                                            <Descriptions.Item label="项目介绍 ">{this.state.project.details}</Descriptions.Item>
                                        </Descriptions>
                                        <button onClick={this.projectDetail}>查看详情</button>
                                    </Col>
                                </Row>
                            }
                        </div>
                        <div className='con-header'>学习日记</div>
                        <div class="learn-dairy-wrapper">
                          <ArticleItem getArticles={this.getLearnDairy.bind(this)} articles={this.state.learnDairy}/>
                        </div>
                        <div className='con-header'>优秀打卡</div>
                        <div class="daka-wrapper">
                        {
                          ( this.state.clocks &&
                            <ClockItem dakaList={this.state.clocks} />
                          )
                        }
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className='cal-box'>
                        <div className='cal-head'>棒棒团学习日程表</div>
                            <Calendar fullscreen={false} onSelect={this.onDataSelect} />
                        <div className='cal-foot'>
                            <div>
                                <div className='left-head'>今日安排</div>
                                {
                                    this.state.schedule &&
                                    <List
                                        dataSource={this.state.schedule}
                                        renderItem={item => (
                                            <List.Item>
                                                {item.title}
                                            </List.Item>
                                        )}
                                    />
                                }
                            </div>
                            <div className='right-foot'>
                                <img src={yangshu} alt=''/>
                                <p>添加阳叔微信sunyangsheep参加活动</p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default Home;
