import createStore from './components/createStore'
import withStore from './components/withStore'
import useStore from './helpers/useStore'
import {getRootConfigs, useRootStore} from './helpers/rootStore'

import {
    uid, 
    is_object, 
    is_string, 
    is_array, 
    in_array, 
    is_number, 
    is_callback, 
    is_callable, 
    is_define, 
    is_null
} from "./libs/utils";

const useConfig = () => getRootConfigs()
const storeID = () => useRootStore().storeID


export {
    uid, 
    is_object, 
    is_string, 
    is_array, 
    in_array, 
    is_number, 
    is_callback, 
    is_callable, 
    is_define, 
    is_null,

    createStore,
    withStore,
    useStore,
    useConfig,
    storeID
}