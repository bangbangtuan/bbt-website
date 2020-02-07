import { get, post, put, del } from './tool';
import * as config from './config';
import storage from "../component/storage";

/* 打卡相关 */
export const getClocks = (current) => get({
    url: config.CLOCK + '?current=' + current +'&size=10',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getOtherUserClocks = (id) => get({
  url: config.CLOCK + '/user/' + id,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const postClock = (body) => post({
    url: config.CLOCK,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const getUserClocks = () => get({
    url: config.CLOCK + '/user?current=0&size=10',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const getPunchTheClockComment = (id) => get({
  url: config.PUNCHTHEClOCKCOMMENT + '/' + id,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})

/* 文章相关 */
export const getArticles = (current, type="") => get({
    url: config.ARTICLE + '?current=' + current +'&size=10&type=' + type,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getOtherUserArticles = (id) => get({
  url: config.ARTICLE + '/user/' + id,
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const postArticles = (body) => post({
    url: config.ARTICLE,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const getCollectedArticles = () => get({
  url: config.ARTICLE_COLLECTION,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const cancelCollection = (body) => put({
  url: config.ARTICLE + '/not_collection',
  body,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})


export const addCollection = (body) => put({
  url: config.ARTICLE + '/collection',
  body,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const getUserArticles = () => get({
    url: config.ARTICLE + '/user?current=0&size=10',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const getMyLikeArtilce = () => get({
    url: config.ARTICLE + '/allLike',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const addLike = (body) => put({
    url: config.ARTICLE + '/like',
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const cancelLike = (body) => put({
    url: config.ARTICLE + '/not_like',
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const getArticleDetails = (id) => get({
    url: config.ARTICLE + '/' + id,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const searchCollectedArtciles = (id, content) => get({
  url: config.ARTICLE_COLLECTION + '/' + id + '?search=' + content,
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const searchMyCollectedArticles = (content) => get({
  url: config.ARTICLE_COLLECTION + '?search=' + content,
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

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
    headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
})

export const getNewMessage = () => get({
    url: config.MessagePush,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token'),
    },
})

/* 师徒相关 */
export const getAllMasterList = () => get({
    url: config.MASTER,
    headers: {
        'Content-Type': 'application/json',
    }
});

/* 标签相关 */
export const getTags = () => get({
    url: config.TAG,
    headers: {
        'Content-Type': 'application/json',
    }
});

/* 用户相关 */
export const getUserInfo = () => get({
    url: config.USER,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});


export const getOtherUserInfo = (id) => get({
  url: config.USER + '/' + id,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + storage.get('token')
  }
})


export const changeUserInfo = (body) => put({
    url: config.USER,
    body,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});


export const getInvitationCode = () => get({
    url: config.INVITE_CODE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storage.get('token')
    }
});

export const userRegister = (body) => post({
    url: config.REGISTER,
    body,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getValidCode = (phone) => get({
    url: config.VALID_CODE + '/' + phone,
    headers: {
        'Content-Type': 'application/json',
    }
});

/* 好友关系 */
export const getFriendNumber = () => get({
  url: config.FRIEND + '?' + 'type=1',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
});

export const getOtherUserFriendNumber = (id) => get({
  url: config.FRIEND + '?id=' + id + '&' + 'type=2',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const getOtherUserFollowList = (id) => get({
  url: config.FRIEND + '/follow?id=' + id + '&' + 'type=2',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const getMyUserFollowList = () => get({
  url: config.FRIEND + '/follow?' + 'type=1',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})

export const getOtherUserFansList = (id) => get({
  url: config.FRIEND + '/fans?id=' + id + '&' + 'type=2',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})


export const follow = (body) => post({
  url: config.FRIEND,
  body,
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})


export const cancelFollow = (id) => del({
  url: config.FRIEND + '/' + id,
  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + storage.get('token')
  }
})
