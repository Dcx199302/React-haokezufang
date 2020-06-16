// 默认仓库状态
const defaultState = {
    // 地址对象默认值
    address: {
        // city: xxx
    },
    userInfo: {},
};

// 仓库管理员
//   state     仓库状态
//   action    通过 dispatch 发送的 action
const reducer = (state = defaultState, action) => {
    // 判断 action 的类型
    if (action.type === 'get_city') {
        // 深拷贝
        const newState = JSON.parse(JSON.stringify(state));
        // 把 action 值更新到仓库中
        newState.address = action.value;
        // 返回新的状态
        return newState;
    }
    if (action.type === 'change_city') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.address = action.value;
        return newState;
    }
    return state;
};

export default reducer;
