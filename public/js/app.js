'use strict';

//Show/Hide form on show.ejs
$('.selectGame').on('click', function(event) {
  event.preventDefault();

  let className = $(event.target).siblings('form').attr('class');

  if(className.includes('hideMe')){
    $(event.target).siblings('form').removeClass('hideMe');
  }else{
    $(event.target).siblings('form').addClass('hideMe');
  }
});

//Checkbox returns boolean on detail.ejs 
$('#checkBox').on('change', function() {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
  } else {
    $(this).attr('value', 'false');
  }
});

