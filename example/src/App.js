import React from 'react'

import { StoreProvider } from 'react-range'


import Posts from './Posts'
import Users from './Users'


const configs = {
  tables: ['Posts', 'Users']
}

const App = () => {
  return <StoreProvider configs={configs}>
    <div style={{width: 800, margin: '20px auto'}}>
      <Posts />
      <Users />
    </div>
  </StoreProvider>
}

export default App
