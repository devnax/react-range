import Store from '../store'
import {initialState, getRootConfigs, dispatchComponents} from './rootStore'

const _stack = {
    store: null,
    configs: {}
}

export default () => {
    if(_stack.store) return _stack.store

    const configs = getRootConfigs()

    _stack.store = new Store({
        ...configs,
        onUpdate: ({key, type, callback, ...rest}) => {
            dispatchComponents({key, type})
        },
        onRead: () => {},

    }, initialState)

    return _stack.store
}
