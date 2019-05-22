import React from 'react';
import '../App.css'

class Save extends React.Component {
    render() {
        return (
            <div className="Save">
                <button className="Icon" onClick={this.props.onClick}>Save</button>
            </div>
        );
    }
}

export default Save;
