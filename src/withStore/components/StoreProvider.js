import React, {useEffect} from 'react'
import { initRootStore } from '../helpers/rootStore'

const StoreProvider = ({children, configs}) => {
    initRootStore(configs)
    return children
}

export default StoreProvider