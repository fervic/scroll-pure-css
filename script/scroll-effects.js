// Selector caching
// https://gist.github.com/jtsternberg/14978579a9edf42ed069

function SelectorCache() {
	var elementCache = {};
 
	var getFromCache = function(selector, $ctxt, reset) {
 
		if ('boolean' === typeof $ctxt) { reset = $ctxt; }
		var cacheKey = $ctxt ? $ctxt.selector + ' ' + selector : selector;
 
		if (undefined === elementCache[cacheKey] || reset) {
			elementCache[cacheKey] = $ctxt ? $ctxt.find(selector) : jQuery(selector);
		}
 
		return elementCache[cacheKey];
	};
 
	return getFromCache;
}

var cache = new SelectorCache();

//------------------------------------------------------------------------------

function resizeSections() {
  cache(".a--resize").css("min-height", $(window).height())
}


//------------------------------------------------------------------------------
// Fixating the navigtion bar

function fixateOrReleaseNav(){
  var relativeTop = cache("nav").position().top - $(window).scrollTop();

  if (relativeTop <= 0){
    fixateNav();
    attachNav();
  } else {
    releaseNav();
    detachNav();
  }
}

function fixateNav(){
  cache("#a-s--menu").addClass("s--fixed");
}

function releaseNav(){
  cache("#a-s--menu").removeClass("s--fixed");
}


//------------------------------------------------------------------------------
// Attaching the navigtion bar

function attachOrDetachNav(){
  var $home = cache('#home');
  var fullHomeHeight = $home.outerHeight() + $home.offset().top;

  if(fullHomeHeight <= $(window).scrollTop()){
    attachNav();
  } else {
    detachNav();
  }
}

function attachNav(){
  cache("#a-s--menu").addClass("s--attached");
  hideLogo();
  showHomeOption();
}

function detachNav(){
  cache("#a-s--menu").removeClass("s--attached");
  showLogo();
  hideHomeOption();
}

function showLogo(){
  cache("#a-s--logo").removeClass('hidden');
}

function hideLogo(){
  cache("#a-s--logo").addClass('hidden');
}

function showHomeOption(){
  cache("li.pure-menu-item").first().removeClass('hidden');
}

function hideHomeOption(){
  cache("li.pure-menu-item").first().addClass('hidden');
}


//------------------------------------------------------------------------------
// Parallax effects

function applyParallaxEffect(){
  $(".a-s--back-parallax").each(function(){
    var $background = $(this);
    var speed = $background.data("parallax-speed");
    if (speed){
      var yPos = -($(window).scrollTop() / speed);
      $background.css({backgroundPositionY: yPos});
    } 
  });
}


//------------------------------------------------------------------------------
// Scroll spy effect

function scrollSpy(){
  if ($.spyOnScroll) {
    var lastId;

    // All menu items
    var $menuItems = cache("#a-s--menu").find("a[href*=#]:not([href=#])")

    // Anchors corresponding to menu items
    var scrollItems = $menuItems.map(function(){
      var $item = $($(this).attr("href"));
      if ($item.length) { return $item; }
    });

    // Current section
    var windowScrollTop = $(window).scrollTop() + 1
    var current = scrollItems.map(function(){
      if($(this).offset().top <= windowScrollTop){ return this; }
    });
    current = current[current.length - 1]

    // Get the id
    var id = current && current.length ? current[0].id : "";

    if (lastId !== id) {
      $menuItems.removeClass("s--selected");
      $menuItems.filter("[href=#"+id+"]").addClass("s--selected");
      updateUrlHash(id);
    }
  }
}

function updateUrlHash(newHash){
  if(history.replaceState) {
    history.replaceState(null, null, "#" + newHash);
  }
  else {
    window.location.hash = newHash;
  }
}


//------------------------------------------------------------------------------
// Smooth scroll effect

function menuAction($item){
  var href = $item.attr('href');

  // First update the hash to preserve browser's back and forward
  var scrollMem = $(document).scrollTop();
  window.location.hash = href;
  $(document).scrollTop(scrollMem);

  $.spyOnScroll = false;
  $("html, body").animate({
    scrollTop: $(href).offset().top
  }, 500, function () {
    $.spyOnScroll = true;
    scrollSpy();
  });
}


//------------------------------------------------------------------------------
// Document ready event

$(document).ready(function(){
  // Initial settings
  $.spyOnScroll = true;
  resizeSections();

  // Attach event handlers
  $(window).resize(function() {
    resizeSections();
  });

  $(window).scroll(function() {
    fixateOrReleaseNav();
    //attachOrDetachNav();
    applyParallaxEffect();
    scrollSpy();
  });

  $(document).on("click", "a[href*=#]:not([href=#])", function(e) {
    e.preventDefault();
    menuAction($(this));
  });

});

