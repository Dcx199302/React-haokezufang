import React from 'react';
// 1 引入 antd 组件
import { Button } from 'antd-mobile';
import store from './store';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        console.log(this.state.inputValue);
    }
    render() {
        return (
            <div>
                <div style={{ height: '100px' }}></div>
                <br />
                {/* 2 使用 antd 组件 */}
                <p>{this.state.inputValue}</p>
                <Button>按钮</Button>
                <Button icon="check-circle-o" inline size="small" style={{ marginRight: '4px' }}>
                    with icon and inline
                </Button>
            </div>
        );
    }
}
export default App;
