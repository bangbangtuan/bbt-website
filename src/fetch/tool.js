import { message } from 'antd';

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */

export const get = ({url, msg = '接口异常', headers}) =>
    fetch(url, {
        method: 'GET',
        headers: headers
    })
        .then((res) => res.json())
        .then( res => res.data)
        .catch( err => {
            console.log(err);
            message.warn(msg);
        });

/**
 * 公用post请求
 * @param url       接口地址
 * @param body      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */

export const post = ({url, body, msg = '接口异常', headers}) =>
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
        .then((res) => res.json())
        .catch( err => {
            console.log(err);
            message.warn(msg);
        });

/**
 * 公用put请求
 * @param url       接口地址
 * @param body      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */

export const put = ({url, body, msg = '接口异常', headers}) =>
    fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    })
        .then((res) => res.json())
        .catch( err => {
            console.log(err);
            message.warn(msg);
        });
