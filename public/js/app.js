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


$('#changeModes').on('click', function() {
  if (localStorage.STATE === 'night') {
    localStorage.STATE = 'light';
    $('header').removeClass('headerFooterNightMode');
    $('footer').removeClass('headerFooterNightMode');
    $('h1').removeClass('textNightMode');
    $('h2').removeClass('textNightMode');
    $('h3').removeClass('textNightMode');
    $('h4').removeClass('textNightMode');
    $('p').removeClass('textNightMode');
    $('form').removeClass('textNightMode');
    $('a').removeClass('textNightMode');
    $('#headerImage').attr('src', '../assets/fireFlower.png');

    
  } else {
    localStorage.STATE = 'night';
    $('header').addClass('headerFooterNightMode');
    $('footer').addClass('headerFooterNightMode');
    $('h1').addClass('textNightMode');
    $('h2').addClass('textNightMode');
    $('h3').addClass('textNightMode');
    $('h4').addClass('textNightMode');
    $('p').addClass('textNightMode');
    $('form').addClass('textNightMode');
    $('a').addClass('textNightMode');
    $('#headerImage').attr('src', '../assets/booNightMode.png');
  }

});


$( document ).ready(function() {
  console.log( 'ready!' );
  if (localStorage.STATE === 'night') {
    $('header').addClass('headerFooterNightMode');
    $('footer').addClass('headerFooterNightMode');
    $('h1').addClass('textNightMode');
    $('h2').addClass('textNightMode');
    $('h3').addClass('textNightMode');
    $('h4').addClass('textNightMode');
    $('p').addClass('textNightMode');
    $('form').addClass('textNightMode');
    $('a').addClass('textNightMode');
    $('#headerImage').attr('src', '../assets/booNightMode.png');

  }
});
