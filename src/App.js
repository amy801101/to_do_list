require('../stylesheets/app.scss');
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link, RouteHandler } from 'react-router';

export class Content extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			category: 0
		};
	}
	componentWillMount(){
		this.setState({
			category: this.props.params.id
		});
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps !== this.props){
			this.setState({
				category: this.props.params.id
			});
		}
	}
	changeCategory(id, event){
		this.setState({
			category: id
		});
	}
	render(){
		return(
			<TodoContent category={this.state.category}/>
	    );
	}
}

class CategoryTab extends React.Component{
	constructor(){
		super();
	}
	render(){
		return (
			<div className="category_tab"> 
				<Category id={0} name="All" />
				<Category id={1} name="Starred" />
				<Category id={2} name="Actived" />
				<Category id={3} name="Completed" />
	    	</div>
	    );
	}
}

class Category extends React.Component {
	constructor(props) {
    	super(props);
  	}
	render(){
		//let id = this.getParams().id;
		let id = this.props.id;
		let name = this.props.name;
		{/*return (
			<a className="category col-md-3" href="javascript:void(0)" onClick={this.props.changeCategory.bind(this, id)}>
				<div id={"cat_"+id}>{name}</div>
			</a>
		);*/}
		return (
			<Link to={"/content/"+id} params={{id_: id}} className="category col-md-3">{name}</Link>
		);
	}
}

class TodoContent extends React.Component{
	constructor(){
		super();
		this.state = {
			todos: [],
			max_id: 0
		};
	}
	componentWillMount(){
		let max_id = 0;
		let init_obj = JSON.parse(localStorage.getItem('todo_state') || '{}');
		if('todos' in init_obj){
			this.setState(init_obj);	
		} else {
			this.setState({
				todos: [],
				max_id: 0
			});
		}
		// let init_obj = [{
		// 				'id': 0,
		// 				'title': 'Loading..' ,
		// 				'checked': false,
		// 				'starred': false,
		// 				}];
	}
	componentDidUpdate(prevProps, prevState){
		if(prevState !== this.state){
			localStorage.setItem('todo_state', JSON.stringify(this.state));
		}
	}
	findTodoIndexById(id){
		let todos = this.state.todos; 
		for (var i = 0, len = todos.length; i < len; i++) {
		    if(todos[i].id == id){
		    	return i; 
		    }
		}
	}
	findTodosMaxId(todos){
		let max_id = 0;
		for (var i = 0, len = todos.length; i < len; i++) {
		    if(todos[i].id > max_id){
		    	max_id = todos[i].id ; 
		    }
		}
		return max_id;
	}
	createTodo(txt, event){
		if(txt !== ''){ 
			let todo_obj = {
				id: this.state.max_id+1,
				title: txt,
				checked: false,
				starred: false,
			}
			let todos = this.state.todos;
			todos.unshift(todo_obj);
			this.setState({
				todos: todos,
				max_id: todo_obj.id
			}); 
		}
	}
	toggleTodo(id, new_status, key_name, event){
		let todos = this.state.todos;
		todos[this.findTodoIndexById(id)][key_name] = new_status;
		this.setState({
			todos: todos
		});
	}
	deleteTodo(id, event){
		let todos = this.state.todos;
		let index = this.findTodoIndexById(id);
		if (index > -1) {
    		todos.splice(index, 1);
		}
		this.setState({
			todos: todos
		});
	}
	render(){
		return (
			<div>
				<TodoCreation create={this.createTodo.bind(this)} />
				<TodoList todos={this.state.todos} category={this.props.category}
					toggle={this.toggleTodo.bind(this)} deleteTodo={this.deleteTodo.bind(this)}/>
			</div>
		);
	}
}

class TodoCreation extends React.Component{
	constructor(){
		super();
		this.state = {
			txt: ''
		}
		this.updateCreationTxt = this.updateCreationTxt.bind(this);
	}
	updateCreationTxt(event){
		this.setState({
			txt: event.target.value
		})
	}
	render(){
		return (
			<div className="input-group todo_creation">
	    		<input type="text" className="form-control" placeholder="Type Something..." onChange={this.updateCreationTxt}/>
		      	<span className="input-group-btn btn_group">
		        	<button className="btn btn-secondary" type="button" onClick={this.props.create.bind(this, this.state.txt)}>
		        	    <i className="fa fa-plus fa-lg"></i>
        			</button>
		      	</span>
		    </div>
		);
	}
}

class TodoList extends React.Component{
	constructor(){
		super();
	}
	render(){
		let todos = this.props.todos;
		if(todos.length>0){
			return (
				<div>
				{todos.map(function(todo, i){
					switch(this.props.category){
						case '0':
							return (
			        			<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
			        		);
	        				break;
						case '1': //starred
							if(todo.starred){
								return (
			        				<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
			        			);
							}
							break;
						case '2': //actived
							if(!todo.checked){
								return (
			        				<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
			        			);
							}
							break;
						case '3': //completed
							if(todo.checked){
								return (
			        				<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
			        			);
							}
							break;
						default:
	        				break;
					}
	    		}, this)}
				</div>
			);
		} else {
			return (<div>No existing todos.</div>);
		}
	}
}

const Todo = (props) => {
	let todo = props.todo;

	let check_class_name = 'fa';
	let title_class_name = 'title';
	let star_class_name = 'fa';
	if(todo.checked){
		check_class_name += ' fa-check-circle-o';
		title_class_name += ' checked';
	} else { 
		check_class_name += ' fa-circle-o';
	}

	if(todo.starred){
		star_class_name += ' fa-star';
	} else {
		star_class_name += ' fa-star-o';
	}
	return (
		<div className="todo">
		    <a className="col-md-10 col-xs-10 first_part" href="javascript:void(0)" onClick={props.toggle.bind(this, todo.id, !todo.checked, 'checked')}>
		    	<i className={check_class_name}></i>
		    	<div id={'todo_'+todo.id} className={title_class_name}>{todo.title}</div>
		    </a>
		    <div className="col-md-2 col-xs-2 second_part">
		    	<a className="star" href="javascript:void(0)" onClick={props.toggle.bind(this, todo.id, !todo.starred, 'starred')}>
		    		<i className={star_class_name}></i>
		    	</a>
		    	<a className="trash" href="javascript:void(0)" onClick={props.deleteTodo.bind(this, todo.id)}>
		    		<i className="fa fa-trash"></i>
		    	</a>
		    </div>
		</div>
	);
}

export class App extends React.Component {
	constructor(props) {
    	super(props);
  	}
  	render() {
	    return (
	      <div className="col-md-12">
	      	<div className="title_area">
		    	<div className="title">TODO</div>
		    	<div className="subtitle">beta</div>
		    </div>
		    <div className="row">
				<div className="col-md-12">
					<CategoryTab />
					{this.props.children || <Content />}
	    		</div>
		    </div>
	      </div>
	    );
  	}
}
