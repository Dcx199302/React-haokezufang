import React from 'react';

import css from './index.module.scss';

import { baseURL } from '../../utils/request';

class HouseItem extends React.Component {
    render() {
        // 父组件传递过来的数据
        // <HouseItem item={} />
        const { item } = this.props;
        return (
            // 空标签不会渲染到页面中
            <>
                <div className={`${css.house_item} house_item`}>
                    {/* 注意这里图片的路径拼接 */}
                    <img
                        className={`${css.house_item_img} house_item_img`}
                        src={baseURL + item.houseImg}
                        alt=""
                    />
                    <div className={css.house_item_info}>
                        <h4 className={css.house_item_info_name}>{item.title}</h4>
                        <div className={css.house_item_info_desc}>{item.desc}</div>
                        <div className={css.house_item_info_label}>
                            {/* 标签渲染 */}
                            {item.tags.map(item2 => (
                                <span key={item2}>{item2}</span>
                            ))}
                        </div>
                        <div className={css.house_item_info_price}>{item.price}</div>
                    </div>
                </div>
            </>
        );
    }
}

export default HouseItem;
