import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Home from './Home';
import Clock from './Clock/Clock';
import Login from './Login';
import Register from './Register';
import PageNotFound from "./PageNotFound";
import Profile from './Profile/Profile';
import Article from './Articles/Article';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ArticleDetails from "./Articles/ArticleDetails";
import Team from "./Team/Team";
import PrivateRoute from './PrivateRoute'
import AddArticle from "./Articles/AddArticle";
import UserProfile from "./Profile/UserProfile";
import Logout from "./Logout";
import Project from "./Project/Project";
import ProjectDetails from "./Project/ProjectDetails";
import ProjectTasks from "./Project/ProjectTasks";
import StudyPath from "./StudyPath/StudyPath";
import PathDetails from "./StudyPath/PathDetails";
import Shop from "./Shop/Shop";
import ShopItem from "./Shop/ShopItem";
import OrderInfo from "./Shop/OrderInfo";
import ExchangeSuccess from "./Shop/ExchangeSuccess";
import ExchangeFail from "./Shop/ExchangeFail";
import UserOrderList from "./Shop/UserOrderList";
import OrderDetails from "./Shop/OrderDetails";
import ResetPassword from "./ResetPassword";
import MasterShowPage from "./Master/MasterShowPage";
import PayOrder from "./Shop/PayOrder";
import Master from "./Master/Master";
import MorePaths from "./StudyPath/MorePaths";
import MasterDetail from "./Master/MasterDetail"
import MasterPay from "./Master/MasterPay"
import MasterPaySuccess from "./Master/MasterPaySuccess"
import MasterPayFail from "./Master/MasterPayFail"
import MasterRecommend from "./Master/MasterRecommend"
import MasterPostList from "./Master/MasterPostList"
import ApprenticeList from "./Master/ApprenticeList"
import MasterList from "./Master/MasterList"
import AllMasterList from "./Master/AllMasterList";
import MasterOrderDetails from "./Master/MasterOrderDetails"
import RecommendMasterList from "./Master/RecommendMasterList"
import MasterPayList from "./Master/MasterPayList"
import ApprenticeOrderDetail from "./Master/ApprenticeOrderDetail"

class App extends React.Component {

    render() {
        document.body.style.backgroundColor = "#f8fbfd";
        return (
            <div>
                <Navigation />
                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/clock" render={() => {
                            return <Clock />
                        }} />
                        <Route path="/articles" render={() => {
                            return <Article />
                        }} />
                        <Route path="/article/:id" render={(history, match) => {
                            return <ArticleDetails history={history} match={match} />
                        }} />
                        <PrivateRoute  path="/profile" render={(history, match) => {
                            return <Profile history={history} match={match} />
                        }} />
                        <Route path="/userProfile/:id" render={() => {
                            return <UserProfile />
                        }} />
                        <Route path="/cpMatch" render={() => {
                            return <Team />
                        }} />
                        <Route path="/addArticle" render={() => {
                            return <AddArticle />
                        }} />
                        <Route path="/projects" render={() => {
                            return <Project />
                        }} />
                        <Route path="/project/:id" render={() => {
                            return <ProjectDetails />
                        }} />
                        <Route path="/task/:id" render={() => {
                            return <ProjectTasks />
                        }} />
                        <Route path="/path" render={() => {
                            return <StudyPath />
                        }} />
                        <Route path="/pathDetail/:id" render={() => {
                            return <PathDetails />
                        }} />
                        <Route path="/pathDetails" render={() => {
                            return <MorePaths />
                        }} />
                        <Route path="/shop" render={() => {
                            return <Shop />
                        }} />
                        <Route path="/shopitem/:id" render={() => {
                            return <ShopItem />
                        }} />
                        <Route path="/orderInfo" render={() => {
                            return <OrderInfo />
                        }} />
                        <Route path="/exchangeSuccess" render={() => {
                            return <ExchangeSuccess />
                        }} />
                        <Route path="/exchangeFail" render={() => {
                            return <ExchangeFail />
                        }} />
                        <Route path="/orderList" render={() => {
                            return <UserOrderList />
                        }} />
                        <Route path="/orderDetails/:id" render={() => {
                            return <OrderDetails />
                        }} />
                        <Route path="/login" render={() => {
                            return <Login />
                        }} />
                        <Route path="/register" render={() => {
                            return <Register />
                        }} />
                        <Route path="/logout" render={() => {
                            return <Logout/>
                        }} />
                        <Route path="/reset" render={() => {
                            return <ResetPassword/>
                        }} />
                        <Route path="/masterShowPage" render={() => {
                            return <MasterShowPage/>
                        }} />
                        <Route path="/payOrder" render={() => {
                            return <PayOrder/>
                        }} />
                        <Route path="/master" render={() => {
                            return <Master/>
                        }} />
                        <Route path="/masterDetail/:id" render={() => {
                            return <MasterDetail/>
                        }} />
                        <Route path="/masterPay/:id" render={() => {
                            return <MasterPay/>
                        }} />
                        <Route path="/masterPaySuccess" render={() => {
                            return <MasterPaySuccess/>
                        }} />
                        <Route path="/masterPayFail" render={() => {
                            return <MasterPayFail/>
                        }} />
                        <Route path="/masterRecommend" render={() => {
                            return <MasterRecommend/>
                        }}/>
                        <Route path="/masterPostList" render={() => {
                            return <MasterPostList/>
                        }}/>
                        <Route path="/apprenticeList" render={() => {
                            return <ApprenticeList/>
                        }}/>
                        <Route path="/masterList" render={() => {
                            return <MasterList/>
                        }}/>
                        <Route path="/masterOrderDetails/:id" render={() => {
                            return <MasterOrderDetails/>
                        }}/>
                        <Route path="/masterPayList" render={() => {
                            return <MasterPayList/>
                        }}/>
                        <Route path="/apprenticeOrderDetail" render={() => {
                            return <ApprenticeOrderDetail/>
                        }}/>
                        <Route path='/recommendMasterList' render={() => {
                            return <RecommendMasterList/>
                        }}/>
                        <Route path="/allMasterList" render={() => {
                            return <AllMasterList/>
                        }}/>
                    


                        <Route component={PageNotFound}/>
                    </Switch>
                </BrowserRouter>
                <div className='footer'>
                    <div>Copyright © bangneedu 黑龙江省马斯克网络科技有限责任公司</div>
                    <a href='http://www.beian.miit.gov.cn'>黑ICP备19001710号-1</a>
                </div>
            </div>
        );
    }
}

export default App;
