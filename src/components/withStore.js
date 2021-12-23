import React, {useState, useEffect, useMemo } from 'react'
import Store from '../store'
import {initialState, getRootConfigs, insertReadable, dispatchComponents, deleteReadables} from '../helpers/rootStore'
import useStore from '../helpers/useStore'
import { is_callable } from '../libs/utils'

const Render = ({Comp, ...props}) => {
    const [, dispatch] = useState(Math.random().toString())
    const [store, setStore] = useState(false)
    const rootConfigs = getRootConfigs()
    
    useEffect(() => {
        let _store = store

        if(!store){
            _store = new Store({
                ...rootConfigs,
                onUpdate: ({key, type, ...rest}) => {
                    if(is_callable(rootConfigs.onUpdate)){
                        rootConfigs.onUpdate({key, type, ...rest})
                    }
                    dispatchComponents({key, type})
                },
                onRead: ({key, type, ...rest}) => {
                    if(is_callable(rootConfigs.onRead)){
                        rootConfigs.onRead({key, type, ...rest})
                    }
                    insertReadable({storeId: _store.storeID, key, type, dispatch})
                }
                
            }, initialState)

            setStore(_store)
        }
        
        return () => {
            deleteReadables(_store.storeID)
        }
    }, [])

    if(!store){
        return ''
    }

    return <Comp 
        {...props} 
        store={store}
    />
}

export default (Comp, resolve) => {

    if(typeof resolve === 'function'){
        return (props) => {
            let store = useStore()
            let deps  = resolve({...props, store})
            deps      = deps ? deps : props
            return useMemo(() => <Render {...deps} {...props} Comp={Comp} />, Object.values(deps))
        }
    }

    return (props) => <Render {...props} Comp={Comp} />
}