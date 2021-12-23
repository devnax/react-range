import Store from '../store'

const _rootStore = {
    store: null,
    configs: {}
}

export const initialState = {
    data: {},
    meta_data: {}
}

export const initRootStore = (configs) => {
    if(_rootStore.store) return
    _rootStore.configs = configs

    _rootStore.store = new Store({
        tables: ['Readables'],
    }, initialState)
}


export const getRootConfigs = () => {
    return _rootStore.configs
}

export const useRootStore = () => {
    return _rootStore.store
}

export const dispatchComponents = ({fromRoot, key, type}) => {
    let readables = []
    const rootStore = _rootStore.store
    
    
    if(type === 'meta'){
        if(!key){
            readables = rootStore.getReadables({type: 'meta'})
        }else{
            readables = rootStore.getReadables({type: 'meta', key})

        }
    }else if(type === 'data'){
        readables = rootStore.getReadables({type: 'data', key})
    }

    const dispatches = []
    if(readables){
        for(let readable of readables){
            if(!dispatches.includes(readable.compId)){
                if(readable.compId){
                    readable.dispatch()
                }
                dispatches.push(readable.compId)
            }
        }
    }

    
}

export const insertReadable = ({storeId, key, type, dispatch}) => {
    const rootStore = _rootStore.store
    const exists = rootStore.getReadables({compId: storeId, key, type})

    if(!exists){
        rootStore.insertReadables({
            dispatch: () => dispatch(Math.random()),
            compId: storeId,
            key,
            type
        })
    }
}

export const deleteReadables = (storeId) => {
    const rootStore = _rootStore.store
    rootStore.deleteReadables({compId: storeId})
}