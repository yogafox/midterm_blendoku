import React from 'react';
import '../App.css'
import PropTypes from 'prop-types';

class Tile extends React.Component {
    divStyler() {
        if (this.state.status === 'unfilled') {
            return {
                border: `white 2px dashed`,
                backgroundColor: `black`
            };
        }
        else if (this.state.status === 'lock') {
            return {
                border: `red 2px solid`,
                backgroundColor: `rgb(${+this.state.color[0]}, ${+this.state.color[1]}, ${+this.state.color[2]})`
            };
        }
        else {
            return {
                backgroundColor: `rgb(${+this.state.color[0]}, ${+this.state.color[1]}, ${+this.state.color[2]})`
            };
        }
    }
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.setState(
            {status : this.props.state,
                    place : this.props.place,
                    index : this.props.index,
                    color : this.props.color
        });
    }
    callback = (key) => {
        this.setState({status : key.state});
        this.setState({place : key.place});
        this.setState({index : key.index});
        this.setState({color : key.color});
    }

    onClick = (e) => {
        if (this.state.status !== 'lock') {
            let key = {
                "state" : this.state.status,
                "place" : this.state.place,
                "index" : this.state.index,
                "color" : this.state.color,
                "callback" : this.callback
            };
            this.props.onClick(key);

        }
    }
    render() {
        let divStyle = this.divStyler();
        return (
            <button className="Tile" state={this.state.state} style={divStyle} onClick={this.onClick} place={this.state.place} index={this.state.index}>
            </button>
        );
    }
}

Tile.propTypes = {
    color: PropTypes.array
};

export default Tile;
