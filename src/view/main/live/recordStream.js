import React, {PureComponent} from "react";
import {Button, Modal} from "antd";
import basicRequestAPI from "../../../http/basicRequest";
import './style/liveStyle.scss'

const confirm = Modal.confirm;

class RecordStream extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeCard: '',
            paramId: '',
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            activeCard: nextProps.activeCard,
            paramId: nextProps.paramId,
        })
    }

    /*点击录制按钮*/
    clickRecordBtn = () => {
        let that = this;
        confirm({
            title: '确定要录制该直播流吗?',
            content: '直播应用名称：' + this.state.paramId + ", 直播流名称:" + this.state.activeCard,
            okText: '确定',
            okType: 'success',
            cancelText: '取消',
            onOk() {
                that.startRecordLive(); //开始录制
            },
            onCancel() {
            },
        });
    };

    /*开始录制*/
    startRecordLive = () => {
        let startParm = {
            appName: this.state.paramId,
            streamName: this.state.activeCard,
        };
        basicRequestAPI.startRecordStream(startParm).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        })
    };

    /*停止录制*/
    stopRecord = () => {
        let startParm = {
            app: this.state.paramId,
            streamname: this.state.activeCard,
            action: 'stopRecording'
        };
        basicRequestAPI.recordLiveStream(startParm).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        })
    };

    /*播放器居中*/
    centerPlay = () => {
        console.log('centerPlay');
        this.props.faTurnOnCenterPlayer(true);


    };

    /*播放器放在右侧*/
    rightPlay = () => {
        console.log('rightPlay');
        this.props.faTurnOnCenterPlayer(false);
    };


    render() {
        return (
            <div className='record_oper_ele'>
                {/*                {
                    this.props.faPlayerCenter ?
                        <Button type='primary' className='record_btn' onClick={this.rightPlay}>右侧播放</Button>
                        :
                        <Button type='primary' className='record_btn' onClick={this.centerPlay}>居中播放</Button>
                }*/}
                <a href="http://www.adobe.com/go/getflashplayer" className="update_flash"
                   rel="nofollow" target="_blank" title="升级Flash插件">启用flash</a>
                <Button type='primary' className='record_btn' onClick={this.props.faHidePlayer}>关闭</Button>
                <Button type='primary' className='record_btn' onClick={this.clickRecordBtn}>录制</Button>
                <Button type='primary' className='record_btn' onClick={this.stopRecord}>停止</Button>
            </div>
        )
    }
}

export default RecordStream;
