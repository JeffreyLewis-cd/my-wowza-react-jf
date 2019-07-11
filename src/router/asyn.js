/**
 * 输出异步加载组件
 */

import {asyncComponent} from './AsyncComponent';

export const ReduxTest = asyncComponent(() => import("../view/main/application/reduxTest"));
export const AppManage = asyncComponent(() => import("../view/main/application/appManage"));
export const IncomingStream = asyncComponent(() => import("../view/main/live/incomingStream"));
export const PushStream = asyncComponent(() => import("../view/main/live/pushStream"));
export const MyWebSocket = asyncComponent(() => import("../view/main/myWebSocket/myWebSocket"));
