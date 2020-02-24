import React from 'react';
import './Navigation.css';
import { Navbar, Nav } from 'react-bootstrap';
import noAuthor from '../images/no-author.png';
import logo from '../images/logo.png';
import storage from "./storage";
import authService from "../services/authService";
import { Menu, Dropdown} from 'antd';

export default class Navigation extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            token: '',
            headPortrait: ''
        }

    }

    fn(token){
        this.setState({
            token: token
        })
    }

    componentWillMount() {
        authService.checkUsrStatus().then(
            (valid) => {
                console.log(valid)
                this.setState({
                    loginStatus: valid,
                    loaded: true
                })
            }
        )
    }

    logout = () => {
        localStorage.removeItem('user');
        this.props.history.push('/login')
    };

    render() {
        const menu = <Menu style={{textAlign:"center"}}>
            <Menu.Item>
                <Nav.Link href="/profile">个人中心</Nav.Link>
            </Menu.Item>
            <Menu.Item>
                <Nav.Link href="/master">师徒计划</Nav.Link>
            </Menu.Item>
            <Menu.Divider style={{margin:"0px 8px"}}/>
            <Menu.Item>
                <Nav.Link href="/logout">退出</Nav.Link>
            </Menu.Item>
        </Menu>;

        if (this.state.loaded === false) {
            return null
        }
        let token = storage.get('token');
        let headPortrait = storage.get('headPortrait');
        let navRight;
        console.log('token: ', token)
        if(token) {

            if (!this.state.loginStatus) {
                navRight = null
            } else {
                navRight =
                    <Nav className="ml-auto">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Nav.Link>
                                <img src={headPortrait} alt='' className='profile'/>
                            </Nav.Link>
                        </Dropdown>
                        <div className='article-exit'>
                            <Nav.Link href="/addArticle">
                                <button className='article'>写文章</button>
                            </Nav.Link>
                        </div>
                    </Nav>
            }
        } else {
            navRight =
                <Nav className="ml-auto">
                    <Nav.Link href="/profile">
                        <img src={noAuthor} alt='' className='profile'/>
                    </Nav.Link>
                    <Nav.Link href="/login">登陆/注册</Nav.Link>
                </Nav>
        }
        return (
            <div className='navigation'>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/"><img src={logo} alt="棒棒团" className='logo' /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">首页</Nav.Link>
                            <Nav.Link href="/cpMatch">组CP</Nav.Link>
                            <Nav.Link href="/articles">学习日记</Nav.Link>
                            <Nav.Link href="/clock">打卡记录</Nav.Link>
                            <Nav.Link href="/projects">实战演练</Nav.Link>
                            <Nav.Link href="/path">学习路径</Nav.Link>
                            <Nav.Link href="/allMasterList">师徒列表</Nav.Link>
                            <Nav.Link href="/shop">积分商城</Nav.Link>
                        </Nav>
                        {navRight}
                    </Navbar.Collapse>
                </Navbar>
            </div>


        );
    }
}
