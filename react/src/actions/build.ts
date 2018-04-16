import actionCreatorFactory from 'typescript-fsa';
import {Build} from "../common";
import * as t from '../constants/actionTypes'

const actionCreator = actionCreatorFactory();


const loadBuild = actionCreator<Build>(t.LOAD_BUILD);



export {
    loadBuild
}