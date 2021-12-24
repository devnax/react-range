import React from 'react'
import { initRootStore } from '../helpers/rootStore'
import withStore from './withStore'

const createStore = (Comp, configs) => {
    initRootStore(configs)

    return withStore((props) => {
        return <Comp {...props}/>
    })
}

export default createStore