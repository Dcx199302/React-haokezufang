// 导入 react
import React from 'react';

// 按需导入轮播图组件
import { Carousel } from 'antd-mobile';

// 导入自己封装 request
import { request, baseURL } from '../../utils/request';

// 把图片作为 JS 文件导入
import img01 from '../../assets/images/nav-1.png';
import img02 from '../../assets/images/nav-2.png';
import img03 from '../../assets/images/nav-3.png';
import img04 from '../../assets/images/nav-4.png';

// 导入局部样式
import css from './index.module.scss';

// 搜索框组件导入
import SearchInput from '../../components/SearchInput';

class Index extends React.Component {
    state = {
        // 轮播图数据
        swiperData: [],
        groupsData: [],
        newsData: [],
        // 原图是 750/424，按照比例推算是 100vw/56.53vw
        imgHeight: '56.53vw',
        // 安排一个数组用于导航入口列表渲染
        entryData: [
            { id: 1, text: '整租', img_src: img01 },
            { id: 2, text: '合租', img_src: img02 },
            { id: 3, text: '地图找房', img_src: img03 },
            { id: 4, text: '去出租', img_src: img04 },
        ],
    };

    // 生命周期函数
    componentDidMount() {
        // 通过 axios 发送请求
        this.getSwiperData();
        this.getGroupsData();
        this.getNewsData();
    }
    // 获取轮播图数据
    getSwiperData() {
        request.get('/home/swiper').then(res => {
            // console.log(res.data.body);
            // 更新页面数据
            this.setState({ swiperData: res.data.body });
        });
    }
    // 获取租房小组数据
    getGroupsData() {
        //
        request.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0').then(res => {
            // console.log(res.data.body);
            this.setState({ groupsData: res.data.body });
        });
    }
    // 获取最新资讯
    getNewsData() {
        request.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0').then(res => {
            this.setState({ newsData: res.data.body });
        });
    }

    render() {
        // 结构 state 数据，使用的时候就可以像之前的模板语法那样使用变量了
        const { imgHeight, swiperData, entryData, groupsData, newsData } = this.state;
        return (
            <section className={css.index}>
                {/* 1.0 轮播图模块 */}
                <div style={{ height: imgHeight }}>
                    <div className={css.search_index}>
                        {/* 搜索框组件，通过普通方式使用，默认没有路由相关的对象 */}
                        {/* <SearchInput history={this.props.history}></SearchInput> */}
                        <SearchInput></SearchInput>
                    </div>
                    {
                        // 如果有轮播图数据，就渲染轮播图结构
                        // !! 取反再取反，相当于 Boolean() 的简写，可以把数据快速转换成布尔类型
                        // react 的布尔类型不展示到页面中
                        !!swiperData.length && (
                            <Carousel autoplay infinite>
                                {swiperData.map(item => (
                                    <a
                                        key={item.id}
                                        href="http://www.alipay.com"
                                        style={{
                                            display: 'inline-block',
                                            width: '100%',
                                            height: imgHeight,
                                        }}
                                    >
                                        <img
                                            // 注意路径拼接
                                            src={baseURL + item.imgSrc}
                                            alt=""
                                            style={{ width: '100%', verticalAlign: 'top' }}
                                            onLoad={() => {
                                                // fire window resize event to change height
                                                // 图片加载完毕后，或者浏览器大小改变时，自动调整图片高度
                                                window.dispatchEvent(new Event('resize'));
                                                this.setState({ imgHeight: 'auto' });
                                            }}
                                        />
                                    </a>
                                ))}
                            </Carousel>
                        )
                    }
                </div>
                {/* 2.0 首页入口模块 */}
                <div className={css.entry}>
                    {entryData.map(item => (
                        <div key={item.id} className={css.entry_item}>
                            {/* 注意图片有坑，不能直接使用相对路径 */}
                            <img src={item.img_src} alt="" className={css.entry_item_img} />
                            <span className={css.entry_item_text}>{item.text}</span>
                        </div>
                    ))}
                </div>
                {/* 3.0 租房小组模块 */}
                <div className={css.group}>
                    <div className={css.group_head}>
                        <h3>租房小组</h3>
                        <span>更多</span>
                    </div>
                    <div className={css.group_body}>
                        {/* 列表渲染 */}
                        {groupsData.map(item => (
                            <div key={item.id} className={css.group_body_item}>
                                <div className={css.group_body_item_info}>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                                <img
                                    alt=""
                                    src={baseURL + item.imgSrc}
                                    className={css.group_body_item_img}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* 4.0 最新资讯 */}
                <div className={css.news}>
                    <h3 className={css.news_head}>最新资讯</h3>
                    <div className={css.news_list}>
                        {/* 列表渲染 */}
                        {newsData.map(item => (
                            <div key={item.id} className={css.news_item}>
                                <img
                                    src={baseURL + item.imgSrc}
                                    alt=""
                                    className={css.news_item_img}
                                />
                                <div className={css.news_item_info}>
                                    <h4>{item.title}</h4>
                                    <p>
                                        <span>{item.from}</span>
                                        <span>{item.date}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}

export default Index;
