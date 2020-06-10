// 存放Tabber 的页面
import React, { Component } from 'react';
// 路由 Link未使用注意
import { Route, Redirect } from 'react-router-dom';
// ant-UI ：https://mobile.ant.design/components/tab-bar-cn/#components-tab-bar-demo-basic
import { TabBar } from 'antd-mobile';

// 页面组件的引入
import Index from '../Index';
import Found from '../Found';
import My from '../My';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
            hidden: false,
            fullScreen: false,
        };
    }
    // 切换内容
    renderContent(pageText) {
        return (
            <div>
                <h1>{pageText}</h1>
            </div>
        );
    }
    render() {
        return (
            <div>
                <Route exact path="/home">
                    <Redirect to="/home/index"></Redirect>
                </Route>

                <div
                    style={
                        this.state.fullScreen
                            ? { position: 'fixed', height: '100%', width: '100%', top: 0 }
                            : { height: 667 }
                    }
                >
                    {/* TabBer的可设置   https://mobile.ant.design/components/tab-bar-cn/#components-tab-bar-demo-basic  */}
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={this.state.hidden}
                    >
                        <TabBar.Item
                            title="首页"
                            key="首页"
                            icon={<i></i>}
                            selectedIcon={<i></i>}
                            selected={this.state.selectedTab === '/home/index'}
                            onPress={() => {
                                this.props.history.push('/home/index');
                                this.setState((state, props) => {
                                    return {
                                        selectedTab: '/home/index',
                                    };
                                });
                            }}
                        >
                            <Route path="/home/index" component={Index}></Route>
                        </TabBar.Item>
                        <TabBar.Item
                            title="找房"
                            key="找房"
                            icon={<i></i>}
                            selectedIcon={<i></i>}
                            selected={this.state.selectedTab === '/home/found'}
                            onPress={() => {
                                this.props.history.push('/home/found');
                                this.setState((state, props) => {
                                    return {
                                        selectedTab: '/home/found',
                                    };
                                });
                            }}
                        >
                            <Route path="/home/found" component={Found}></Route>
                        </TabBar.Item>
                        <TabBar.Item
                            title="我的"
                            key="我的"
                            icon={<i></i>}
                            selectedIcon={<i></i>}
                            selected={this.state.selectedTab === '/home/my'}
                            onPress={() => {
                                this.props.history.push('/home/my');
                                // 这里有多余的代码
                                this.setState((state, props) => {
                                    return {
                                        selectedTab: '/home/my',
                                    };
                                });
                            }}
                        >
                            <Route path="/home/my" component={My}></Route>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        );
    }
}

export default Home;
