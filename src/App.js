import React from 'react';
import './style/App.scss';

// 引入路由react-router-dom
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

// 联系代理商的方法 connect
import { connect } from 'react-redux';

import getBaiduCity from './utils/baiduMap';

// 页面
import Home from './pages/Home';
import CitySelect from './pages/CitySelect';
import MapFound from './pages/MapFound';
import PageNotFound from './pages/PageNotFound';

class App extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    state = {};
    // 组件生命周期函数
    componentDidMount() {
        // 调用获取定位的方法
        this.props.getCity();
    }

    render() {
        return (
            <div>
                <HashRouter>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/home"></Redirect>
                        </Route>
                        <Route path="/home" component={Home}></Route>
                        <Route path="/cityselect" component={CitySelect}></Route>
                        <Route path="/mapfound" component={MapFound}></Route>
                        <Route exact component={PageNotFound}></Route>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

// 把仓库 state 映射到组件的 props 上的函数
const mapStateToProps = state => ({
    cityName: state.address.city,
});

// 把 dispatch 修改的方法映射到组件 props 上的函数
const mapDispatchToProps = dispatch => ({
    getCity: () => {
        // 百度地图获取城市
        getBaiduCity().then(res => {
            // 可选操作：把 市 字去掉
            // console.log(123);
            res.city = res.city.replace('市', '');
            // 把城市形象作为 action 对象的 value
            const action = {
                type: 'get_city',
                value: res,
            };
            // 通过 dispatch 方法修改仓库的状态
            dispatch(action);
        });
    },
});

// connect 联系 react-redux 代理商，
// 把仓库的 state 和 dispatch 映射到 App 组件的 props 上
export default connect(mapStateToProps, mapDispatchToProps)(App);
