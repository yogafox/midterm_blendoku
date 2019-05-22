import React from 'react';
import '../App.css'

class Prev extends React.Component {
    render() {
        return (
            <div className="Prev">
                <button className="Icon" onClick={this.props.onClick}>Prev</button>
            </div>
        );
    }
}

export default Prev;
