/* global skrollr */
/* global scrollReveal */

'use strict';

$(document).ready(function () {

	//Parallax Scrolling

	skrollr.init({
		smoothScrolling: false
	});

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

	//Activate menu tabs based on scroll position

	$('body').scrollspy({
		target: '.main-menu-container',
		offset: 65
	});

	$(window).resize(function() {
	 	$('body').scrollspy('refresh');
	});

	//Collapse top bar on scroll down

	$(document).on('scroll',function(){
	    if($(document).scrollTop() > 150) {
	        $('.top-bar').addClass('collapsed');
	    } else {
	        $('.top-bar').removeClass('collapsed');
   		}
	});
});
