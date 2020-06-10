import React from 'react';
import './style/App.scss';
// import store from './store';

// 引入路由react-router-dom
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

// 页面
import Home from './pages/Home';
import CitySelect from './pages/CitySelect';
import MapFound from './pages/MapFound';
import PageNotFound from './pages/PageNotFound';

// import AntdmTabBar from './demo/AntdmTabBar';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.state = store.getState();
        // console.log(this.state.inputValue);
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

export default App;
