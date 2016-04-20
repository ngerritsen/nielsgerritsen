'use strict';

var $ = require('jquery');
var moment = require('moment');

$(document).ready(function () {
  autoSetAge();
  toggleThumbnailViews();
});

function autoSetAge() {
  var birth = moment('18-07-1989', 'DD-MM-YYYY');
  var now = moment();
  var age = now.diff(birth, 'years');

  $('.js-age').text(age);
}

function toggleThumbnailViews() {
  $('.js-publication').each(function () {
    var $publication = $(this);
    var $onToggle = $publication.find('.js-publication-on');
    var $offToggle = $publication.find('.js-publication-off');
    var $meta = $publication.find('.js-publication-meta');

    $onToggle.click(function () {
      $meta.addClass('show');
      $onToggle.fadeOut(200);
    });

    $offToggle.click(function () {
      $meta.removeClass('show');
      $onToggle.fadeIn(200);
    });
  });
}
