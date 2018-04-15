import * as t from '../constants/actionTypes'
import {createActionThunk} from 'redux-thunk-actions'
import axios from 'axios';
import {assets} from "../utils";

const load = createActionThunk(t.LOAD_DB, () => {
    const loaders = ['armor', 'decorations', 'skills', 'weapons'].map(name => {
        return axios.get(assets(`assets/db/${name}.json`))
    });
    return Promise.all(loaders).then((...resp) => {
        resp.forEach(resp => {
            const data = resp.data;
        })
    })

});

export {
    load
}