import { createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { authReducer } from "./reducers/userReducers";
import { postReducers } from "./reducers/postReducers";
const reducers = combineReducers({
    auth: authReducer,
    post: postReducers
})

let initialState = {}

const middlware = [thunk];
const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middlware)));
export default store;