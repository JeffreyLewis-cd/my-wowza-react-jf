import React, {PureComponent} from "react";
import {withRouter} from "react-router-dom";
import {Button, Input, message, Modal, Popconfirm} from "antd";
import baseMethods from "../../../http/baseMethods";
import basicRequestAPI from "../../../http/basicRequest";


class AddressAddRefresh extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            addStreamModel: false,
        }
    }


    /*展示新增流文件对话框*/
    showAddStream() {
        this.setState({
            addStreamModel: true
        })
    };

    /*取消新增流文件*/
    cancelAddStream() {
        this.setState({
            addStreamModel: false
        })
    }


    /*确认新增流文件*/
    confirmAddStream() {
        let sName = document.getElementById('typeInStreamName').value;
        if (sName.length > 0 && this.props.faParamId.length > 0) {
            let sParam = {
                streamName: sName,
                appName: this.props.faParamId,
            };
            basicRequestAPI.addStream(sParam).then((res) => {
                if (res.success) {
                    message.success('成功新增流文件');
                    this.props.faGetAppStreamList(); //获取流文件列表
                    this.setState({
                        addStreamModel: false
                    })
                }
            }).catch((err) => {
                console.error(err);
                this.setState({
                    addStreamModel: false
                })
            })
        }

    };

    /*确认删除应用*/
    confirmDeleteApp = () => {
        console.log('确认删除应用');
        console.log(this.props.faParamId);
        if (this.props.faParamId) {
            let param = {
                app: this.props.faParamId,
            };
            basicRequestAPI.deleteOneApp(param).then((res) => {
                console.log(res);
                if (res.success) {
                    this.props.history.push({pathname: '/appManage'})
                }
            }).catch((err) => {
                console.error(err);
            })
        }
    };


    render() {

        return (
            <div className='app_address'>
                <div className='incoming_src'>
                    <div className='input_btn'>
                        {
                            this.props.faReloadElement ? null :
                                <Input addonBefore="播放地址" id='stream_src'
                                       allowClear defaultValue={this.props.faActiveStream}/>
                        }

                    </div>
                    <Button type="primary" onClick={this.props.faInputSource.bind(this)}
                    >确定</Button>

                </div>
                <div className='title_refresh'>
                    <h3>
                        <span>流文件列表  (</span>
                        <span>应用地址：
                                    <span>{baseMethods.wowzaIP + ':1935/' + this.props.faParamId}</span>
                                )</span>
                    </h3>
                    <div>
                        <Button onClick={this.showAddStream.bind(this)}
                                type="primary" className='create_stream'>
                            新建流文件
                        </Button>
                        <Modal
                            title="请输入流文件名字"
                            visible={this.state.addStreamModel}
                            onOk={this.confirmAddStream.bind(this)}
                            onCancel={this.cancelAddStream.bind(this)}
                        >
                            <Input id='typeInStreamName' placeholder="只能使用英文字母或者阿拉伯数字"/>
                        </Modal>

                        <Button type="primary" onClick={this.props.faRequestIncomingStreams.bind(this)}
                                className='refresh' loading={this.props.faRefresh_loading}>刷新</Button>
                        <Popconfirm
                            title={'确定要停用 ' + this.props.faParamId + " 吗?"}
                            onConfirm={this.confirmDeleteApp}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="danger">停用流</Button>

                        </Popconfirm>

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AddressAddRefresh);
