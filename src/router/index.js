import Vue from 'vue'
// import Vuex from 'vuex'
import Router from 'vue-router'
import login from '../components/login/login'
import home from '../components/home/home'
import search from '../components/home/search'
import myAcount from '../components/home/myAcount'
import parkingTicket from '../components/home/parkingTicket'
import news from '../components/home/news'
import appointment from '../components/acountComponents/appointment'
import appoint from '../components/commonComponents/appoint'
import payMent from '../components/commonComponents/payMent'
import parkDetail from '../components/commonComponents/parkDetail'
import counp from '../components/acountComponents/counp'
import car from '../components/acountComponents/car'
import addCar from '../components/acountComponents/addCar'
import appointInfo from '../components/acountComponents/appointInfo'
import orderInfo from '../components/acountComponents/orderInfo'
import settingMore from '../components/acountComponents/more'
import activities from '../components/acountComponents/activities'
import suggestions from '../components/acountComponents/suggestions'
import payFeedback from  '../components/commonComponents/payFeedback'
Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [{
            path: '/',
            redirect: '/home',
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/myAcount',
            name: 'myAcount',
            component: myAcount
        },
        {
            path: '/settingMore',
            name: 'settingMore',
            component: settingMore
        },
        {
            path: '/parkingTicket',
            name: 'parkingTicket',
            component: parkingTicket
        },
        {
            path: '/appointment',
            name: 'appointment',
            component: appointment
        },
        {
            path: '/counp',
            name: 'counp',
            component: counp
        },
        {
            path: '/car',
            name: 'car',
            component: car
        },
        {
            path: '/addCar',
            name: 'addCar',
            component: addCar
        },
        {
            path: '/appoint',
            name: 'appoint',
            component: appoint
        },
        {
            path: '/payMent',
            name: 'payMent',
            component: payMent
        },
        {
            path: '/appointInfo',
            name: 'appointInfo',
            component: appointInfo
        },
        {
            path: '/orderInfo',
            name: 'orderInfo',
            component: orderInfo
        },
        {
            path: '/activities',
            name: 'activities',
            component: activities
        },
        {
            path: '/suggestions',
            name: 'suggestions',
            component: suggestions
        },
        {
            path: '/parkDetail',
            name: 'parkDetail',
            component: parkDetail
        },
        {
            path: '/news',
            name: 'news',
            component: news
        },
        {
            path: '/search',
            name: 'search',
            component: search
        },
        {
            path: '/payfeedback',
            name: 'payfeedback',
            component: payFeedback
        }

    ]
})