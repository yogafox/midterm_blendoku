import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';
import Exit from './components/Exit';
import Time from './containers/Time';
import Ans from './components/Ans';
import Save from './containers/Save';
import Load from './containers/Load';
import Prev from './components/Prev';
import Help from './components/Help';
import Tile from './containers/Tile';

class Map {
    constructor(type) {
        this.time = 0;
        this.candidate = [];
        this.ground = [];
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
        this.set()
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
    set = function () {
        this.lockindex = Math.floor(Math.random() * this.count);
        for (let i = 0; i < this.lines.length; i++) {
            for (let j = 0, x = 0; j < this.lines[i].length; j++, x++) {
                if (x === this.lockindex) {
                    this.candidate.push('unfilled');
                    this.ground.push(this.lines[i][j]);
                } else {
                    this.candidate.push(this.lines[i][j]);
                    this.ground.push('unfilled');
                }
            }
        }
        this.shuffle(this.candidate, this.lockindex);
    }
}

class App extends React.Component {
    handleNewGame = () => {
        this.map = new Map(1);
        this.setState({map: this.map});
        this.setState({token: "Last"});
        this.makeTiles();
        this.setState({selected: 'none'});
        this.setState({record: []});
        this.setState({status: "NewGame"});
    };
    handleExitGame = () => {
        this.setState({status: "Welcome"});
    };
    makeTiles = function () {
        let candidateTile = [];
        let groundTile = [];
        for (let x = 0; x < this.map.count; x++) {
            if (x === this.map.lockindex) {
                groundTile.push(<Tile color={this.map.ground[x]} state='lock' place='ground' index={x}
                                  onClick={this.tileOnclick.bind(this)}/>);
                if (this.map.candidate[x] === 'unfilled') {
                    candidateTile.push(<Tile state='unfilled' place='candidate' index={x}
                                         onClick={this.tileOnclick.bind(this)}/>);
                } else {
                    candidateTile.push(<Tile state='filled' color={this.map.candidate[x]} place='candidate' index={x}
                                         onClick={this.tileOnclick.bind(this)}/>);
                }
                continue;
            }
            if (this.map.candidate[x] === 'unfilled') {
                candidateTile.push(<Tile state='unfilled' place='candidate' index={x}
                                     onClick={this.tileOnclick.bind(this)}/>)
            } else {
                candidateTile.push(<Tile state='filled' color={this.map.candidate[x]} place='candidate' index={x}
                                     onClick={this.tileOnclick.bind(this)}/>)
            }
            if (this.map.ground[x] === 'unfilled') {
                groundTile.push(<Tile state='unfilled' place='ground' index={x} onClick={this.tileOnclick.bind(this)}/>)
            } else {
                groundTile.push(<Tile state='filled' color={this.map.ground[x]} place='ground' index={x}
                                  onClick={this.tileOnclick.bind(this)}/>)
            }
        }
        this.setState(() => ({groundTile: groundTile}));
        this.setState(() => ({candidateTile: candidateTile}));
        let now = {
            "candidate": this.map.candidate,
            "ground": this.map.ground
        };
        console.log(now);
        this.setState(() => ({now: now}));
        let record = [now];
        this.setState(() => ({record: record}));
        console.log(this.state.record);
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
        let now = this.state.now;
        let temp = now[placeA][indexA];
        now[placeA][indexA] = now[placeB][indexB];
        now[placeB][indexB] = temp;
        console.log(now);
        this.setState(() => ({now: now}));
        let record = this.state.record;
        console.log(record);
        record.push(now);
        this.setState(() => ({record: record}));
        console.log(this.state.record);
    };
    samecolor = function (colorA, colorB) {
        return (colorA[0] === colorB[0] && colorA[1] === colorB[1] && colorA[2] === colorB[2]);
    }
    checkans = function () {
        for (let i = 0; i < this.state.map.lines.length; i++) {
            for (let j = 0, x = 0; j < this.state.map.lines[i].length; j++, x++) {
                let tile_color = this.state.now["ground"][x];
                let ans_color = this.state.map.lines[i][j];
                console.log(tile_color, ans_color);
                if (this.samecolor(tile_color,ans_color) === false) {
                    console.log("no", tile_color, ans_color);
                    return;
                }
            }
        }
        this.setState({ansTile: this.state.groundTile});
        this.setState({status: "Win"});
    };

    tileOnclick(key) {
        if (this.state.selected !== 'none') {
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

    escapeHTML = function (text) {
        return text.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    tokenHandler = (event) => {
        if (event.keyCode === 13 && event.target.value.trim() !== "") {
            let token = this.escapeHTML(event.target.value.trim());
            this.setState({token: token});
            event.target.value = "";
            if (this.state.direction === "Save") {
                this.Saver(token);
            } else { // Load
                this.Loader(token);
            }
        }
    };

    Saver = (token) => {

        let data = {
            "token" : token,
            "map" : this.state.map,
            "type" : this.state.map.type,
            "time" : this.state.time,
            "count" : this.state.map.count,
            "lockindex" : this.state.map.lockindex,
            "locknum" : this.state.map.locknum,
            "lines" : this.state.map.lines,
            "linenum" : this.state.map.linenum,
            "candidate" : this.state.candidate,
            "ground" : this.state.ground,
            "record" : this.record,
        };
        let str = JSON.stringify(data);
        this.putDataToDB(token, str);
        this.setState({status: "Welcome"});
    };

    Loader = (token) => {
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].token === token) {
                let data = JSON.parse(this.state.data[i].message);
                let map = data.map;
                map.time = data.time;
                this.setState({token: data.token});
                this.setState({time: data.time});
                this.setState({candidate: data.candidate});
                this.setState({ground: data.ground});
                this.setState({map: map});
                this.map = map;
                this.makeTiles();
                this.setState({selected: 'none'});
                this.setState({status: "NewGame"});
            }
        }
    };

    handleSaveGame = () => {
        console.log(this.state.data);
        this.setState({direction: "Save"});
        this.setState({status: "AskToken"});
    };

    handleLoadGame = () => {
        console.log(this.state.data);
        this.setState({direction: "Load"});
        this.setState({status: "AskToken"});
    };

    constructor(props) {
        super(props);
        this.state = {status: "Welcome"};
    }

    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }
    getDataFromDb = () => {
        fetch('http://localhost:3001/api/getData')
            .then((data) => data.json())
            .then((res) => this.setState({ data: res.data }));
    };
    putDataToDB = (token, message) => {
        axios.post('http://localhost:3001/api/putDataToken', {
            token: token,
            message: message,
        });
    };
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
                    <button className="Selector" onClick={this.handleLoadGame}>
                        Load Game
                    </button>
                </div>
            )
        } else if (this.state.status === "NewGame") {
            return (
                <div className="App">
                    <div className="Header">
                        <Exit onClick={this.handleExitGame}/>
                        <Time initTime={+this.state.map.time} callrecv={this.timeReceiver.bind(this)}/>
                        <Ans/>
                    </div>
                    <div className="Candidate" children={this.state.candidateTile}>
                    </div>
                    <div className="Ground" children={this.state.groundTile}>
                    </div>
                    <div className="Footer">
                        <Save onClick={this.handleSaveGame}/>
                        <Load onClick={this.handleLoadGame}/>
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
                    <div className="Message">
                        <p>Success</p>
                    </div>
                    <div className="Ground" children={this.state.ansTile}>
                    </div>
                    <div className="Footer">
                    </div>
                </div>
            );
        } else if (this.state.status === "AskToken") {
            return (
                <div className="App">
                    <div className="Header">
                        <Exit onClick={this.handleExitGame}/>
                    </div>
                    <div className="Message">
                        <p>Name</p>
                        <input className="Token" onKeyUp={this.tokenHandler}/>
                    </div>
                    <div className="Footer">
                    </div>
                </div>
            );
        }
    }
}

export default App;
