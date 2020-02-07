import React, { Component } from 'react';
import {Row, Col, Radio} from 'antd';
import ArticleItem from './article-list';
import ReactPaginate from "react-paginate";
import { getArticles } from "../../fetch";

class Article extends Component{
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            current: 1,
            changed: false,
            page: 1,
            type: ''
        }
    }

    componentWillMount() {
        this.getArticles(this.state.current);
    }

    getArticles = (page, type) => {
        getArticles(page, type).then((res) => {
            console.log(res);
            this.setState({
                articles: res.records,
                pages: parseInt(res.pages),
                changed: true
            })
        })
    };

    handlePageClick = (data) => {
        console.log(data.selected)
        let selected = data.selected + 1;
        this.setState({ current: selected, changed: false }, () => {
            this.getArticles(selected, this.state.type);
        });
    };

    handleChange = (e) => {
        console.log(e.target.value);
        this.getArticles(1, e.target.value);
    };

    render() {
        const type = this.state.type;
        return (
            <Row>
                <Col md={4} />
                <Col md={16}>
                    {
                        this.state.articles && this.state.changed && <div style={{marginTop: 20}}>
                            <div className='type-banner'>
                                <Radio.Group onChange={this.handleChange} >
                                    <Radio.Button value="" className={type ==='all' ? 'radioActive':''}>全部</Radio.Button>
                                    <Radio.Button value="前端" className={type ==='前端' ? 'radioActive':''}>#前端#</Radio.Button>
                                    <Radio.Button value="Java" className={type ==='Java' ? 'radioActive':''}>#Java#</Radio.Button>
                                    <Radio.Button value="产品经理" className={type ==='产品经理' ? 'radioActive':''}>#产品经理#</Radio.Button>
                                    <Radio.Button value="Python" className={type ==='Python' ? 'radioActive':''}>#Python#</Radio.Button>
                                </Radio.Group>
                            </div>
                            <ArticleItem getArticles={this.getArticles.bind(this, this.state.current, this.state.type)} articles={this.state.articles}/>
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
                    }
                </Col>
                <Col md={4} />
            </Row>
        )
    }
}

export default Article;
