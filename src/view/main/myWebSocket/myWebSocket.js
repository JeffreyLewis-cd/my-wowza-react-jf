import React, {PureComponent} from "react";
import './myWebSocket.scss';
import {Button, message} from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import basicRequestAPI from '../../../http/basicRequest';
import pubFuncLib from '../../../lib/pubFunc';

let serverHost = window.location.host.split(':')[0];

console.log(serverHost);
let ws01 = null;
let ws02 = null;
let stompClient = null;

class MyWebSocket extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ws01Show: true,
            ws02Show: true,
        }
    }

    componentDidMount() {
        this.getSichuanToken();//获取四川经济统计平台token
    }

    /*获取四川经济统计平台token*/
    getSichuanToken = () => {
        basicRequestAPI.sichuan_login().then(
            (res) => {
                console.log('获取token');
                console.log(res);
                let exp = new Date();

                /*毫秒，30分钟后过期*/
                exp.setTime(exp.getTime() + (2 * 60 * 60 * 1000));
                let expireTime = "; expires=" + exp.toUTCString();

                document.cookie = "loginInfo=" + "true" + expireTime;
                document.cookie = "token=" + res.data.token + expireTime;
                document.cookie = "loginName=" + res.data.name + expireTime;
            }
        ).catch((err) => {
            console.error(err);
        })

    };

    createWebS01 = () => {
        console.log('createWebS');
        if ("WebSocket" in window) {
            console.log("0-您的浏览器支持 WebSocket!");

            // 打开一个 web socket
            // var ws = new WebSocket("ws://192.168.107.128:9998/echo");
            // var ws = new WebSocket("ws://localhost:8080/SiChuanMarket_SSM/role_echo");
            let websocketURL = "ws://" + serverHost + ":8080/SiChuanMarket_SSM/ws/asset01";
            ws01 = new WebSocket(websocketURL);

            console.log(websocketURL);
            // var ws = new WebSocket("ws://172.16.136.30/boot/socket");
            // var ws2 = new WebSocket("ws://172.16.136.30/app/test");

            ws01.onopen = () => {
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws01.send("jiangfan_websocket_test01");
                console.log("1-数据发送中01...");
                this.setState({
                    ws01Show: false,
                })
            };

            ws01.onmessage = function (evt) {
                console.log('2-数据已接收01...');
                let received_msg = evt.data;
                console.log(received_msg);
                message.warning(received_msg);
            };

            ws01.onclose = () => {
                // 关闭 websocket
                console.log("3-连接已关闭01...");
                ws01.close(); //关闭TCP连接};
                this.setState({
                    ws01Show: true,
                })
            };
        } else {
            // 浏览器不支持 WebSocket
            console.error("4-您的浏览器不支持 WebSocket!");
        }
    };

    closeWebS01 = () => {
        ws01.close(); //关闭TCP连接};
    };

    createWebS02 = () => {
        console.log('createWebS02');
        if ("WebSocket" in window) {
            console.log("0-您的浏览器支持 WebSocket02!");

            // 打开一个 web socket
            ws02 = new WebSocket("ws://" + serverHost + ":8080/SiChuanMarket_SSM/ws/asset02");

            ws02.onopen = () => {
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws02.send("jiangfan_websocket_test02");
                console.log("1-数据发送中02...");
                this.setState({
                    ws02Show: false,
                })
            };

            ws02.onmessage = function (evt) {
                console.log('2-数据已接收02...');
                let received_msg = evt.data;
                console.log(received_msg);
                message.warning('02' + received_msg);
            };

            ws02.onclose = () => {
                // 关闭 websocket
                console.log("3-连接已关闭02...");
                ws02.close(); //关闭TCP连接};
                this.setState({
                    ws02Show: true,
                })
            };
        } else {
            // 浏览器不支持 WebSocket
            console.error("4-您的浏览器不支持 WebSocket02!");
        }
    };


    closeWebS02 = () => {
        ws02.close(); //关闭TCP连接};
    };


    SockJS_connection() {
        let websocketURL = "http://" + serverHost + ":8080/SiChuanMarket_SSM/my-websocket";
        // 建立连接对象
        let socket = new SockJS(websocketURL);
        // 获取STOMP子协议的客户端对象
        stompClient = Stomp.over(socket);
        // 定义客户端的认证信息,按需求配置
        let headers = {
            Authorization: pubFuncLib.getCookie('token'),
        };
        console.log(headers);
        // 向服务器发起websocket连接
        stompClient.connect(headers, () => {
            stompClient.subscribe('/topic/send', (msg) => { // 订阅服务端提供的某个topic
                console.log('广播成功-send');
                console.log(msg);  // msg.body存放的是服务端发送给我们的信息
            }, headers);

            stompClient.subscribe('/topic/callback', (msg) => { // 订阅服务端提供的某个topic
                console.log('广播成功-callback');
                console.log(msg);  // msg.body存放的是服务端发送给我们的信息
            }, headers);


            stompClient.send("/app/send",
                headers,
                JSON.stringify({sender: '', chatType: 'JOIN'}),
            )   //用户加入接口
        }, (err) => {
            // 连接发生错误时的处理函数
            console.log('失败');
            console.log(err);
        });
    };   //连接 后台

    SockJS_disconnect() {
        if (stompClient) {
            stompClient.disconnect();
        }
    };  // 断开连接

    render() {
        return (
            <div className='webSocket-page'>
                <h2>webSocket 测试</h2>
                <div className='webS-content'>
                    {
                        this.state.ws01Show
                            ? <Button type="primary" onClick={this.createWebS01}>创建webSocket01</Button>
                            : <Button type="danger" onClick={this.closeWebS01}>关闭webSocket01</Button>
                    }
                    {
                        this.state.ws02Show
                            ? <Button type="primary" style={{marginLeft: '10px'}}
                                      onClick={this.createWebS02}>创建webSocket02</Button>
                            : <Button type="danger" style={{marginLeft: '10px'}}
                                      onClick={this.closeWebS02}>关闭webSocket02</Button>
                    }
                    <Button type="primary" style={{marginLeft: '10px'}}
                            onClick={this.SockJS_connection}>创建_SockJS_01</Button>
                </div>
            </div>
        );
    }
}

export default MyWebSocket;
