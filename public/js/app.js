'use strict';

$('.selectGame').on('click', function(event) {
  event.preventDefault();
  console.log('hello');
  $('.videoGameDetailsForm').removeClass('hideMe');
});
