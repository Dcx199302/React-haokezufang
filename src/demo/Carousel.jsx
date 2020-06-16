// 走马灯，轮播图

import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';

import axios from 'axios';

class Slideshow extends Component {
    state = {
        data: [],
        imgHeight: 'auto',
    };
    componentDidMount() {
        axios.get('http://157.122.54.189:9060/home/swiper').then(ret => {
            this.setState({ data: ret.data.body });
        });
    }

    render() {
        return (
            <Carousel
                autoplay={false}
                infinite

                // beforeChange={e => console.log(e)}
                // afterChange={index => console.log(9)}
            >
                {this.state.data.map((value, index) => (
                    <a
                        key={index}
                        // href="http://www.baidu.com"
                        onClick={() => {
                            console.log(index);
                        }}
                        style={{
                            display: 'inline-block',
                            width: '100%',
                            height: this.state.imgHeight,
                        }}
                    >
                        <img
                            src={`http://157.122.54.189:9060` + value.imgSrc}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                        />
                    </a>
                ))}
            </Carousel>
        );
    }
}

export default Slideshow;
