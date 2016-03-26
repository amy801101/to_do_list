import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

class Content extends React.Component{
	constructor(){
		super();
		this.state = {
			txt: 'this is the state txt',
			category: 0
		};
		this.update = this.update.bind(this);
	}
	update(e){
		this.setState({txt:e.target.value})
	}
	render(){
		let txt = this.props.txt;
		return(
			<div> 
				<div className="category_tab">124</div>
	    		<div className="todo_content"></div>
	    	</div>
	    );
	}
}

// render(<Content />, document.getElementsByClassName('content')[0]);
render(<Content />, document.getElementById('content'));