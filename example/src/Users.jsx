import React from 'react'
import { withStore } from 'react-range'


const Users = ({store}) => {
    const posts = store.getAllPosts()
    console.log("I Am from Users");


    return (
        <div style={{background: '#f7f8f9', borderRadius: 12, padding: 16, marginTop: 16}}>
            <h3>Users</h3>
            <div>
                <input type="text" />
                <button>Add</button>
            </div>
            <div>
                <ul>
                    <li>Users</li>
                    <li>Wow</li>
                </ul>
            </div>
        </div>
    )
}



export default withStore(Users)