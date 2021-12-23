import { is_object, is_array } from "../libs/utils"

export default class MetaData{
    
    addMeta(key, data){
        this.state.meta_data[key] = this.formateRow({meta_value: data})
        this.onUpdateState({key, callback: 'addMeta', type: 'meta'})
    }

    addMetas(metas){
        if(!is_object(metas)){
            return;
        }
        for(let key in metas){
            const data = metas[key]
            this.state.meta_data[key] = this.formateRow({meta_value: data})
        }
        this.onUpdateState({key: false, callback: 'addMetas', type: 'meta'})
    }

    useMeta(key, def){
        return [
            this.getMeta(key, def),
            (value) => {
                this.addMeta(key, value)
            }
        ]
    }

    getMeta(key, def){
        this.onReadState({key, callback: 'getMeta', type: 'meta'})
        const meta = this.state.meta_data[key]
        if(meta){
            return meta.meta_value
        }
        return def
    }

    getMetas(keys, def){
        this.onReadState({key: false, callback: 'getMetas', type: 'meta'})

        if(!is_array(keys)){
            return
        }
        const metas = {}
        for(let key of keys){
            metas[key] = this.state.meta_data[key] || def
        }
        
        return metas
    }

    getAllMeta(){
        this.onReadState({key: false, callback: 'getAllMeta', type: 'meta'})
        return this.state.meta_data
    }

    getMetaInfo(key){
        this.onReadState({key, callback: 'getMetaInfo', type: 'meta'})
        const meta = this.state.meta_data[key]
        if(meta){
            return meta
        }
    }
    
    observeMeta(key){
        const meta = this.state.meta_data[key]
        this.onReadState({key, callback: 'observeMeta', type: 'meta'})
        if(meta){
            return meta.observe
        }
        const row = this.formateRow({meta_value: ''})
        return row.observe
    }

    deleteMeta(key){
        delete this.state.meta_data[key]
        this.onUpdateState({key, callback: 'deleteMeta', type: 'meta'})
    }

    deleteMetas(keys){
        for(let key of keys){
            delete this.state.meta_data[key]
        }
        this.onUpdateState({key: false, callback: 'deleteMetas', type: 'meta'})
    }

    deleteAllMeta(){
        this.state.meta_data = {}
        this.onUpdateState({key: false, callback: 'deleteAllMeta', type: 'meta'})
    }
}