import { get, post } from './tool';
import * as config from './config';
import storage from "../component/storage";

/* 打卡相关 */
export const getClocks = (current) => get({
    url: config.CLOCK + '?current=' + current +'&size=10',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const postClock = (body) => post({
    url: config.CLOCK,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

/* 文章相关 */
export const getArticles = (current, type="") => get({
    url: config.ARTICLE + '?current=' + current +'&size=10&type=' + type,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const postArticles = (body) => post({
    url: config.ARTICLE,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

/* 学习路径相关 */
export const getStudyPaths = (current) => get({
    url: config.PATH + '?current=' + current +'&size=10',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getPathInfo = (id) => get({
    url: config.PATH_INFO + '/' + id,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getPathDetail = (id) => get({
    url: config.PATH_DETAILS + '/' + id,
    headers: {
        'Content-Type': 'application/json',
    }
});
/*师徒模块相关*/
export const getMasterAndApprentice = () => get({
    url: config.ORDER + '/masterAndApprentice',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }    
})
export const getMasterOrApprenticeList = (type) => get({
    url: config.ORDER + '/type/'+type,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }    
})

export const getPostList = () => get({
    url: config.MASTER+'/user',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    } 
})

export const getMasterWorkDetail = (id) => get({
    url: config.MASTER + '/' + id,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    } 
})

export const getProjectTaskDetail = (id) => get({
    url: config.ProjectTask + '/task?id=' + id,
    headers: {
        'Content-Type': 'application/json'
    } 
})

export const getProjectDetail = (id) => get({
    url: config.Project + '/' + id,
    headers: {
        'Content-Type': 'application/json'
    } 
})

export const getMasterList = (size, current) => get({
    url: config.MASTER + '?size=' + size +"&current="+current,
    headers: {
        'Content-Type': 'application/json'
    } 
})

export const getUserInfo = () => get({
    url: config.UserInfo,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    } 
})
export const getMasterDetail = (id) => get({
    url: config.MASTER + '/' + id,
    headers: {
        'Content-Type': 'application/json',
    }     
})
export const postAddMaster = (body) => post({
    url: config.ORDER,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    } 
})

export const masterPay = (body) => post({
    url: config.CreateOrder,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    } 
})

export const getMasterOrder = (id) => get({
    url: config.ORDER + '/details/' + id,
    hearder:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
})