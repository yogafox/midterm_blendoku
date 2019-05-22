import React from 'react';
import '../App.css'

class Ans extends React.Component {
    render() {
        return (
            <div className="Ans">
                <button className="Icon" onClick={this.props.onClick}>Ans</button>
            </div>
        );
    }
}

export default Ans;
