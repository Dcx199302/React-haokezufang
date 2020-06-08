// 城市选择
import React, { Component } from 'react';
import { Navbar } from 'antd-mobile';

class CitySlect extends Component {
    state = {};

    componentDidMount() {
        axios.get().then(res => {
            console.log(res);
        });
    }
    render() {
        return (
            <div>
                <Navbar></Navbar>
            </div>
        );
    }
}
