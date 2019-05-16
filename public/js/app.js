'use strict';

$('.selectGame').on('click', function(event) {
  event.preventDefault();

  let className = $(event.target).siblings('form').attr('class');

  if(className.includes('hideMe')){
    $(event.target).siblings('form').removeClass('hideMe');
  }else{
    $(event.target).siblings('form').addClass('hideMe');
  }
});
