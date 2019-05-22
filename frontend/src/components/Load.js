import React from 'react';
import '../App.css'

class Load extends React.Component {
    render() {
        return (
            <div className="Load">
                <button className="Icon" onClick={this.props.onClick}>Load</button>
            </div>
        );
    }
}

export default Load;
