// 城市选择
import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

class CitySelect extends Component {
    state = {};

    componentDidMount() {}
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => console.log('onLeftClick', this.props)}
                >
                    城市选择
                </NavBar>
            </div>
        );
    }
}

export default CitySelect;
