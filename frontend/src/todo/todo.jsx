import React, { Component} from 'react'
import Pageheader from '../template/pageheader';
import TodoForm from './todoForm';
import TodoList from './todoList';
import axios from 'axios'


const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component{

    constructor(props){
        super(props)
        this.state = {description: '', list: [] }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearch= this.handleSearch.bind(this)
        this.refresh()
    }

    refresh (description){
        const search = description ? '&description__regex=/'+description+'/':'';
        
        axios.get(URL+'?sort=-createdAt'+search).then(resp => this.setState  ({...this.state,description: description, list: resp.data}))
    }
    handleSearch (){
        this.refresh(this.state.description)
    }
    handleAdd(){
        const description =  this.state.description
        axios.post(URL,{description}).then(resp=> this.refresh())
    }
    handleChange(e){
         this.setState  ({...this.state,description: e.target.value})
    }
    
    handleRemove(todo){
        axios.delete(URL+'/'+todo._id).then(resp=> this.handleSearch())
    }

    handleMarkAsDone(todo){
        axios.put(URL+'/'+todo._id,{...todo,done:true}).then(resp=> this.handleSearch())
    }

    handleMarkAsPending(todo){
        axios.put(URL+'/'+todo._id,{...todo,done:false}).then(resp=> this.handleSearch())
    }

    render(){
        return(
            <div>
                <Pageheader name='Tarefas' small='Cadastro'></Pageheader>
                <TodoForm description={this.state.description} 
                        handleAdd={this.handleAdd}
                        handleSearch={this.handleSearch}
                        handleChange={this.handleChange}
                        />
                <TodoList list={this.state.list} 
                          handleMarkAsDone={this.handleMarkAsDone} 
                          handleMarkAsPending={this.handleMarkAsPending} 
                          handleRemove={this.handleRemove}/>
            </div>
        )
    }
}
