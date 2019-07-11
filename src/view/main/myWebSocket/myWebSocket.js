import React, {PureComponent} from "react";
import './myWebSocket.scss';
import {Button, message} from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

var serverHost = window.location.host.split(':')[0];

console.log(serverHost);
var ws01 = null;
var ws02 = null;

class MyWebSocket extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ws01Show: true,
            ws02Show: true,
        }
    }

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

    createSocketJS = () => {
        let socket = null;
        let stompClient = null;

        socket = new SockJS('http://172.16.136.30/boot/socket');

        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {

            console.log('Connected: ' + frame);

            stompClient.subscribe('/chatroom', data => {
                console.log(data);
            });

        });
        /*  stompClient.send("/app/test", {}, JSON.stringify({
              'message': '2663_jiangfan'
          }));*/
    };

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
                </div>
            </div>
        );
    }
}

export default MyWebSocket;
