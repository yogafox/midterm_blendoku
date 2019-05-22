import React from 'react';
import '../App.css'

class Exit extends React.Component {
    render() {
        return (
            <div className="Exit">
                <button className="Icon" onClick={this.props.onClick}>Exit</button>
            </div>
        );
    }
}

export default Exit;
