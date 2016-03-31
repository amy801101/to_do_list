import React from 'react';
import { render, ReactDOM } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, IndexRedirect } from 'react-router';
import { App, Content, CategoryTab, Category } from './App';
import $ from 'jquery';

var routes = (
	<Route path="/" component={App}>
		<IndexRedirect to="content/0" />
		<Route name="contents" path="content/:id" component={Content} />
	</Route>
);

render(<Router history={hashHistory}>{routes}</Router>, document.getElementById('root'));

var num = 50; //number of pixels before modifying styles

$('.container').bind('scroll', function() {
	if ($('.container').scrollTop() > num) {
		$('.category_tab').addClass('fixed-top col-md-5 col-xs-10');
        $('.todo_creation').addClass('fixed-top col-md-5 col-xs-10');
	} else {
		$('.category_tab').removeClass('fixed-top col-md-5 col-xs-10');
        $('.todo_creation').removeClass('fixed-top col-md-5 col-xs-10');
	}
});