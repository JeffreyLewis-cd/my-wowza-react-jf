import React, {PureComponent} from "react";
import {Card, Empty, Icon} from "antd";
import baseMethods from "../../../http/baseMethods";
import StopAndDelete from "./stopAndDelete";

class StreamCard extends PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
    }

    /*RTMP_URL*/
    RTMP_URL(a, streamName) {
        let RTMP_url = 'rtmp://' + baseMethods.wowzaIP + ':1935/' +
            this.props.faParamId + '/' + streamName;
        return RTMP_url;
    }

    /*HLS_URL*/
    HLS_URL(a, streamName) {
        let HLS_url = 'http://' + baseMethods.wowzaIP + ':1935/' +
            this.props.faParamId + '/' + streamName + '/playlist.m3u8';
        return HLS_url;
    }


    render() {
        let incomingStr = <Empty className='empty_element'/>;
        let yesIcon = <Icon type="check" style={{color: '#19be6b'}}/>;
        let noIcon = <Icon type="close" style={{color: '#ed3f14'}}/>;


        if (this.props.faIncomingStrms.length > 0) {
            incomingStr = this.props.faIncomingStrms.map((item, index) => {
                return (
                    <Card size="small" title={'应用名：' + item.name} key={index}
                          extra={
                              <StopAndDelete
                                  streamInfo={item}
                                  appName={this.props.faParamId}
                                  streamName={item.name}
                                  refreshStreamList={this.props.faRequestIncomingStreams}
                              />}
                          className={(item.name === this.props.faActiveCard) ?
                              "stream_card active_stream_card" : 'stream_card'}
                    >
                        {
                            (item.name === this.props.faActiveCard) ?
                                <p className='checked'><Icon type="check" style={{color: '#ffffff'}}/></p>
                                : null
                        }


                        <p className="app_info">
                            <span className="app_info_title">应用实例：</span>
                            <span className="app_info_value">{item.applicationInstance}</span>
                        </p>
                        <p className="app_info">
                            <span className="app_info_title">是否连接：</span>
                            <span className="app_info_value">
                                {item.isConnected ? yesIcon : noIcon}</span>
                        </p>
                        <p className="app_info">
                            <span className="app_info_title">RTMP：</span>
                            <span className="app_info_value click_to_play"
                                  onClick={this.props.faPlayRTMP.bind(this, {
                                      name: item.name,
                                      actURL: this.RTMP_URL(this, item.name)
                                  })}>
                                {this.RTMP_URL(this, item.name)}</span>
                        </p>
                        <p className="app_info">
                            <span className="app_info_title">HLS：</span>
                            <span className="app_info_value click_to_play"
                                  onClick={this.props.faPlayHLS.bind(this, {
                                      name: item.name,
                                      actURL: this.HLS_URL(this, item.name)
                                  })}>
                                 {this.HLS_URL(this, item.name)}</span>
                        </p>
                        <p className="app_info">
                            <span className="app_info_title">Android/Other：</span>
                            <span className="app_info_value">
                                {'rtsp://' + baseMethods.wowzaIP + ':1935/' +
                                this.props.faParamId + '/' + item.name}</span>
                        </p>
                        <p className="app_info">
                            <span className="app_info_title">源地址：</span>
                            <span className="app_info_value">{item.sourceIp}</span>
                        </p>
                    </Card>
                )
            });
        }


        return incomingStr;
    }
}

export default StreamCard;
