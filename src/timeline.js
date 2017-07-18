import React, {PureComponent} from 'react';

const itemStyle = {
    // background: '#aaa'
    'listStyle': 'none',
}

const ulistStyle = {
    'width': '180px',
    'position': 'absolute',
    // left 14px... but component still absolute from 0px., left seems mean margin-left.
    'left': '14px',
    'top': '32px',
    'background': '#FFF',
    'boxShadow': '1px 1px 1px rgba(0,0,0,0.3)',
}

export default class Timeline extends PureComponent{
    constructor(props){
        super(props)
    }

    componentDidMount() {
        
    }    

    render() {
        return(
        <div>
            <ul style={ulistStyle}>
                <li className='eventItem' style={itemStyle} onClick={()=>{this.props.handleItem(0)}}>
                    <span>迎接Bride</span>
                </li>
                <li className='eventItem' style={itemStyle} onClick={()=>{this.props.handleItem(1)}}>
                    <span>Wedding Ceremony</span>
                </li>
                <li className='eventItem' style={itemStyle} onClick={()=>{this.props.handleItem(2)}}>
                    <span>Taking Photo</span>
                </li>
            </ul>
        </div>);
    }
}
