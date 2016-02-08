var $ = require('jquery');
var moment = require('moment');

$(document).ready(function () {
  'use strict';

  //Smooth scrolling

  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 30
        }, 1000);
        return false;
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
