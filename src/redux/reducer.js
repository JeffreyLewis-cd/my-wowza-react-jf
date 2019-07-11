var reloadSidePage = false;

//这是reducer
const reducer01 = (state = reloadSidePage, action) => {
    switch (action.type) {
        case 'reload':
            state = !state;
            return state;
        default:
            return state;
    }
};


export default reducer01;
