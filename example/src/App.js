import React from 'react'

import { createStore } from 'react-range'


import Posts from './Posts'
import Users from './Users'


const configs = {
  tables: ['Posts', 'Users']
}

const App = ({store}) => {
  const posts = store.getAllPosts()
  return <div style={{width: 800, margin: '20px auto'}}>
      <Posts />
      <Users />
    </div>
}

export default createStore(App, configs)
