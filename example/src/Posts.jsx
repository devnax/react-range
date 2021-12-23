import React from 'react'
import {withStore, storeID, useConfig} from 'react-range'



const Form = withStore(({store}) => {
    const [meta, setMeta] = store.useMeta('posts_data', {})
    console.log(useConfig())

    return <div>
        <input type="text" onChange={(e) => setMeta({ title: e.target.value })} />
        <button onClick={(e) => {
            store.insertPosts({name: "nax"})
        }}>Add</button>
    </div>
}, () => ({}))



const Posts = ({store}) => {
    // const posts = store.getAllPosts()
    const meta = store.getMeta('posts_data')
    // console.log(meta);
    
    return (
        <div style={{ background: '#f7f8f9', borderRadius: 12, padding: 16, marginTop: 16 }}>
            <h3>Posts</h3>
            <Form />
            <div>
                <ul>
                    {
                       // posts.map((post, idx) => <li key={idx}>{post.title}</li>)
                    }
                    
                </ul>
            </div>
        </div>
    )
}


export default withStore(Posts)