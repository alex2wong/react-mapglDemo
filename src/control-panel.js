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
        // this.state = {
        //     name: 'historyViewControl',
        // };        
    }

    componentDidMount() {
        document.querySelector("#target").addEventListener("dblclick", function(evt){
            evt.cancelBubble = true;
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            console.log("dbclick count..");
            return;            
        });
    }

    preView() {
        // call the App.setState({viewport: v})
        console.log("go preView, com props: " + this.props);
    }

    nexView() {
        // call the App.setState()
        console.log("go nexView");
    }

    // render(){} ... render func is built func for Component? 
    render() {
        return (
            <div style={histStyle}>
                <a href="#" className="btn" onClick={() => this.props.pFunc(0)}>Pre</a>
                <a href="#" className="btn" onClick={() => this.props.pFunc(1)}>Nex</a>
                <a href="#" className="btn" id="target" 
                    onClick={(evt) => this.props.goPolyLayer(evt)} >PolyLayer</a>
            </div>
        )
    }
}
