import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import $ from 'jquery';

render(<App />, document.getElementById('root'));

var num = 100; //number of pixels before modifying styles

$(window).bind('scroll', function() {
	//var navHeight = $(window).height() - 100;
	if ($(document).height() > ($(window).height()+num) && $(window).scrollTop() > num) {
		console.log('here: ');
		console.log($(window).height());
		console.log($(document).height());
		$('.category_tab').addClass('fixed-top');
        $('.todo_creation').addClass('fixed-top');
	} else {
		$('.category_tab').removeClass('fixed-top');
        $('.todo_creation').removeClass('fixed-top');
	}
});