import axios from 'axios';
// import qs from 'qs';
import store from '../store/store'

axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.withCredentials = true;

export const getAxios = async function(type, url, params) {
    let res = await store.eventHub.$http[type](url, params);
    return res.data;
}