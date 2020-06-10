import React, { Component } from 'react';

import css from './index.module.scss';

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={css.search}>
                <div className={css.search_left}>
                    <div
                        className={css.search_left_city}
                        onClick={() => this.props.history.push('/cityselect')}
                    >
                        {/* 映射完成后通过 props 获取仓库数据 */}
                        {/* <span>{this.props.cityName}</span> */}
                        <span>广州</span>
                        <i className="iconfont icon-arrow"></i>
                    </div>
                    <div className={css.search_left_input}>
                        <i className="iconfont icon-seach"></i>
                        <span>请输入小区或地址</span>
                    </div>
                </div>
                <div className={css.search_map}>
                    {/* 既需要全局的类名，又需要局部类名 */}
                    <i className={`iconfont icon-map ${css.iconfont}`}></i>
                </div>
            </div>
        );
    }
}

export default SearchInput;
