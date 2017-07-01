import React, {PureComponent} from 'react';


const histStyle = {
  position: 'absolute',
  top: 0,
  left: '40px',
  padding: '10px'
}

export default class ControlPanel extends PureComponent {
    // subComponent of App, depend on parent.history_view;
    constructor(props) {
        super(props);
        this.state = {
            name: 'historyViewControl',
        };
    }

    preView() {
        // call the App.setState({viewport: v})
        console.log("go preView" + this);
    }

    nexView() {
        // call the App.setState()
        console.log("go nexView");
    }

    render() {
        return (
            <div style={histStyle}>
                <button onClick={this.preView}>Pre</button>
                <button onClick={this.nexView}>Nex</button>
            </div>
        )
    }
}
