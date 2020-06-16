import React from 'react';

import css from './index.module.scss';

// 联系代理商的方法 connect
import { connect } from 'react-redux';

// withRouter 让组件快速拥有路由相关对象的方法
import { withRouter } from 'react-router-dom';

class SearchInput extends React.Component {
    state = {};
    render() {
        return (
            <div className={css.search}>
                <div className={css.search_left}>
                    <div
                        className={css.search_left_city}
                        onClick={() => this.props.history.push('/cityselect')}
                    >
                        {/* 映射完成后通过 props 获取仓库数据 */}
                        <span>{this.props.cityName}</span>
                        <i className="iconfont icon-arrow"></i>
                    </div>
                    <div className={css.search_left_input}>
                        <i className="iconfont icon-seach"></i>
                        <span>请输入小区或地址</span>
                    </div>
                </div>
                {/* 3.0 右侧地图按钮 - 点击跳转到地图找房页 */}
                <div
                    className={css.search_map}
                    onClick={() => this.props.history.push('/mapfound')}
                >
                    {/* 既需要全局的类名，又需要局部类名 */}
                    <i className={`iconfont icon-map ${css.iconfont}`}></i>
                </div>
            </div>
        );
    }
}

// 6.把仓库 state 映射到组件的 props 上的函数
const mapStateToProps = state => ({
    cityName: state.address.city,
});

// 7. 把dispatch 修改的方法映射到组件props上
// const mapDispatchToProps = (dispatch)
//  =>({
//      getCity:()=>{
//          getBaiduCity().then(res=>{
//              const action = {
//                  type:"get_city",
//                  value:res
//              }
//              dispatch(action)
//          })
//      }
//  })

// 5. connect 联系 react-redux 代理商，
// 把仓库的 state 映射到 SearchInput 组件的 props 上
export default connect(mapStateToProps)(withRouter(SearchInput));
