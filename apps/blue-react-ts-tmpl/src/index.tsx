import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from '@router/AppRouter';
import { useInReact } from '$use-in-react';
import { device } from '$assets/js/device';
import { view } from '$assets/js/view';

//antd mobile全局樣式
import 'antd-mobile/dist/antd-mobile.css';
//使用全局scss
import '@assets/css/blue-zone.scss';

//扩展react
useInReact(React);
//设备兼容性处理
device();
//设置试图相关
view();

ReactDOM.render(<AppRouter/>, document.getElementById('root'));
