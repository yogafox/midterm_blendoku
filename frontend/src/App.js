import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Exit from './components/Exit';
import Time from './containers/Time';
import Ans from './components/Ans';
import Save from './components/Save';
import Load from './components/Load';
import Prev from './components/Prev';
import Help from './components/Help';
import Tile from './containers/Tile';

class Map {
    constructor(type) {
        this.candidate = [];
        this.ground = [];
        this.time = 0;
        this.type = type;
        this.count = 0;
        this.lines = [];
        this.basenum = 1; // should be determined by type
        this.linenum = 1; // should be determined by type
        this.locknum = 1;
        this.basecolors = [];
        for (let i = 0; i < this.basenum; i++) {
            this.basecolors.push(this.randomcolor());
        }
        for (let i = 0; i < this.linenum; i++) {
            let linelen = Math.floor(Math.random() * 3) + 5;
            let line = this.makeline(linelen, this.basecolors[i]);
            while (line === -1) {
                line = this.makeline(linelen, this.basecolors[i]);
            }
            this.lines.push(line);
        }
    }

    randomcolor = function () {
        let r = Math.floor(Math.random() * 153) + 51;
        let g = Math.floor(Math.random() * 153) + 51;
        let b = Math.floor(Math.random() * 153) + 51;
        return [r, g, b];
    };
    makeline = function (len, basecolor) {
        let line = [basecolor];
        let made = 1;
        let r = basecolor[0];
        let g = basecolor[1];
        let b = basecolor[2];
        let r_step = Math.floor(Math.random() * 30) + 10;
        r_step = (Math.random() > 0.5) ? r_step : -r_step;
        let g_step = Math.floor(Math.random() * 30) + 10;
        g_step = (Math.random() > 0.5) ? g_step : -g_step;
        let b_step = Math.floor(Math.random() * 30) + 10;
        b_step = (Math.random() > 0.5) ? b_step : -b_step;
        while (made < len) {
            r += r_step;
            g += g_step;
            b += b_step;
            if (1 < r && r < 255 && 1 < g && g < 255 && 1 < b && b < 255) {
                made++;
                line.push([r, g, b]);
            } else return -1;
        }
        this.count += made;
        return line;
    };

    shuffle = function (array, lockindex) {
        let counter = array.length;
        while (counter > 2) {
            let index = Math.floor(Math.random() * counter);
            while (index === lockindex) {
                index = Math.floor(Math.random() * counter);
            }
            counter--;
            if (counter === lockindex) {
                counter--;
                continue;
            }
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    };
}

class App extends React.Component {
    makeTiles = function (map) {
        map.lockindex = Math.floor(Math.random() * map.count);
        for (let i = 0; i < map.lines.length; i++) {
            for (let j = 0, x = 0; j < map.lines[i].length; j++, x++) {
                if (x === map.lockindex) {
                    map.candidate.push('unfilled');
                    map.ground.push(map.lines[i][j]);
                } else {
                    map.candidate.push(map.lines[i][j]);
                    map.ground.push('unfilled');
                }
            }
        }
        map.shuffle(map.candidate, map.lockindex);
        let candidate = [];
        let ground = [];
        for (let x = 0; x < map.count; x++) {
            if (x === map.lockindex) {
                ground.push(<Tile color={map.ground[x]} state='lock' place='ground' index={x}
                                  onClick={this.tileOnclick.bind(this)}/>)
                if (map.candidate[x] === 'unfilled') {
                    candidate.push(<Tile state='unfilled' place='candidate' index={x}
                                         onClick={this.tileOnclick.bind(this)}/>)
                } else {
                    candidate.push(<Tile state='filled' color={map.candidate[x]} place='candidate' index={x}
                                         onClick={this.tileOnclick.bind(this)}/>)
                }
                continue;
            }
            if (map.candidate[x] === 'unfilled') {
                candidate.push(<Tile state='unfilled' place='candidate' index={x}
                                     onClick={this.tileOnclick.bind(this)}/>)
            } else {
                candidate.push(<Tile state='filled' color={map.candidate[x]} place='candidate' index={x}
                                     onClick={this.tileOnclick.bind(this)}/>)
            }
            if (map.ground[x] === 'unfilled') {
                ground.push(<Tile state='unfilled' place='ground' index={x} onClick={this.tileOnclick.bind(this)}/>)
            } else {
                ground.push(<Tile state='filled' color={map.ground[x]} place='ground' index={x}
                                  onClick={this.tileOnclick.bind(this)}/>)
            }
        }
        this.setState(() => ({ground: ground}));
        this.setState(() => ({candidate: candidate}));
        this.now = {
            "candidate": map.candidate,
            "ground": map.ground
        };
    };
    exchange = function (placeA, indexA, stateA, colorA, callbackA, placeB, indexB, stateB, colorB, callbackB) {
        let keyA = {
            "state": stateB,
            "color": colorB,
            "place": placeA,
            "index": indexA
        };
        callbackA(keyA);
        let keyB = {
            "state": stateA,
            "color": colorA,
            "place": placeB,
            "index": indexB
        };
        callbackB(keyB);
        let temp = this.now[placeA][indexA];
        this.now[placeA][indexA] = this.now[placeB][indexB];
        this.now[placeB][indexB] = temp;
    };
    checkans = function () {
        console.log("check");
        for (let i = 0; i < this.state.map.lines.length; i++) {
            for (let j = 0, x = 0; j < this.state.map.lines[i].length; j++, x++) {
                let tile_color = this.now["ground"][x];
                let ans_color = this.state.map.lines[i][j];
                console.log(tile_color, ans_color);
                if (tile_color !== ans_color) {
                    console.log("false");
                    return;
                }
            }
        }
        this.setState({ansTile: this.state.ground});
        this.setState({status: "Win"});
    };

    tileOnclick(key) {
        if (this.state.selected !== 'none') {
            console.log(this.state.selected, this.state.sel_index, key.index);
            this.exchange(key.place, key.index, key.state, key.color, key.callback,
                this.state.selected, this.state.sel_index, this.state.sel_state, this.state.sel_color, this.state.sel_callback)
            this.setState({selected: 'none'});
        } else {
            this.setState({selected: key.place});
            this.setState({sel_index: key.index});
            this.setState({sel_state: key.state});
            this.setState({sel_color: key.color});
            this.setState({sel_callback: key.callback});
        }
        this.checkans();
    };

    timeReceiver = (key) => {
        this.time = key.time;
        this.setState({time: key.time});
    };
    handleNewGame = () => {
        let map = new Map(1);
        this.makeTiles(map);
        this.setState({status: "NewGame"});
        this.setState({map: map});
        this.setState({selected: 'none'});
    };
    handleExitGame = () => {
        this.setState({status: "Welcome"});
    };

    constructor(props) {
        super(props);
        this.state = {status: "Welcome"};
    }

    render() {
        if (this.state.status === "Welcome") {
            return (
                <div className="App">
                    <div className="Logo">
                        Blendoku
                    </div>
                    <button className="Selector" onClick={this.handleNewGame}>
                        New Game
                    </button>
                    <button className="Selector">
                        Load Game
                    </button>
                </div>
            )
        } else if (this.state.status === "NewGame") {
            return (
                <div className="App">
                    <div className="Header">
                        <Exit onClick={this.handleExitGame}/>
                        <Time initTime={this.state.map.time} callrecv={this.timeReceiver.bind(this)}/>
                        <Ans/>
                    </div>
                    <div className="Candidate" children={this.state.candidate}>
                    </div>
                    <div className="Ground" children={this.state.ground}>
                    </div>
                    <div className="Footer">
                        <Save/>
                        <Load/>
                        <Prev/>
                        <Help/>
                    </div>
                </div>
            );
        } else if (this.state.status === "Win") {
            return (
                <div className="App">
                    <div className="Header">
                        <Exit onClick={this.handleExitGame}/>
                        <div className="Time">
                            <p className="Timer">
                                {this.state.time}
                            </p>
                        </div>
                    </div>
                    <div className="Candidate">
                    </div>
                    <div className="Ground" children={this.state.ansTile}>
                    </div>
                    <div> You Win
                    </div>
                </div>
            );
        }
    }
}

export default App;
