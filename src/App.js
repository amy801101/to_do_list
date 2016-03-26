require('../stylesheets/app.scss');
import React, { Component } from 'react';
import { render } from 'react-dom';

class Content extends React.Component{
	constructor(){
		super();
		this.state = {
			category: 0
		};
	}
	changeCategory(id, event){
		this.setState({
			category: id
		});
	}
	render(){
		return(
			<div> 
				<CategoryTab changeCategory={this.changeCategory.bind(this)}/>
	    		<TodoContent category={this.state.category}/>
	    	</div>
	    );
	}
}

class CategoryTab extends React.Component{
	constructor(){
		super();
		// this.state = {
		// 	category: 0
		// };
		//this.update = this.update.bind(this);
	}
	// update(e){
	// 	this.setState({txt:e.target.value})
	// }
	render(){
		return (
			<div className="category_tab col-md-12"> 
				<Category id={0} name="All" changeCategory={this.props.changeCategory}/>
				<Category id={1} name="Starred" changeCategory={this.props.changeCategory}/>
				<Category id={2} name="Actived" changeCategory={this.props.changeCategory}/>
				<Category id={3} name="Completed" changeCategory={this.props.changeCategory}/>
	    	</div>
	    );
	}
}

const Category = (props) => {
	let id = props.id;
	let name = props.name;
	return (
		<a href="javascript:void(0)" onClick={props.changeCategory.bind(this, id)}>
			<div className="category col-md-3" id={"cat_"+id}>{name}</div>
		</a>
	);
}

class TodoContent extends React.Component{
	constructor(){
		super();
		this.state = {
			todos: [],
			max_id: 0
		};
		//this.createTodo = this.createTodo.bind(this);
	}
	componentWillMount(){
		let init_obj = [{
						'id': 0,
						'title': 'Loading..' ,
						'checked': false,
						'starred': false,
						}];
		this.setState({
			todos: init_obj,
			max_id: init_obj[0].id
		});
	}
	findTodoIndexById(id){
		let todos = this.state.todos; 
		for (var i = 0, len = todos.length; i < len; i++) {
		    if(todos[i].id == id){
		    	return i; 
		    }
		}
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
			<div className="input-group">
	    		<input type="text" className="form-control" placeholder="Type Something..." onChange={this.updateCreationTxt}/>
		      	<span className="input-group-btn">
		        	<button className="btn btn-secondary" type="button" onClick={this.props.create.bind(this, this.state.txt)}>
		        	    <i className="fa fa-plus"></i>
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
		return (
			<div>
			{this.props.todos.map(function(todo, i){
				let attr_in_category = '';
				switch(this.props.category){
					case 0:
						return (
		        			<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
		        		);
        				break;
					case 1: //starred
						if(todo.starred){
							return (
		        				<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
		        			);
						}
						break;
					case 2: //actived
						if(!todo.checked){
							return (
		        				<Todo todo={todo} key={i} toggle={this.props.toggle} deleteTodo={this.props.deleteTodo} />
		        			);
						}
						break;
					case 3: //completed
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
		    <a className="col-md-10 first_part" href="javascript:void(0)" onClick={props.toggle.bind(this, todo.id, !todo.checked, 'checked')}>
		    	<i className={check_class_name}></i>
		    	<div id={'todo_'+todo.id} className={title_class_name}>{todo.title}</div>
		    </a>
		    <div className="col-md-2 second_part">
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

// render(<Content />, document.getElementsByClassName('content')[0]);
render(<Content />, document.getElementById('content'));