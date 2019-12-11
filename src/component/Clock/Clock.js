import React, { Component } from 'react';
import {Row, Col, message, Radio, Input} from 'antd';
import './Clock.css';
import ClockItem from './clock-list';
import storage from "../storage";
import { withRouter } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './paginate.css'
import {getClocks, getTags, postClock} from '../../fetch';
const { TextArea } = Input;

class Clock extends Component{
    constructor(props) {
        super(props);
        this.state = {
            textarea: '',
            current: 1,
            changed: false,
            type:'',
            isClickable: true,
            t_length: 0
        }
    }

    componentDidMount() {
        this.getDakaList(this.state.current);
        this.getTags();
    };

    getDakaList = (page) => {
        getClocks(page).then((res) => {
            console.log(res)
            this.setState({
                dakaList: res.records,
                pages: parseInt(res.pages),
                changed: true
            });
        })
    };

    getTags = () => {
        getTags().then((res) => {
            console.log(res);
            this.setState({
                tags: res.records
            });
        })
    };

    onFieldChange = (e) => {
        let t_text = e.target.value.length;
        this.setState({
            textarea: e.target.value,
            t_length: t_text
        });
    };

    dakaSubmit = () => {
        let token = storage.get('token');
        if(token) {
            if(this.state.textarea && this.state.type) {
                this.setState({
                    isClickable: false,
                    changed: false,
                });
                let body = {
                    "content": this.state.textarea,
                    "type" : this.state.type
                };
                postClock(body).then((res) => {
                    console.log(res)
                    if(res.status === 200) {
                        this.getDakaList(1);
                        message.success(res.msg, 1);
                        this.setState({
                            textarea: '',
                            type: '',
                            isClickable: true,
                            t_length: 0
                        });
                    } else if (res.status === 500) {
                        message.error(res.msg, 2);
                    }
                });
            } else {
                message.info("请填写打卡内容并选择打卡类别");
            }
        } else {
            message.error("请登陆后再提交", 2);
            this.props.history.push("/login");
        }
    };

    handlePageClick = (data) => {
        console.log(data.selected)
        let selected = data.selected + 1;
        this.setState({ current: selected, changed: false }, () => {
            this.getDakaList(selected);
        });
    };

    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({
            type: e.target.value
        })
    };

    render() {
        const type = this.state.type;
        return (
            <Row>
                <Col md={5} />
                <Col md={14}>
                    <div className='daka'>
                        <div className='daka-area'>
                            <TextArea rows={5} className='textarea' value={this.state.textarea} onChange={this.onFieldChange} />
                            <div className="text-count">{this.state.t_length}/255</div>
                        </div>
                        <div className="classify">
                            <div>点击选择打卡类别</div>
                            <Radio.Group onChange={this.handleChange}>
                                {
                                    this.state.tags && this.state.tags.map((item, index) => {
                                        return <Radio.Button key={index} value={item.tag} className={type ===item.tag ? 'radioActive':''}><span>#{item.tag}#</span></Radio.Button>
                                    })
                                }
                                {/*<Radio.Button value="前端" className={type ==='前端' ? 'radioActive':''}>#前端#</Radio.Button>*/}
                                {/*<Radio.Button value="Java" className={type ==='Java' ? 'radioActive':''}>#Java#</Radio.Button>*/}
                                {/*<Radio.Button value="产品经理" className={type ==='产品经理' ? 'radioActive':''}>#产品经理#</Radio.Button>*/}
                                {/*<Radio.Button value="Python" className={type ==='Python' ? 'radioActive':''}>#Python#</Radio.Button>*/}
                            </Radio.Group>
                        </div>
                        <button className='ml-auto button' onClick={this.dakaSubmit}>{this.state.isClickable ? "打卡" : "正在处理..."}</button>
                    </div>
                    {
                        (this.state.dakaList && this.state.changed && <div>
                                <ClockItem dakaList={this.state.dakaList} />
                                <ReactPaginate
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    pageCount={this.state.pages}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={9}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={'pagination'}
                                    pageLinkClassName={'page'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                    previousLinkClassName={'link'}
                                    nextLinkClassName={'link'}
                                    disableInitialCallback={false}
                                    forcePage={this.state.current - 1}
                                />
                            </div>
                        )
                    }

                </Col>
                <Col md={5} />
            </Row>
        )
    }
}

export default withRouter(Clock);
