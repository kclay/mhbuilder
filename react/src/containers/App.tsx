import React, {Component} from 'react';
import '../styles/css/style.css';
import {NavBar} from "../components/NavBar";
import {PreviewSection} from "../components/preview";

class App extends Component {
    render() {
        return <React.Fragment>
            <NavBar/>
            <PreviewSection/>
        </React.Fragment>
    }
}

export default App;
