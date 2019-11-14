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
