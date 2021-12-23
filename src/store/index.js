import { is_callable, uid } from "../libs/utils";
import DataTable from './DataTable'

export default class Store extends DataTable{
    storeID = "_"+uid()

    state_info ={
        created: Date.now(),
        updated: Date.now(),
    }

    // state = {
        
    //     data: {
    //         // table: {
    //         //     info: {
    //         //         tableId: "",
    //         //         created: "",
    //         //         updated: ""
    //         //     },
    //         //     rows: [
    //         //       {
    //         //          info: {}
    //         //       }
    //         //     ]
    //         // }
    //     },
    //     meta_data: {},
    // }


    // store settings
    settings  = {
        tables: [],
        keys: {},
        methods: {},
        onUpdate: () => {},
        onRead: () => {}
    };


    /**
     * These methods are initial with the table name
     */
    assignableTableMethods = [
        {
            name: 'insert$table',
            method: 'insert'
        },
        {
            name: 'insertAfter$table',
            method: 'insertAfter'
        },
        {
            name: 'insertMany$table',
            method: 'insertMany'
        },
        {
            name: 'update$table',
            method: 'update'
        },
        {
            name: 'move$table',
            method: 'move'
        },
        {
            name: 'count$table',
            method: 'count'
        },
        {
            name: 'delete$table',
            method: 'delete'
        },
        {
            name: 'get$table',
            method: 'get'
        },
        {
            name: 'getAll$table',
            method: 'getAll'
        },
        {
            name: 'get$tableIndex',
            method: 'getIndex'
        },
        {
            name: '$tableTableInfo',
            method: 'tableInfo'
        },
        {
            name: 'observe$table',
            method: 'observeTable'
        }
    ]


    constructor(settings, intialState){
        super()
        this.state = intialState
        this.settingFormate(settings)
        this.assignTables()
        this.assignMethods()

        this.keys = this.settings.keys
        this.tables = this.settings.tables
    }


    /**
     * Formating the settings
     */
    settingFormate(settings){
        for(let s in this.settings){
            if(settings[s]){
                this.settings[s] = settings[s]
            }
        }
    }


    // formating the tables
    assignTables(){
        const {tables} = this.settings
        for(let tb of tables){
            this.createTable(tb)

            for(let {name, method} of this.assignableTableMethods){
                name = name.replace('$table', tb)
                if(!this[name]){
                    this[name]  = (...args) => {
                        return this[method](tb, ...args)
                    }
                }
            }
        }
    }


    assignMethods(){
        const {methods} = this.settings
        for(let name in methods){
            if(!this[name] && is_callable(methods[name])){
                this[name]  = (...args) => {
                    return methods[name].apply(this, args )
                }
            }
        }
    }


    /**
     * store info
     * update date
     */
    storeInfo(){
        return this.state_info
    }


    /**
     * Call everytime when the store is update
     * info is which table and which callback is working
     */
    onUpdateState(info){
        this.state_info.updated = Date.now()
        this.updateTableInfo(info.key)

        const {onUpdate} = this.settings
        if(is_callable(onUpdate)){
            onUpdate(info)
        }
    }


    onReadState(info){
        const {onRead} = this.settings
        if(is_callable(onRead)){
            onRead(info)
        }
    }


    /*
     * getKey
     * @returns read the key from the keys objec
     */

    getKey(name){
        const {keys} = this.settings
        if(keys[name]){
            return keys[name]
        }
    }


    /**
     * 
     * @returns Get The clear data state
     */
    getState(){
        let state = {
            data: {},
            meta_data: this.state.meta_data
        }
        for(let tb in this.state.data){
            // remove unnessary data
            this.query(tb, '@', (row) => {
                delete row.info;
                delete row.isUpdate;
                return row
            })

            state.data[tb] = this.query(tb, '@')
        }

        return state
    }
}