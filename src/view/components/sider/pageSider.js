import React, {PureComponent} from "react";
import "./pageSider.scss"
import {Icon, Layout, Menu} from 'antd';
import {Link, withRouter} from "react-router-dom";
import basicRequest from "../../../http/basicRequest";
import {connect} from 'react-redux';

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;


class pageSider extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            liveItems: [],
            VODItems: [],
        };

    }


    componentDidMount() {
        this.requestAllApps();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillReceiveProps(nextProps) {
        this.requestAllApps();  //获取所有的应用
    }

    /*获取所有的应用*/
    requestAllApps() {
        basicRequest.getAllApps().then((res) => {
            if (res.serverName) {
                localStorage.setItem('serverName', res.serverName);
            }

            if (res.applications && res.applications.length > 0) {
                let liveList = [];
                let VODList = [];
                res.applications.map((item, index) => {
                    if ("Live" === item.appType) {
                        liveList.push(item);
                    }
                    if ('VOD' === item.appType) {
                        VODList.push(item);
                    }
                });
                this.setState({
                    liveItems: liveList,
                    VODItems: VODList,
                });
            }


        }).catch((err) => {
            console.error(err);
        })

    };

    /*左侧导航栏折叠*/
    onCollapse = collapsed => {
        this.setState({collapsed});
        let mainC = document.getElementById('main-content');

        if (this.state.collapsed) {
            mainC.style.width = "calc(100% - 200px)";

        } else {
            mainC.style.width = "calc(100% - 80px)";
        }
    };

    moveToSubPage = (item) => {
        // console.log(item.key);
    };

    goToPage = (target, param) => {
        if (param && param.id) {
            this.props.history.push({pathname: target, search: param.id, state: {streamInfo: param}},)
        } else {
            this.props.history.push({pathname: target})
        }
    };


    render() {
        let liveElements = this.state.liveItems.map((item, index) => {
            return (
                <SubMenu key={item.href} title={item.id}>
                    <Menu.Item key={item.href + '-01'} onClick={this.goToPage.bind(this, '/liveIncoming', item)}>
                        <span>传入的流</span>
                    </Menu.Item>
                    {/*                 <Menu.Item key={item.href + '-02'} onClick={this.goToPage.bind(this, '/livePush', item)}>
                        <span>其他</span>
                    </Menu.Item>*/}
                </SubMenu>
            )
        });

        let VODElements = this.state.VODItems.map((item, index) => {
            return (
                <SubMenu key={item.href} title={item.id}>
                    <Menu.Item key={item.href + '-01'}> <Link to='/livePush'>测试01</Link></Menu.Item>
                    <Menu.Item key={item.href + '-02'}> <Link to='/livePush'>测试02</Link></Menu.Item>
                </SubMenu>
            )
        });


        return (

            <Sider collapsible collapsed={this.state.collapsed} className='wowza_page_sider'
                   onCollapse={this.onCollapse}>
                <div className="logo"/>

                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.moveToSubPage}>
                    <Menu.Item key="1" onClick={this.goToPage.bind(this, '/appManage')}>
                        <Icon type="appstore"/>
                        <span>
                          应用管理
                        </span>
                    </Menu.Item>
                    <SubMenu
                        className='live-box'
                        key="sub1"
                        title={
                            <span>
                                     <Icon type="video-camera"/>
                                      <span>直播</span>
                                    </span>
                        }
                    >
                        {
                            liveElements
                        }

                    </SubMenu>
                    <SubMenu
                        className='VOD-box'
                        key="sub2"
                        title={
                            <span>
                                    <Icon type="play-circle"/>
                                      <span>点播</span>
                                    </span>
                        }
                    >
                        {
                            VODElements
                        }

                    </SubMenu>
                    <SubMenu
                        className='MyWebSocket-box'
                        key="sub3"
                        title={
                            <span>
                              <Icon type="phone"/>
                              <span>全双工通信</span>
                            </span>
                        }
                    >
                        <Menu.Item key={'sub3-1'}> <Link to='/myWebSocket'>全双工测试</Link></Menu.Item>

                    </SubMenu>

                </Menu>
            </Sider>

        )
    }


}


//需要渲染什么数据
function mapStateToProps(state) {
    return {
        // pubState: state
        reloadSidePage: state
    }
}

//需要触发什么行为
function mapDispatchToProps(dispatch) {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(pageSider));
