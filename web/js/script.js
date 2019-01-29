var LoginError = function(error){
    var message = '';
    switch(error){
        case '1': message = 'Не указан e-mail.'; break;
        case '2': message = 'Не указан пароль.'; break;  
        case '3': message = 'E-mail или пароль неверен.'; break;
        case '4': message = 'Доступ закрыт.'; break;                                      
    }       
    popup('<div style="text-align:center">Ошибка авторизации. <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'300px'});     
}  

var LoginRun = function(th){
  var email = $('#site-email').val(), password = $('#site-password').val(); 
  if(!email){
    popup('<div style="text-align:center">Введите E-mail</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }
  if(!password){
    popup('<div style="text-align:center">Введите пароль</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }    
  $.post('http://matronet.com/login.php', {email:email, password:password}, function(data){
    var error = data.error, sites = data.sites;
    if(error == 0){
      var array_sites = sites.split(',');
      if(array_sites.length == 1){
          var site = array_sites[0];
          if(site){
              $.post('http://matronet.com/login_site.php', {site:site, email:email, password:password}, function(data){
                  var error = data.error, uri = data.uri;
                  if(error == 0){
                      window.location.href = 'http://matronet.com/admin/'+uri;
                  }else{
                      LoginError(error);
                  }
              }, 'json');    
          }
      }else{

      }
    }else{
      LoginError(error);
    }                                  
  }, 'json');
}

var Login = function(){
  var content = '<div class="title-call">Вход в панель управления</div><a class="close-call" onclick="CallOrderCancel()" title="закрыть окно"></a><form id="form-callback"><input type="text" placeholder="E-mail" required="" id="site-email" class="input-name-call"><input type="text" placeholder="Пароль" required="" id="site-password" class="input-tel-call"><a class="input-btn-call" onClick="LoginRun(this)">войти</a><span style="float:right; margin-top:10px; font-size:14px;"><a style="color:#9a9a9a; cursor:pointer;">Забыли пароль?</a></span></form>', param = {'radius':'3px', 'padding':'20px', width:'400px'};
  popup(content, param);
  $('#name-call').focus();
}  

var Message = function(th, id){
  var name = $('#name-f-'+id).val(), phone = $('#phone-f-'+id).val(), email = $('#email-f-'+id).val(), message = $('#message-f-'+id).val();
  if(!name){
    popup('<div style="text-align:center">Введите Ваше имя</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }  
  if(!phone){
    popup('<div style="text-align:center">Введите Ваш телефон</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }
  if(!message){
    popup('<div style="text-align:center">Введите Ваше сообщение</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }                                    
  $.post('http://matronet.com/pages/message.php', {name:name, phone:phone, email:email, message:message}, function(html){
    $('#name-f-'+id).val('').prop('disabled', true); 
    $('#phone-f-'+id).val('').prop('disabled', true);
    $('#email-f-'+id).val('').prop('disabled', true);
    $('#message-f-'+id).val('').prop('disabled', true);
    $(th).text('Ваше сообщение отправлено!').css({'max-width':'500px', 'width':'auto', 'cursor':'default', 'background':'#45d070'}).prop('disabled', true);
  }, 'html');
}

var ScrollSites = function(){
    var top_block_sites = $('#sites').offset().top - 105;
    $("html, body").animate({scrollTop: top_block_sites}, 500, function () { });
}
    
var Question  = function(id){
  var content = '<div class="title-call">Форма обратной связи</div><a class="close-call" onclick="CallOrderCancel()" title="закрыть окно"></a><form id="form-callback" onsubmit="return false"><input type="text" placeholder="Ваше имя" required="" id="name-f-2" class="input-name-call"><input type="text" placeholder="Ваш телефон" required="" id="phone-f-2" class="input-tel-call"><input type="text" placeholder="E-mail" required="" id="email-f-2" class="input-name-call"><textarea id="message-f-2" placeholder="Ваше сообщение" class="form-field js-required" style="height: 100px; padding-top: 10px; margin-bottom: 10px;"></textarea><a class="input-btn-call" onclick="Message(this, 2);">отправить</a><span style="float:right; margin-top:8px; font-size:16px;"><a style="color:#9a9a9a; cursor:pointer;" onclick="CallOrderCancel()">отмена</a></span></form>', param = {'radius':'3px', 'padding':'20px', width:'400px'};
  popup(content, param);
  $('#phone-f-2').mask("8 (999) 999-9999");
  $('#name-f-2').focus();
}
   
var CreateSiteRun = function(th, id, hash, category_name){
    var email = $('#email').val(), r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
    if(!email || !r.test(email)){
      popup('<div style="text-align:center">Введите Ваш e-mail</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
      return false;
      }                     
    CancelCreateSite(id); 
    yaCounter40872654.reachGoal('create_site_'+category_name); 
    $.post('create_site.html', {id:id, hash:hash, email:email}, function(html){
      var content = '<div class="title-call">Ваш сайт создан!</div><a class="close-call" onclick="CallOrderCancel()" title="закрыть окно"></a> <div style="clear: both;">На Вашу электронную почту <b>'+email+'</b> мы отправили письмо для активации сайта.</div>', param = {'radius':'3px', 'padding':'20px', width:'500px'};
      popup(content, param);      
    }, 'html'); 
}

var CancelCreateSite = function(id){
  $('.popup-fon').remove();
  $('#form-create-'+id).animate({height: '0px', opacity: 0}, 300, function() {
    $('#form-create-'+id).css({'display':'none'});
  });
} 
var CreateSite = function(id, hash, category){
  var content = '<div class="title-call">Создание сайта</div><a class="close-call" onclick="CancelCreateSite('+id+')" title="закрыть окно"></a><form onsubmit="CreateSiteRun(this, \''+id+'\', \''+hash+'\', \''+category+'\'); return false;"><div style="width: 100%; margin-top: -5px; margin-bottom: 10px; float: left;">Введите Ваш email для активации сайта:</div><input type="email" placeholder="Ваш email" required="" name="email" id="email" class="input-name-call"><a class="box-form-create-btn" onclick="CreateSiteRun(this, \''+id+'\', \''+hash+'\', \''+category+'\')">Создать сайт</a></form>', param = {'radius':'3px', 'padding':'20px', width:'400px'};
  popup(content, param);
$('#email').focus();
}

var CallOrderCancel = function(){
    $('.popup-fon').remove();
}

var CallOrder = function(){
  var content = '<div class="title-call">Заказ обратного звонка</div><a class="close-call" onclick="CallOrderCancel()" title="закрыть окно"></a><form id="form-callback"><input type="text" placeholder="Ваше имя" required="" name="name" id="name-call" class="input-name-call"><input type="text" placeholder="Ваш телефон" required="" name="phone" id="phone-call" class="input-tel-call"><a class="input-btn-call" onclick="CallOrderRun()">заказать</a></form>', param = {'radius':'3px', 'padding':'20px', width:'400px'};
  popup(content, param);
  $('#phone-call').mask("8 (999) 999-9999");
  $('#name-call').focus();
}

var CallOrderRun = function(){
  var name = $('#name-call').val(), phone = $('#phone-call').val();
  if(!name){
    popup('<div style="text-align:center">Введите Ваше имя</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }  
  if(!phone){
    popup('<div style="text-align:center">Введите Ваш телефон</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }    
  CallOrderCancel();
  $.post('http://matronet.com/pages/callback.php', {name:name, phone:phone}, function(html){
  popup('<div style="text-align:center"><b>Звонок заказан!</b> <div>Скоро мы вам позвоним.</div></div>', {'radius':'3px', 'padding':'20px', width:'250px'});
  }, 'html');    
}

function popup(content, param) {
  var param = param ? param : {};
  var popup = document.createElement('div');
  popup.className = 'popup-fon';
  popup.style.display = 'flex';
  popup.style.position = 'fixed';
  popup.style.zIndex = 99999;
  popup.style.top = 0;
  popup.style.right = 0;
  popup.style.bottom = 0;
  popup.style.left = 0;
  popup.style.padding = '20px';
  popup.style.overflowY = 'auto';
  popup.style.backgroundColor = 'rgba(0,0,0,.5)';
  var container = document.createElement('div');
  container.style.margin = 'auto';
  container.style.backgroundColor = '#fff';
  if (param.class) container.classList.add(param.class);
  if (param.background) container.style.backgroundColor = param.background;
  if (param.radius) container.style.borderRadius = param.radius;
  if (param.width) container.style.width = param.width;
  if (param.padding) container.style.padding = param.padding;
  popup.appendChild(container);
  (typeof content === 'string') ? container.innerHTML = content : container.appendChild(content);
  popup.addEventListener('click', function (e) {
      if (e.target === this) {
          this.remove();
          if (param.callback) param.callback();
      }
  });
  document.body.appendChild(popup);
  return popup;
}
var filter_open = true;  
var filter = function(){
  if(filter_open){
    filter_open = false;
    $('.colums__aside').css({'min-width':'0px'});
    $('#box-filter').hide();
    $('.colums__aside').animate({width: '0px'}, 500, function() { $('.colums__aside').hide(); });
    $('.open-filter').css({'display':'block'}).animate({opacity: 1}, 500, function() {});
  }else{
    filter_open = true;
    $('.colums__aside').show();
    $('.colums__aside').animate({width: '410px'}, 500, function() {
        $('.colums__aside').css({'min-width':'300px'});  
        $('#box-filter').show();
    });
    $('.open-filter').animate({opacity: 0}, 500, function() {$('.open-filter').css({'display':'none'});});
  } 
}
$(function() {
    $('#phone').mask("8 (999) 999-9999");
    $('#phone-f-1').mask("8 (999) 999-9999");
    $("#example_id").ionRangeSlider({
        type: "single",
        min: 0,
        max: 10,
        step: 1,
        grid: true,
        grid_snap: true
    });

    var $grid = $('.grid');

    $grid.isotope({
      itemSelector: '.grid-item',
      layoutMode: 'vertical',
      getSortData: {
        popular: '.item-site-popular',
        new: '.item-site-new',
        weight: function( itemElem ) {
          var weight = itemElem.querySelector('.weight-item').textContent;
          return parseFloat( weight.replace( /[\(\)]/g, '') );
        }
      }      
    });

    $('input[type=radio][name=type_site]').change(function() {
        if($('#radio-1').prop('checked')){
            $grid.isotope({ filter: '*' });
            ScrollSites();
        }
        if($('#radio-2').prop('checked')){
          $grid.isotope({ filter: '.many-pages' });
          ScrollSites();
        }
        if($('#radio-3').prop('checked')){
          $grid.isotope({ filter: '.single-pages' });
          ScrollSites();
        }                
    });

    var checkbox = '1';
    $('input[type=checkbox][name=type_sort_site]').change(function() {
      $('#checkbox-'+checkbox).prop( "checked", false );
        if(checkbox == 1){
          checkbox = 2;
        }else{
          checkbox = 1;
        }  
      $('#checkbox-'+checkbox).prop( "checked", true );
      if(checkbox == 1){
        $grid.isotope({ sortBy : 'popular'});
        ScrollSites();
      }else{
        $grid.isotope({ sortBy : 'new'});
        ScrollSites();
      }
    });

});    

document.addEventListener('DOMContentLoaded', function () {

  function onScroll() {
    var scroll_top = $(document).scrollTop();
    var menu_selector = ".bar__nav";
    $(menu_selector + " a").each(function () {
      var hash = $(this).attr("href");
      var target = $(hash);

      if (target.position().top <= scroll_top + 45 && target.position().top + target.outerHeight() > scroll_top) {
        $(menu_selector + " a.nav__item_active").removeClass("nav__item_active");
        $(this).addClass("nav__item_active");
      } else {
        $(this).removeClass("nav__item_active");
      }
    });
  }


  $(".bar__nav a").click(function (e) {

    e.preventDefault();

    $(document).off("scroll");
    $(this).addClass("nav__item_active");
    var hash = $(this).attr("href");
    var target = $(hash);


    $("html, body").animate({
      scrollTop: target.offset().top
    }, 700, function () {
      window.location.hash = hash;
      $(document).on("scroll", onScroll);
    });

  });

});