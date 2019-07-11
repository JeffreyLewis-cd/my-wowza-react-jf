import React, {PureComponent} from "react";
import './style/appManageStyle.scss';
import {Button, Form, Icon, Input, notification} from 'antd';
import basicRequest from "../../../http/basicRequest";
import {connect} from 'react-redux';

// import basicRequest from "../../../http/basicRequest";

class AppManage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            appType: 'live',
            submitLoading: false,
        }
    }

    /*切换APP类型*/
    switchAppType(appData) {
        console.log(appData);
        console.log(this.props);
        console.log(this.state);
        this.setState({
            appType: appData
        })
    }


    /*提交创建APP数据*/
    submitApp = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let appParam = {
                    appName: values.username,
                    appType: this.state.appType,
                };
                console.log(appParam);

                this.setState({
                    submitLoading: true,
                });
                basicRequest.addApp(appParam).then((res) => {
                    console.log('添加应用');
                    console.log(res);
                    this.setState({
                        submitLoading: false,
                    });
                    if (res.success) {
                        this.props.ReloadPageSider();  //刷新左侧导航栏
                        const openNotificationWithIcon = type => {
                            notification[type]({
                                message: '成功',
                                description:
                                    '成功添加一个应用！',
                            });
                        };
                        openNotificationWithIcon('success');
                    } else {
                        const openNotificationWithIcon = type => {
                            notification[type]({
                                message: '失败',
                                description:
                                    '添加应用失败！',
                            });
                        };
                        openNotificationWithIcon('error');
                    }

                }).catch((err) => {
                    console.error(err);
                    this.setState({
                        submitLoading: false,
                    });
                    const openNotificationWithIcon = type => {
                        notification[type]({
                            message: '失败',
                            description:
                                '添加应用失败！',
                        });
                    };
                    openNotificationWithIcon('error');
                })

            }
        });
    };


    render() {
        const {ReloadPageSider} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className='app_manage'>
                <h3>添加应用</h3>
                <div className='create_app'>
                    <div className='add_app'>
                        <div className='add_btns_row'>
                            <Button type={'live' === this.state.appType ? 'primary' : ''} icon="video-camera"
                                    size='large' onClick={this.switchAppType.bind(this, 'live')}>
                                添加 "直播" 类应用
                            </Button>
                            <Button type={'VOD' === this.state.appType ? 'primary' : ''} icon="play-circle"
                                    size='large' onClick={this.switchAppType.bind(this, 'VOD')}>
                                添加 "点播" 类应用
                            </Button>
                        </div>
                        <div className='add_app_details'>
                            <Form onSubmit={this.submitApp} className="creat-app-form">
                                <Form.Item label="应用类型" className='creat_app_row select_app_type'>
                                    <span className='text'>
                                        {'live' === this.state.appType ?
                                            <span><Icon type="video-camera"/> 直  播</span>
                                            :
                                            <span><Icon type="play-circle"/> 点  播</span>}</span>
                                </Form.Item>
                                <Form.Item label="应用名称" className='creat_app_row'>
                                    {getFieldDecorator('username', {
                                        rules: [{required: true, message: '请填写应用名称（只能使用英文字母）!'}],
                                    })(
                                        <Input
                                            placeholder="请填写应用名称（只能使用英文字母）!"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                            loading={this.state.submitLoading} className="creat-app-button">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className='about_app'>
                        <p className='text'>
                            应用程序是流式引擎中的一组配置选项，
                            它支持流式内容交付的特定用例。
                            您可以使用这些选项和可配置的属性来优化和修改应用程序的默认流配置。
                            应用程序功能可以通过模块来扩展，
                            这些模块是在加载应用程序实例时动态加载的Java类。
                        </p>
                        <p className='text'>
                            您可以在流式引擎管理器中为六个流式使用案例（如下所述）添加应用程序。若要添加应用程序，请单击与用例对应的页面中的应用程序类型，在“新建应用程序”对话框中输入应用程序的名称，然后单击“添加”。应用程序名称不能包含小于
                            （&lt;）、大于（>）、冒号（：）、引号（‘ 和
                            ”）、正斜杠（/）、反斜杠（\）、管道（）、问号（？），星号（*），双点（..）和波浪线（~）字符。添加应用程序后，流式引擎管理器将显示新的应用程序配置页，以便您可以对其进行修改。
                        </p>
                        <strong>直播</strong>
                        <p className='text'>
                            使用实时应用程序向播放机（单服务器）提供实时流，或作为源服务器向运行媒体服务器或流引擎软件的其他服务器提供实时流，以便将内容传递扩展到大量播放机。
                        </p>
                        <strong>点播</strong>
                        <p className='text'>
                            使用VOD应用程序将视频点播（VOD）文件传输到播放机（单服务器）
                        </p>

                    </div>

                </div>
            </div>
        )
    }
}

//需要渲染什么数据
function mapStateToProps(state) {
    return {
        tiger: state
    }
}

//需要触发什么行为
function mapDispatchToProps(dispatch) {
    return {
        ReloadPageSider: () => dispatch({type: 'reload'})
    }
}


export default Form.create({name: 'normal_login'})(connect(mapStateToProps, mapDispatchToProps)(AppManage));
