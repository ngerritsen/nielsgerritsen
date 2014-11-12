
/* global scrollReveal */
/* global moment */

'use strict';

$(document).ready(function () {

	//Parallax Scrolling

	// skrollr.init({
	// 	smoothScrolling: false
	// });

	//Scroll Reveal

	window.scrollReveal = new scrollReveal();

	//Smooth scrolling to correct position

	 $('a[href*=#]:not([href=#]):not(a.flex-next):not(a.flex-prev)').click(function () {
        if (location.pathname.replace(/^\//, ') === this.pathname.replace(/^\//, ') || location.hostname === this.hostname) {
            var a = $(this.hash);
            if (a = a.length ? a : $('[name=' + this.hash.slice(1) + ']'), a.length) { 
            	return $('html,body').animate({
                	scrollTop: a.offset().top - 65
            	}, 1e3), !1;
            }
        }
    });

	//Auto set age
	var age = moment('18-07-1989', 'DD-MM-YYYY').fromNow();
	age = age.replace(/\D/g, ''); //strip everything but numbers from the string
	$('#age').text(age);

	//Activate menu tabs based on scroll position

	/*$('body').scrollspy({
		target: '.main-menu-container',
		offset: 65
	});

	$(window).resize(function() {
	 	$('body').scrollspy('refresh');
	});*/

	//Collapse top bar on scroll down

	$(document).on('scroll',function(){
	    if($(document).scrollTop() > 150) {
	        $('.top-bar').addClass('collapsed');
	    } else {
	        $('.top-bar').removeClass('collapsed');
   		}
	});
});
