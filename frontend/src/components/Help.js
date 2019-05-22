import React from 'react';
import '../App.css'

class Help extends React.Component {
    render() {
        return (
            <div className="Help">
                <button className="Icon" onClick={this.props.onClick}>Help</button>
            </div>
        );
    }
}

export default Help;
