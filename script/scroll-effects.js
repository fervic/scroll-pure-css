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
  } else {
    releaseNav();
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
  var $splash = cache('#splash');
  var fullSplashHeight = $splash.outerHeight() + $splash.offset().top;

  if(fullSplashHeight <= $(window).scrollTop()){
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
    attachOrDetachNav();
    applyParallaxEffect();
  });
});

