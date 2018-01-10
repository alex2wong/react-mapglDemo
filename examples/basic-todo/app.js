import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux';

let nextId = 1;

class Application extends React.Component {
    // get todos from outer ReactDom.render..
    constructor(props) {
        super(props);
        this.state = {
            todos: [
                {
                    id : 0,
                    text: 'first todo',
                    completed: false
                }
            ]
        }
    }

    componentDidMount() {

    }

    addTodo(action) {
        const {todos} = this.state;
        let newTodos = todos.concat(...[action]);
        this.setState({
            todos: newTodos
            }
        )
    }

    renderItem(todo) {
        return (<li key={todo.id}>
                        id: {todo.id}, content: {todo.text}
                        </li>)
    }

    render() {
        // must return (closed DOM)
        return (<div  >
            <input  />
            <button onClick = {() => {
                this.addTodo({
                    type: 'ADD_TODO',
                    text: 'test',
                    id: nextId ++
                })
            }}>
            ADD_TODO
            </button>
            <ul >
                {this.state.todos.map(todo => {
                    return (
                       <li key={todo.id}>
                        id: {todo.id}, content: {todo.text}
                        </li>
                    )
                })}
            </ul>
        </div>)
    }
}

// out of component Functions !! 
const render = () => {
    ReactDOM.render(<Application />, document.getElementById('container'));
}
render();

