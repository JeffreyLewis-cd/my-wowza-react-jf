import React, {PureComponent} from "react";
import {Button, Form, Icon, Input, message, Modal, Popconfirm, Select, Table, Tooltip} from "antd";
import "./style/liveStyle.scss";
import basicRequestAPI from "../../../http/basicRequest";

const {Option} = Select;

class StopAndDelete extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addTargetVisible: false,
            targetListVisible: false,
            dataSource: [],
            columns: [
                {
                    title: '目标IP',
                    dataIndex: 'host',
                    key: 'host',
                },
                {
                    title: '目标应用名',
                    dataIndex: 'application',
                    key: 'application',
                    width: 150
                },
                {
                    title: '目标流文件名',
                    dataIndex: 'streamName',
                    key: 'streamName',
                    width: 300
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => (
                        <div>
                            <Popconfirm
                                title="确定要删除吗?"
                                onConfirm={this.deleteOneTarget.bind(this, record)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button size='small' type='danger'>删除</Button>
                            </Popconfirm>
                        </div>
                    ),
                },
            ],
            tableVisible: true,
            tablePager: {
                'defaultPageSize': '5'
            }
        }
    }

    componentDidMount() {
    }

    /*确定连接流文件*/
    confirmConnectStream = () => {
        let param = {
            app: this.props.appName,
            streamname: this.props.streamName
        };
        basicRequestAPI.connectStream(param).then((res) => {
            if (res && res.success) {
                message.success('连接成功！');
                setTimeout(() => {
                    this.props.refreshStreamList();  //刷新流文件列表
                }, 500)
            }
        }).catch((err) => {
            console.error(err);
        })
    };

    /*确定断开流文件*/
    confirmStopStream = () => {
        let param = {
            app: this.props.appName,
            streamname: this.props.streamName + '.stream',
        };

        // this.stopOneWapp(param);//停止一个应用

        basicRequestAPI.disconnectStream(param).then((res) => {
            if (res && res.success) {
                message.success('停用成功！');
                this.props.refreshStreamList();  //刷新流文件列表
            }
        }).catch((err) => {
            console.error(err);
        })

    };

    /*停止一个应用*/
    stopOneWapp = (appPram) => {
        basicRequestAPI.stopOneApp(appPram).then((res) => {
            this.props.refreshStreamList();  //刷新流文件列表
        }).catch((err) => {
            console.error(err);
            this.props.refreshStreamList();  //刷新流文件列表
        })
    };


    /*确定删除流文件*/
    confirmDeleteStream = () => {
        let param = {
            app: this.props.appName,
            streamname: this.props.streamName
        };
        basicRequestAPI.deleteStream(param).then((res) => {
            if (res && res.success) {
                message.success('删除成功！');
                setTimeout(() => {
                    this.props.refreshStreamList();  //刷新流文件列表
                }, 500);
            }
        }).catch((err) => {
            console.error(err);
        })
    };

    /*转发一个流文件*/
    forwardToStreamTarget = () => {
        this.setState({
            addTargetVisible: true,
        }, () => {
            this.getAppAdvancedSets(); //获取应用高级设置
        })
    };

    /*获取应用高级设置*/
    getAppAdvancedSets = () => {
        let param = {
            app: this.props.appName,
        };
        basicRequestAPI.appAdvancedSettings(param).then((res) => {
            console.log('获取应用高级设置');
            console.log(res);
            let resApp = JSON.parse(JSON.stringify(res));
            console.log(resApp.advancedSettings);
            console.log(resApp.modules);
            let enableOrNot = false;
            for (let key = 0; key < res.modules.length; key++) {
                if ('ModulePushPublish' === res.modules[key].name) {
                    console.log('不需要开启');
                    enableOrNot = false;
                    break;
                } else {
                    enableOrNot = true;
                    console.log('需要开启');
                }
            }

            if (enableOrNot) {
                let push01 = {
                    "enabled": true,
                    "canRemove": false,
                    "name": "pushPublishMapPath",
                    "value": "${com.wowza.wms.context.VHostConfigHome}/conf/${com.wowza.wms.context.Application}/PushPublishMap.txt",
                    "defaultValue": null,
                    "type": "String",
                    "sectionName": "Application",
                    "section": "/Root/Application",
                    "documented": false
                };
                let push02 = {
                    "order": res.modules.length,
                    "name": "ModulePushPublish",
                    "description": "ModulePushPublish",
                    "class": "com.wowza.wms.pushpublish.module.ModulePushPublish"
                };

                resApp.advancedSettings.push(push01);
                resApp.modules.push(push02);

                let finalParam = {
                    app: this.props.appName,
                    enableParam: {
                        "version": resApp.version,
                        "serverName": resApp.serverName,
                        "advancedSettings": resApp.advancedSettings,
                        "modules": resApp.modules
                    },
                };
                console.log(finalParam);

                basicRequestAPI.enableAppTarget(finalParam).then((res) => {
                    console.log('开启target');
                    console.log(res);
                    basicRequestAPI.restartApp({app: this.props.appName,}).then((res) => {
                        console.log('重启应用');
                        console.log(res);
                    })
                }).catch((err) => {
                    console.error(err);
                })
            }


        }).catch((err) => {

        })
    };

    /*获取stream target list*/
    requestAppStreamTargetList = () => {
        let param = {
            app: this.props.appName,
        };
        basicRequestAPI.getAppStreamTargetList(param).then((res) => {
            console.log('获取stream target list');
            console.log(res);
            if (res.mapEntries) {
                let newData = [];
                if (res.mapEntries.length > 0) {
                    res.mapEntries.map((item, index) => {
                        if (this.props.streamName === item.sourceStreamName) {
                            newData.push(item);
                            newData[index]['key'] = index;
                        }
                    });
                }

                this.setState({
                    dataSource: newData
                })
            }
        }).catch((err) => {

        })
    };

    /*确认转发流文件*/
    confirmAddTarget = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = values;
                param.app = this.props.appName;
                param.sourceStreamName = this.props.streamName;
                console.log('确认转发流文件');
                console.log(param);
                basicRequestAPI.addAppStreamTarget(param).then((res) => {
                    if (res.success) {
                        message.success('转发成功！');
                    }
                    this.setState({
                        addTargetVisible: false,
                    })
                }).catch((err) => {
                    this.setState({
                        addTargetVisible: false,
                    })
                })
            }
        });
    };

    /*取消转发流文件*/
    cancelAddTarget = () => {
        this.setState({
            addTargetVisible: false,
        })
    };

    /*展示转发流文件列表*/
    showTargetList = () => {
        this.requestAppStreamTargetList();
        this.setState({
            targetListVisible: true,
        })
    };

    /*隐藏转发流文件列表*/
    hideTargetList = () => {
        this.setState({
            targetListVisible: false,
        })
    };

    /*删除一个转发*/
    deleteOneTarget = (param) => {
        console.log(param);
        let deleteParam = param;
        deleteParam.app = this.props.appName;
        deleteParam.sourceStreamName = this.props.streamName;
        basicRequestAPI.deleteAppStreamTarget(deleteParam).then((res) => {
            console.log(res);
            if (res.success) {
                this.requestAppStreamTargetList(); //获取stream target list
                this.setState({
                    tableVisible: false,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                                tableVisible: true,
                            }
                        );
                        console.log(this.state.dataSource);
                    }, 500)
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        let stopConnect = <Popconfirm
            title="您确定要停用流文件吗?"
            onConfirm={this.confirmStopStream}
            okText="确定"
            cancelText="取消">
            <Button size='small' className='small-btn'>停用</Button>

        </Popconfirm>;
        let connectStream = <Popconfirm
            title="您确定要连接流文件吗?"
            onConfirm={this.confirmConnectStream}
            okText="确定"
            cancelText="取消">
            <Button size='small' className='small-btn' type="primary">连接</Button>

        </Popconfirm>;

        let connectOrDis = this.props.streamInfo.isConnected ? stopConnect : connectStream;

        return (
            <div className='stop-and-delete'>
                <Button type="" size='small' className='small-btn'
                        onClick={this.showTargetList}>转发列表</Button>
                <Button type="primary" size='small' className='small-btn'
                        onClick={this.forwardToStreamTarget}>转发</Button>
                {
                    this.props.streamInfo.deletable ? connectOrDis : null
                }

                <Popconfirm
                    title="您确定要删除流文件吗?"
                    onConfirm={this.confirmDeleteStream}
                    okText="确定"
                    cancelText="取消"
                >
                    {
                        this.props.streamInfo.deletable ?
                            <Button type="danger" size='small' className='small-btn'>删除</Button>
                            : null
                    }
                </Popconfirm>

                {/*新增一个转发流文件*/}
                <Modal
                    title="转发流文件"
                    visible={this.state.addTargetVisible}
                    onOk={this.confirmAddTarget}
                    onCancel={this.cancelAddTarget}
                >
                    <Form labelCol={{span: 8}} wrapperCol={{span: 12}}>
                        <Form.Item label="目标IP">
                            {getFieldDecorator('host', {
                                rules: [{required: true, message: '请输入目标IP!'}],
                            })(<Input placeholder="182.151.49.151"/>)}
                        </Form.Item>
                        <Form.Item label="目标应用名">
                            {getFieldDecorator('application', {
                                rules: [{required: true, message: '请输入目标应用名!'}],
                            })(<Input placeholder="live"/>)}
                        </Form.Item>

                        <Form.Item label={
                            <span>
                              目标流文件名&nbsp;
                                <Tooltip
                                    title="如果需要auth_key验证身份，请直接拼接在目标流文件名后面。例如：targetStreamName?auth_key=1562812791-0-0-ab4b44fc52e83b3fd5042aabef0c30f9">
                                <Icon type="question-circle-o"/>
                              </Tooltip>
                            </span>
                        }>
                            {getFieldDecorator('entryName', {
                                rules: [{required: true, message: '请输入目标流文件名!'}],
                            })(<Input placeholder="targetStreamName"/>)}
                        </Form.Item>
                        <Form.Item label="用户名">
                            {getFieldDecorator('userName', {
                                rules: [{required: false, message: '请输入目标用户名!'}],
                            })(<Input placeholder="userName"/>)}
                        </Form.Item>

                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{required: false, message: '请输入目标密码!'}],
                            })(<Input placeholder=""/>)}
                        </Form.Item>

                    </Form>
                </Modal>

                {/*转发流文件列表*/}
                <Modal
                    width="900px"
                    title={this.props.appName + '/' + this.props.streamName + '转发流文件列表'}
                    visible={this.state.targetListVisible}
                    onOk={this.hideTargetList}
                    onCancel={this.hideTargetList}
                >
                    {
                        this.state.tableVisible ?
                            <Table dataSource={this.state.dataSource}
                                   columns={this.state.columns}
                                   pagination={this.state.tablePager}/>
                            : null
                    }
                </Modal>
            </div>
        );
    }
}

export default Form.create()(StopAndDelete);
