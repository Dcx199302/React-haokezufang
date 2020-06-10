// 首页
import React, { Component } from 'react';
// 按需导入轮播图组件
import { Carousel } from 'antd-mobile';
// 搜索
import SearchInput from '../../components/SearchInput';
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: '25px',
                        zIndex: '1',
                        width: '100%',
                        padding: '0 10px',
                    }}
                >
                    <SearchInput></SearchInput>
                </div>
            </div>
        );
    }
}

export default Index;
