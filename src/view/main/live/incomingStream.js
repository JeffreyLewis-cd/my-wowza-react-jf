import React, {PureComponent} from "react";
import {withRouter} from "react-router-dom";
import './style/liveStyle.scss';
import pubFunc from "../../../lib/pubFunc";
import basicRequst from "../../../http/basicRequest";
import {Icon, notification, Select} from 'antd';

import RecordStream from "./recordStream";
import StreamCard from "./streamCard";
import AddressAddRefresh from "./addressAddRefresh"

const {Option} = Select;


class IncomingStream extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            reloadElement: false,
            activeStream: '',
            incomingStrms: [],
            incomingHLS: [],
            activeCard: '',
            refresh_loading: false,
            paramId: "",
            playerType: 'h5',
            addStreamModel: false,
            playerCenter: false,
            showPlayer: false,
        }
    }

    componentDidMount() {
        this.switchDiffStream(); //切换不同的传入流
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.switchDiffStream(); //切换不同的传入流
        }
    };

    /*获取正在传入流的列表*/
    requestIncomingStreams = () => {
        this.setState({
            refresh_loading: true,
            incomingStrms: [],
        });
        basicRequst.getIncomingStreams(this.state.paramId).then((res) => {
                if (res.incomingStreams) {
                    let formatIncomingStreams = JSON.parse(JSON.stringify(res.incomingStreams));

                    /*取消.stream*/
                    formatIncomingStreams.map((item, index) => {
                        let splitName = item.name.split('.');
                        if (splitName) {
                            item.name = splitName[0];
                        }
                    });

                    this.setState({
                        incomingStrms: formatIncomingStreams,

                    }, () => {
                        if (this.state.incomingStrms.length > 0) {
                            const openNotificationWithIcon = type => {
                                notification[type]({
                                    message: '刷新流文件成功',
                                    description:
                                        '成功获取最新的流文件列表！',
                                });
                            };
                            openNotificationWithIcon('success');
                        } else {
                            const openNotificationWithIcon = type => {
                                notification[type]({
                                    message: '警示',
                                    description:
                                        '已连接列表为空！',
                                });
                            };
                            openNotificationWithIcon('warning');
                        }
                        this.getAppStreamList(); //获取流文件列表

                    })
                }
                this.setState({
                    refresh_loading: false,
                });


            }
        ).catch((err) => {
            console.error(err);
            this.setState({
                refresh_loading: false,
            });
            const openNotificationWithIcon = type => {
                notification[type]({
                    message: '刷新流文件失败',
                    description:
                        '请确认推入流文件数据，然后再刷新！',
                });
            };
            openNotificationWithIcon('error');

        })
    };

    /*切换不同的传入流*/
    switchDiffStream() {
        let activeStream = {};
        if (this.props.location.state) {
            activeStream = this.props.location.state.streamInfo;
            this.setState({
                paramId: activeStream.id,
            }, () => {
                this.requestIncomingStreams();  //获取正在传入流的列表
            })
        }
    };

    /*手动输入地址*/
    inputSource = () => {
        let addr = document.getElementById('stream_src').value;
        this.setState({
            activeStream: addr,
            reloadElement: true,
        }, () => {
            this.setState({
                reloadElement: false,
            })
        })
    };

    /*播放RTMP*/
    playRTMP = (paramRTMP) => {
        this.setState({
            activeStream: paramRTMP.actURL,
            activeCard: paramRTMP.name,
            reloadElement: true,
            showPlayer: true,
            playerType: 'h5'
        }, () => {
            this.setState({
                reloadElement: false,
            }, () => {
                setTimeout(() => {
                    this.controlH5Width();
                }, 500)
            });

        });
    };

    /*播放HLS*/
    playHLS = (paramHLS) => {
        this.setState({
            activeStream: paramHLS.actURL,
            activeCard: paramHLS.name,
            reloadElement: true,
            showPlayer: true,
            playerType: 'wowza'
        }, () => {
            this.setState({
                reloadElement: false,
            })
        })
    };

    /*获取流文件列表*/
    getAppStreamList = () => {
        let streamParam = {
            appName: this.state.paramId,
        };

        basicRequst.getStreamList(streamParam).then((res) => {
            if (res.streamFiles && res.streamFiles.length > 0) {
                let inStrms = JSON.parse(JSON.stringify(this.state.incomingStrms));
                let allCreatedStrms = JSON.parse(JSON.stringify(res.streamFiles));
                let allStrmsNames = [];

                allCreatedStrms.map((item01, index) => {
                    item01.name = item01.id;
                    allStrmsNames.push(item01.name);
                });

                let sameNames = [];
                let newStrams = [];
                if (inStrms.length > 0) {
                    inStrms.map((item, index) => {
                        let streamIn = false;
                        for (let key = 0; key < allCreatedStrms.length; key++) {
                            if (item.name === allCreatedStrms[key].id) {
                                streamIn = false;
                                sameNames.push(item.name);
                                break;
                            } else {
                                streamIn = true;
                            }
                        }
                        /*遍历inStrms结束以后，才能得出结论*/
                        let createdStream = item;
                        if (!streamIn) {
                            createdStream.deletable = true;
                        }
                        newStrams.push(createdStream)
                    });

                }
                let diffNames = pubFunc.getArrDifference(sameNames, allStrmsNames);
                diffNames.map((item02, index) => {
                    newStrams.push({
                        name: item02,
                        deletable: true,
                    })
                });

                this.setState({
                    incomingStrms: newStrams,
                }, () => {
                    console.log(this.state.incomingStrms);
                })
            }

            this.setState({
                addStreamModel: false
            })
        })
    };

    /*开启居中播放*/
    turnOnCenterPlayer = (playerCenter) => {
        this.setState({
            playerCenter: playerCenter,
        }, () => {
            if ('h5' === this.state.playerType) {
                let h5PlayerFrame = document.getElementById('h5_player-iframe').contentWindow.document;
                let videoObj = h5PlayerFrame.getElementById('my-player');
                if (playerCenter) {
                    videoObj.style.width = '700px';
                    videoObj.style.height = '430px';
                } else {
                    // videoObj.style.width = '430px';
                    // videoObj.style.height = '400px';
                }
            }
        })
    };

    controlH5Width = () => {
        if (document.getElementById('h5_player-iframe')) {
            let h5PlayerFrame = document.getElementById('h5_player-iframe').contentWindow.document;
            let videoObj = h5PlayerFrame.getElementById('my-player');
            console.log(h5PlayerFrame);
            if (videoObj) {
                videoObj.style.width = '700px';
                videoObj.style.height = '430px';

            }
        }
    };

    /*隐藏播放界面*/
    hidePlayer = () => {
        this.setState({
            showPlayer: false,
        })
    };

    render() {
        let localURL = pubFunc.pathFunc().basePath_f;
        let emptyPlayer = <div className='player-iframe-empty'></div>;
        let wowzaPlayer = <iframe className='player-iframe'
                                  frameBorder="0" title='wowza_player-iframe'
                                  src={localURL + "/wowza_player/wowza_player_index.html"}></iframe>;
        let h5Player = <iframe className='player-iframe' id='h5_player-iframe'
                               frameBorder="0" title='h5_player-iframe'
                               src={localURL + "/h5_player/h5_player.html"}></iframe>;

        return (
            <div className='main-page-body'>
                {/*正在传入的流文件列表*/}
                <div className='incoming_list player_in_center_streams'>
                    <AddressAddRefresh
                        faReloadElement={this.state.reloadElement}
                        faActiveStream={this.state.activeStream}
                        faInputSource={this.inputSource}
                        faParamId={this.state.paramId}
                        faGetAppStreamList={this.getAppStreamList}
                        faRequestIncomingStreams={this.requestIncomingStreams}
                        faRefresh_loading={this.state.refresh_loading}
                    />

                    <div className='incoming_stream_items'>
                        <StreamCard
                            faPlayHLS={this.playHLS}
                            faPlayRTMP={this.playRTMP}
                            faParamId={this.state.paramId}
                            faActiveCard={this.state.activeCard}
                            faIncomingStrms={this.state.incomingStrms}
                            faRequestIncomingStreams={this.requestIncomingStreams}/>

                        <p className='touch_bottom'>--已经到底了--</p>
                    </div>
                </div>

                {/*<div className={!this.state.playerCenter ? 'right_player' : 'right_player player_in_center'}>*/}
                {
                    this.state.showPlayer ? <div className='right_player player_in_center'>
                        <Icon type="close-circle" onClick={this.hidePlayer} className='close_player'/>
                        {/*H5+video.js播放器*/}
                        {
                            'h5' == this.state.playerType ?
                                <div className='h5_player_box'>
                                    {
                                        !this.state.reloadElement ?
                                            h5Player : null
                                    }

                                </div> : null
                        }
                        {/*wowza player_播放器*/}
                        {
                            'wowza' == this.state.playerType ?
                                <div className='wowza_play_view'>
                                    <div className='player-iframe-empty'></div>
                                    {
                                        !this.state.reloadElement ?
                                            wowzaPlayer : null
                                    }
                                </div> : null
                        }
                        <div className='record_operation'>
                            <RecordStream className='record_btn'
                                          faPlayerCenter={this.state.playerCenter}
                                          faHidePlayer={this.hidePlayer}
                                          faTurnOnCenterPlayer={this.turnOnCenterPlayer}
                                          activeCard={this.state.activeCard}
                                          paramId={this.state.paramId}/>
                        </div>
                    </div> : null
                }


            </div>
        )
    }
}

export default withRouter(IncomingStream);
