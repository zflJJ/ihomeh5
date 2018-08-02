import axios from 'axios';
import qs from 'qs';
import store from '../store/store'

axios.defaults.timeout = 20000;
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
let config = {
    headers: {
        'Content-Type': 'multipart/form-data' //之前说的以表单传数据的格式来传递fromdata
    }
};
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// Content-Type: multipart/form-data;
axios.defaults.withCredentials = true;

export const uploadFile = async function(type, url, params, config) {
    let res = await store.eventHub.$http[type](url, params, config);
    return res.data;
}