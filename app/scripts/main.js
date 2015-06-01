var $ = require('jquery');
var moment = require('moment');
var skrollr = require('skrollr');

$(document).ready(function () {
    'use strict';

    //Parallax Scrolling
    skrollr.init({
        smoothScrolling: false,
        forceHeight: false
    });

    //Smooth scrolling
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

    //Collapse top bar on scroll down
    $(document).on('scroll',function(){
        if($(document).scrollTop() > 150) {
            $('.top-bar').addClass('collapsed');
        } else {
            $('.top-bar').removeClass('collapsed');
        }
    });

    //Auto set age
    var age = moment('18-07-1989', 'DD-MM-YYYY').fromNow();
    age = age.replace(/\D/g, '');
	$('#age').text(age);

    //Toggle thumbnail views
    function createPubMetaOnHandler(pubMetaId, pubIdOn) {
        return function() {
            $(pubMetaId).addClass('show');
            $(pubIdOn).fadeOut(200);
        };
    }

    function createPubMetaOffHandler(pubMetaId, pubIdOn) {
        return function() {
            $(pubMetaId).removeClass('show');
            $(pubIdOn).fadeIn(200);
        };
    }

    var publications = $('.publication-item').length;
    for(var i = 0; i <= publications; i++) {
        var pubIdOn = '#pub-' + i + '-on';
        var pubIdOff = '#pub-' + i + '-off';
        var pubMetaId = '#pub-' + i + '-meta';

        $(pubIdOn).click(createPubMetaOnHandler(pubMetaId, pubIdOn));
        $(pubIdOff).click(createPubMetaOffHandler(pubMetaId, pubIdOn));
    }
});
