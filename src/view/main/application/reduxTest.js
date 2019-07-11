import React, {PureComponent} from "react";
import {connect} from 'react-redux';

class ReduxTest extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const {PayIncrease, PayDecrease} = this.props;
        return (
            <div className="App">
                <div className="App">
                    <h2>数量为{this.props.tiger}</h2>
                    <button onClick={PayIncrease}>涨</button>
                    <button onClick={PayDecrease}>扣</button>
                </div>
            </div>
        )
    }
}


//需要渲染什么数据
function mapStateToProps(state) {
    return {
        tiger: state
    }
}

//需要触发什么行为
function mapDispatchToProps(dispatch) {
    return {
        PayIncrease: () => dispatch({type: '涨'}),
        PayDecrease: () => dispatch({type: '扣'})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ReduxTest);
