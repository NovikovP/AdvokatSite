var Events = {};

Events.LoadMail = function(){
  var messages = '';
  $.get('http://matronet.com/partner/cabinet/messages/dialogs.php', {}, function(data){
    var dialogs = data.dialogs;
    dialogs.forEach(function(item) {
      var id_dialog = item.id;
      var name = item.name;
      var photo = item.photo;
      var message = item.message;
      messages += '<a href="http://matronet.com/partner/cabinet/messages/?dialog='+id_dialog+'" class="message recent"><div class="message__actions_avatar"><div class="avatar"><img src="'+photo+'" style="border-radius: 50%"></div></div><div class="message_data"><div class="name_time"><div class="name"><p style="color: #0674ec;">'+name+'</p></div><p style="max-height: 100px; overflow: hidden; max-width: 270px;">'+message+'</p></div></div></a>';
    });
    $('#top-dialogs').html(messages);  
  }, 'json'); 
}

Events.Load = function(){
  $.get('http://matronet.com/partner/cabinet/notifications/events.php', {}, function(data){
    var count_mail = parseInt(data.count_mail);
    var count_review = parseInt(data.count_review);
    var count_review_site = parseInt(data.count_review_site);
    var count = count_mail + count_review + count_review_site;
    if(count > 0){
      $('#count-events').text(count).show();
    }else{
      $('#count-events').hide();
    }
    if(count_mail > 0){
      $('#count-mail').text(count_mail).show();
    }else{
      $('#count-mail').hide();
    }
    //
    var events = data.events, rows = '';
    events.forEach(function(item) {
      var id_object = item.id_object;
      var type = item.type;
      var ico = '';
      var title = '';
      var url = '#';
      switch(type){
          case 'mail': ico = '<span class="lnr lnr-envelope loved noti_icon"></span>'; title = 'Cообщение'; url = 'http://matronet.com/partner/cabinet/messages/'; break;
          case 'review': ico = '<span class="lnr lnr-bubble commented noti_icon"></span>'; title = 'Отзыв клиента'; url = 'http://matronet.com/partner/cabinet/reviews/'; break; 
          case 'review_site': ico = '<span class="lnr lnr-star reviewed noti_icon"></span>'; title = 'Отзыв о сайте'; url = 'http://matronet.com/partner/cabinet/reviews/'; break;                                     
      }        
      var photo = item.photo;
      var name = item.name;
      var date = item.date;
      rows += '<div class="notification" onclick="window.location.href = \''+url+'\'" style="cursor:pointer"><div class="notification__info"><div class="info_avatar"><img src="'+photo+'" /></div><div class="info"><p><span>'+name+'</span> <a href="'+url+'">'+title+'</a></p><p class="time" style="width:150px;">'+date+'</p></div></div><div class="notification__icons ">'+ico+'</div></div>';
    });
    $('#top-events').html(rows);     
    //    
  }, 'json'); 
}

Events.Init = function(){
  var curent_user = $('#curent-user').data('type');
  if(curent_user == 'partner'){
    setInterval(function(){
      Events.Load();
    }, 10000);
    Events.Load();
    Events.LoadMail();
  }
}

var Message = {};

Message.Add = function(id, type, hash){
  if($('#signup-login').length){
    Popup('<div style="text-align:center"><div>Войдите на сайт чтобы отправить сообщение.</div> <a class="btn btn-sm btn-secondary" href="http://matronet.com/login/" style="text-transform: uppercase; margin-top:10px;">Войти на сайт</a></div>', {'radius':'3px', 'padding':'20px', width:'300px'});      
    return false;
  }
  var content = '<h6 class="title-call" style="font-family: Open Sans, sans-serif; font-weight: 100;">Сообщение</h6><form onsubmit="return false"><input type="text" placeholder="Тема сообщения" id="theme-message" class="input-name-call" style="margin-top:20px;"> <textarea cols="30" rows="5" id="text-message" style="margin-top:15px;" placeholder="Текст сообщения"></textarea> <a class="btn btn-md btn-secondary" onclick="Message.Send(\''+id+'\', \''+type+'\', \''+hash+'\')" style="text-transform: uppercase; margin-top:10px;">Отправить</a></form>';
  Popup(content, {'radius':'3px', 'padding':'20px', width:'600px'});
  $('#theme-message').focus();   
}

Message.Send = function(id, type, hash){
  var theme = $('#theme-message').val();
  var message = $('#text-message').val();
  if(!message){
    Popup('<div style="text-align:center">Введите сообщение</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
  }  

  $.post('http://matronet.com/partner/cabinet/messages/send.php', {id:id, hash:hash, type:type, theme:theme, message:message}, function(data){
    var id = data.id;
    if(id != '0'){
      ClosePopup();
      Popup('<div style="text-align:center">Ваше сообщение отправлено.</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
    }else{
      Popup('<div style="text-align:center">Ошибка</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
    }
  }, 'json');   
}

var Partner = {};

Partner.Login = function(){
  var email = $('#login-partner').val();
  var password = $('#password-partner').val();
  if(!email){
    Popup('<div style="text-align:center">Введите Ваш e-mail</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
  } 
  if(!password){
    Popup('<div style="text-align:center">Введите Ваш пароль</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
  } 
  $.post('http://matronet.com/partner/login.php', {email:email, password:password}, function(data){
    var error = data.error;
    if(error == '0'){
      window.location.href = 'http://matronet.com/partner/cabinet/';
    }else{
      Popup('<div style="text-align:center">Ошибка авторизации</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
    }
  }, 'json');         
}

Partner.LogOut = function(){
  Cookie.FullDelete('partner');
  Cookie.FullDelete('partner_hash');
  window.location.href = 'http://matronet.com/login/';
}

var LogOutAdmin = function(){
  Cookie.FullDelete('admin');
  Cookie.FullDelete('admin_hash');
  window.location.href = 'http://matronet.com/login/';
}

var $featuredProd = $('#popular-items');

var CreateSiteRun = function(id, hash, category){
  var email = $('#email-site').val(), r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
  if(!email || !r.test(email)){
    Popup('<div style="text-align:center">Введите Ваш e-mail</div>', {'radius':'3px', 'padding':'20px', width:'250px'});      
    return false;
    }                     
  ClosePopup();  
  $.post('create_site.html', {id:id, hash:hash, email:email}, function(html){
    var content = '<h6 class="title-call" style="font-family: Open Sans, sans-serif; font-weight: 100;">Ваш сайт создан!</h6><a class="close-call" onclick="ClosePopup()" title="закрыть окно"></a> <div style="margin-top:10px; clear: both;">На Вашу электронную почту <b>'+email+'</b> мы отправили письмо для активации сайта.</div>';
    Popup(content, {'radius':'3px', 'padding':'20px', width:'500px'});      
    yaCounter40872654.reachGoal('create_site_'+category);
  }, 'html'); 
}

var CreateSite = function(id, hash, category){
  var content = '<h6 class="title-call" style="font-family: Open Sans, sans-serif; font-weight: 100;">Создание сайта</h6><form onsubmit="CreateSiteRun(\''+id+'\', \''+hash+'\', \''+category+'\'); return false"><input type="email" name="email" required="" placeholder="Ваш e-mail" id="email-site" class="input-name-call" style="margin-top:20px;"><a class="btn btn-md btn--fullwidth btn-secondary" onclick="CreateSiteRun(\''+id+'\', \''+hash+'\', \''+category+'\');" style="text-transform: uppercase; margin-top:10px;">Создать сайт</a></form>';
  Popup(content, {'radius':'3px', 'padding':'20px', width:'400px'});
  $('#email-site').focus(); 
  yaCounter40872654.reachGoal('open_form_'+category); 
}

var ClosePopup = function(){
    $('.popup-fon').remove();
}

var Popup = function(content, param) {
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

var Cookie = {}

Cookie.FixDate = function(date){
  var base = new Date(0), skew = base.getTime();
  if(skew > 0) date.setTime (date.getTime() - skew);
}

Cookie.Set = function(name, value, expires, path, domain, secure){
  document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}

Cookie.Val = function(offset){
  var endstr = document.cookie.indexOf(";", offset);
  if(endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

Cookie.Get = function(name){
  var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0;
  while (i < clen) {
  var j = i + alen;
  if(document.cookie.substring(i, j) == arg) 
  return Cookie.Val(j);
  i = document.cookie.indexOf(" ", i) + 1;
  if(i == 0) break;
  }
  return null;
}

Cookie.Delete = function(name, path, domain){
  if(Cookie.Get(name)){
    document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

Cookie.Del = function(name){document.cookie = name + "=" + ";       path=/; expires=Mon, 02-Jan-2005 00:00:00 GMT";}

Cookie.FullDelete = function(value){
    allcoockies = document.cookie.substring(0, document.cookie.length)+';';
    while(allcoockies){
        var spos = Strpos(allcoockies, ';', 0), val = allcoockies.substr(0, spos);
        allcoockies = allcoockies.substr(spos+2, allcoockies.length);
        coockie_param = val.substr(0, Strpos(val, '=',0));
        if(coockie_param == value){Cookie.Del(coockie_param);}
    }
}

Cookie.FullGet = function(value){
    allcoockies = document.cookie.substring(0, document.cookie.length)+';';
    while(allcoockies){
        var spos = Strpos(allcoockies, ';',0), val = allcoockies.substr(0, spos);   
        allcoockies = allcoockies.substr(spos+2, allcoockies.length);
        coockie_param = val.substr(0, Strpos(val, '=',0));    
        if(coockie_param == value){return val.substr((Strpos(val, '=',0)+1));}
    }
}

var Strpos = function(haystack, needle, offset){var i = haystack.indexOf( needle, offset ); return i >= 0 ? i : false;}

function customTrigger(slideNext,slidePrev,targetSlider){
    $(slideNext).on('click', function() {
        targetSlider.trigger('next.owl.carousel');
    });
    $(slidePrev).on('click', function() {
        targetSlider.trigger('prev.owl.carousel');
    });
}

var Filter = {i:'<i class="lnr lnr-chevron-right" style="margin-left: -15px; margin-right: 5px; font-size: 10px;"></i>', color:'#0674ec', cat:'all', type:'all'};

Filter.Search = function(){
  var query = '';
  var cat = Filter.cat;
  var type = Filter.type;
  if(cat != 'all'){query = '.cat-'+cat;}
  if(type != 'all'){query += '.'+type;}
  if(query == ''){
    $grid.isotope({ filter: '*' });
  }else{
    $grid.isotope({ filter: query });
  }
}

Filter.Cat = function(cat){
  $('.item-cat').each(function( index ) {
    var name = $( this ).text();
    $( this ).text(name);
  });  
  var name = $('#item-cat-'+cat).text();
  $('#filter-cat').html(name+' <span class="lnr lnr-chevron-down"></span>');
  $('#item-cat-'+cat).html(Filter.i+name); 
  Filter.cat = cat;
  Filter.Search();
}

Filter.Type = function(type){
  $('.item-type').each(function( index ) {
    var name = $( this ).text();
    $( this ).text(name);
  });  
  var name = $('#item-type-'+type).text();
  $('#filter-type').html(name+' <span class="lnr lnr-chevron-down"></span>');
  $('#item-type-'+type).html(Filter.i+name);  
  Filter.type = type;
  Filter.Search();  
}

Filter.Sort = function(){}

Filter.Init = function(){
  var name = $('#item-cat-all').text();
  $('#item-cat-all').html(Filter.i+name);
  var name = $('#item-type-all').text();
  $('#item-type-all').html(Filter.i+name);  
  $('.item-cat').css({cursor:'pointer'});
  $('.item-type').css({cursor:'pointer'});
}

var GetPopular = function(cat){
    var message = '';
    $('.btn-cat-popular').css({background: '#f1f3f6', color: '#747b86'}); 
    $('#item-popular-'+cat).css({background: '#0674ec', color: '#fff'});   
    $.get('http://matronet.com/pages/popular-item.php', {cat:cat}, function(data){
        var items = '', count = 0;
        data.forEach(function(item) {
          count++;
          var id = item.id;
          var hash = item.hash;
          var category = item.category;
          var img = item.img;
          var name = item.name;
          var url = item.url;
          var link = item.link;
          var info = item.info;
          var tags_json = item.tags, tags = '';
          for (key in tags_json) {
            tags += '<li><a href="'+tags_json[key]['link']+'">'+tags_json[key]['name']+'</a></li>';
          }
          var name_partner = item.name_partner;
          var url_partner = item.url_partner;
          var photo_partner = item.photo_partner;
          items += '<div class="featured__single-slider"><div class="featured__preview-img"><img src="'+img+'" alt="Featured products"><div class="prod_btn" style="width: 300px;"><a href="'+link+'" class="transparent btn--sm btn--round" style="line-height: 44px;">Информация</a><a href="'+url+'" target="_blank" class="transparent btn--sm btn--round" style="line-height: 44px;">Демонстрация</a></div></div><div class="featured__product-description"><div class="product-desc desc--featured"><a href="'+link+'" class="product_title"><h4>'+name+'</h4></a><ul class="titlebtm"><li><img class="auth-img" src="'+photo_partner+'" /><p><a href="'+url_partner+'">'+name_partner+'</a></p></li></ul><p style="font-family: Open Sans, sans-serif;">'+info+'</p></div><div class="product_data"><div class="tags tags--round"><ul>'+tags+'</ul></div><div class="product-purchase featured--product-purchase"><button class="btn btn-lg btn--round btn-sm" style="text-transform: none;" onclick="CreateSite(\''+id+'\', \''+hash+'\', \''+category+'\')">Создать сайт бесплатно</button><div class="rating product--rating" style="margin-top: 8px;"><ul><li><span class="fa fa-star"></span></li><li><span class="fa fa-star"></span></li><li><span class="fa fa-star"></span></li><li><span class="fa fa-star"></span></li><li><span class="fa fa-star"></span></li></ul></div></div></div></div></div>';
        });  
        $('#popular-items').html(items);
        if(count > 1){
          $featuredProd.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
          $featuredProd.find('.owl-stage-outer').children().unwrap();
          $featuredProd.owlCarousel({
              items: 1,
              loop:true
          });    
          customTrigger('.product__slider-nav .nav_right', '.product__slider-nav .nav_left', $featuredProd);          
        }

    }, 'json');      
}    

var Benefits = function(type){
  if(type == 'user'){
    $('#btn-benefits-user').removeClass('btn--bordered');
    $('#btn-benefits-dev').addClass('btn--bordered');
    $('#benefits-user').show();
    $('#benefits-dev').hide();
  }else{
    $('#btn-benefits-dev').removeClass('btn--bordered');
    $('#btn-benefits-user').addClass('btn--bordered');
    $('#benefits-user').hide();
    $('#benefits-dev').show();
  }
}


var $grid = $('.grid');

$(function() {
  GetPopular('all');
  Events.Init();
  $("#example_id").ionRangeSlider({
      type: "single",
      min: 0,
      max: 10,
      step: 1,
      grid: true,
      grid_snap: true
  });  

if($('#filter-cat').length){
  Filter.Init();
}

if($('.platform .swiper-container').length){
    var platform = new Swiper('.platform .swiper-container', {
        pagination: '.platform .swiper-pagination',
        paginationClickable: true,
        effect: 'fade',
        crossFade: true,
        nextButton: '.platform .swiper-button-next',
        prevButton: '.platform .swiper-button-prev',
    });
}

$grid.isotope({
  itemSelector: '.grid-item',
  layoutMode: 'masonry',  
  getSortData: {
    popular: '.item-site-popular',
    new: '.item-site-new',
    weight: function( itemElem ) {
      var weight = itemElem.querySelector('.weight-item').textContent;
      return parseFloat( weight.replace( /[\(\)]/g, '') );
    }
  }      
});

$('#sort_sites').change(function() {
  if($( this ).val() == 'popular'){
    $grid.isotope({ sortBy : 'popular'});
  }else{
    $grid.isotope({ sortBy : 'new'});
  }
});

$('#sites-related').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '<span class="lnr lnr-chevron-left"></span>',
    nextArrow: '<span class="lnr lnr-chevron-right"></span>',
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true
            }
        }
    ]
});

});

$( window ).load(function() {
  $grid.isotope();
});