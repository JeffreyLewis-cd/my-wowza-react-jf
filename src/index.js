import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import {AppManage, IncomingStream, MyWebSocket, PushStream} from './router/asyn';

import {HashRouter, Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PageSider from "./view/components/sider/pageSider";
import reducer from "./redux/reducer";
import {createStore} from 'redux'
import {Provider} from 'react-redux'

moment.locale('zh-cn');
//创建store
const store = createStore(reducer);

const s_page_header = {};

const s_page_container = {
    display: 'flex',
    justifyContent: 'flex-start',
    height: '100vh',
    overflow: 'hidden'
};
const s_page_sider = {
    height: '100vh',
};
const s_main_content = {
    // height: 'calc(100vh - 80px)',
    height: '100vh',
    minWidth: 1200,
    minHeight: 600,
    overflow: "hidden",
    width: '100%',
};


ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <LocaleProvider locale={zh_CN}>
                <div>
                    {/*<PageHeader style={s_page_header}/>*/}
                    <div style={s_page_container}>
                        <PageSider style={s_page_sider}/>
                        <div id='main-content' style={s_main_content}>
                            <Switch>
                                <Route path="/" exact component={MyWebSocket}></Route>
                                <Route path="/myWebSocket" exact component={MyWebSocket}></Route>
                                <Route path="/appManage" exact component={AppManage}></Route>
                                <Route path="/liveIncoming" exact component={IncomingStream}></Route>
                                <Route path="/livePush" exact component={PushStream}></Route>
                            </Switch>
                        </div>
                    </div>
                </div>
            </LocaleProvider>
        </HashRouter>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
