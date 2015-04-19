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
  } else if (relativeTop > 0){
    releaseNav();
  }
}

function fixateNav(){
  var menu = cache("#a-s--menu");
  menu.addClass("fixed");
  cache("nav").height(menu.outerHeight());
  showHomeOption();
}

function releaseNav(){
  cache("#a-s--menu").removeClass("fixed");
  cache("nav").css("height", "");
  hideHomeOption();
}

function showHomeOption(){
}

function hideHomeOption(){
}


//------------------------------------------------------------------------------
// Parallax effects

function applyParallaxEffect(){
  $(".a-s--back-parallax").each(function(){
    var $background = $(this);
    var speed = $background.data("parallax-speed");
    if(speed){
      var yPos = -($(window).scrollTop() / speed);
      $background.css({backgroundPositionY: yPos});
    } 
  });
}


//------------------------------------------------------------------------------
// Document ready event

$(document).ready(function(){
  // Initial settings
  resizeSections();

  // Attach event handlers
  $(window).resize(function() {
    resizeSections();
  });

  $(window).scroll(function() {
    fixateOrReleaseNav();
    applyParallaxEffect();
  });
});

