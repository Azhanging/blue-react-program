import axios, {AxiosRequestConfig} from 'axios';
import {routerID} from '@router';
import config from '@config';
import utils from 'blue-utils';
import {showLoading, hideLoading} from "./antd/toast";
import {Toast} from 'antd-mobile';
import code from '$code/code';    //错误码
import {codeHandler} from '$code';   //错误码处理

interface MyTAxiosRequestConfig extends AxiosRequestConfig {
	//路由id
	routeID: number;
	//是否现实loading
	showLoading: boolean;
}

//柯里化 axios
const $axios = axios.create(utils.extend({
	headers: {
		'X-Requested-With': 'XMLHttpRequest'
	}
}, config.request.options));

//拦截器request
// @ts-ignore
$axios.interceptors.request.use(( axiosConfig: MyTAxiosRequestConfig ) => {
	//把路由当前路由的id设置给axios config中
	axiosConfig.routeID = routerID.getCurrentID();
	//mode为token，设置header头
	setRequestHeader(axiosConfig);
	//set form data type
	setFormData(axiosConfig);
	//是否loading显示
	//@ts-ignore
	axiosConfig.showLoading && showLoading({
		content: '加载中...'
	});
	return axiosConfig;
}, ( error ) => {
	const {axiosConfig} = error;
	const {showLoading} = axiosConfig;
	showLoading && hideLoading();
	return Promise.reject(error);
});

//拦截器response
$axios.interceptors.response.use(( res ) => {
	const {config} = res;
	//@ts-ignore
	const {showLoading, showToast, routeID} = config;
	showLoading && hideLoading();
	//匹配路由id和请求id是够一致，不一致不进行处理
	if (!routerID.isCurrentID(routeID)) {
		return Promise.reject(res.data);
	}
	const {code: requestCode, message} = res.data;
	//success code
	if (requestCode === code.SUCCESS) {
		//信息toast
		showToast && message && Toast.info(message);
		return res.data;
	} else {
		//code处理
		codeHandler(res.data);
		//避免原来then上的业务，走reject
		return Promise.reject(res.data);
	}
}, ( error ) => {
	const axiosConfig = error.config;
	let {message} = error;
	const {showLoading, routeID} = axiosConfig;

	//关闭loading
	showLoading && hideLoading();

	//匹配路由id和请求id是够一致，不一致不进行处理
	if (!routerID.isCurrentID(routeID)) {
		return Promise.reject(error);
	}

	//处理超时信息，重写信息,只有超时有提示
	if (/timeout/ig.test(message)) {
		message = `请求超时，请刷新页面`;
	} else if (/Network\sError/.test(message)) {
		message = `网络已断开，请检查网络`;
	}

	message && Toast.info(message);

	return Promise.reject(error);
});

//在react中扩展
// @ts-ignore
export function axiosInReact ( React ) {
	React.$axios = React.Component.prototype.$axios = $axios;
}

//set x-www-form-urlencoded data
function setFormData ( axiosConfig: MyTAxiosRequestConfig ) {
	axiosConfig.data = utils.stringifyParams(axiosConfig.data);
}

//设置header中的token
function setRequestHeader ( axiosConfig: MyTAxiosRequestConfig ) {
	const {headers} = axiosConfig;
	utils.each(config.login.storage, ( key: string ) => {
		const {localStorage, sessionStorage} = window;
		const getItem = localStorage.getItem(key) || sessionStorage.getItem(key);
		if (getItem) {
			headers[ key.replace(/([A-Z])/g, `-$1`).toLowerCase() ] = getItem;
		}
	});
}


export default $axios;
