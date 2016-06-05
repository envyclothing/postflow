var photos = new Array();

$(function () {

    var CLIENT_ID = '8e789df17da844e7b855189fab26ac50';


    if(window.location.hash === '' || window.location.hash.indexOf('access_token=') < 0)
    {
        redirect_uri = window.location.href;
        auth_url = 'https://api.instagram.com/oauth/authorize/?client_id='+CLIENT_ID+ '&redirect_uri='+ redirect_uri +'&response_type=token';
        window.location.replace(auth_url);
    }
    
    var accessToken = window.location.hash.substring(14, window.location.hash.length+1);
	
	var activeIndex = -1;
	var animationSpeed = 1500;
	var timeToNextSlide = 10 * 1000;
	var shouldAutoNextSlide = true;
	var nextSlideTimeoutId = null;
	
	var autoNextSlide = function () {
        if (shouldAutoNextSlide) {
            // startAnimation takes care of the setTimeout
            nextSlide();
        }
    }
	
	var resetNextSlideTimer = function () {
        clearTimeout(nextSlideTimeoutId);
        nextSlideTimeoutId = setTimeout(autoNextSlide, timeToNextSlide);
    }
	
	function nextSlide() {
        if (isLastImage(activeIndex)) {
            return startAnimation(0);
        }
        startAnimation(activeIndex + 1);
    }

	 var isLastImage = function(imageIndex) {
		if(imageIndex == photos.length - 1) {
			return true
		} else {
			return false
		}
    }
   
    var isAnimating = false;
    var startAnimation = function (imageIndex) {
        resetNextSlideTimer();

        if (activeIndex == imageIndex || imageIndex < 0 || isAnimating || photos.length == 0) {
            return;
        }

        isAnimating = true;
        
        slideBackgroundPhoto(imageIndex);

        activeIndex = imageIndex;

        if (isLastImage(activeIndex)) {
            activeIndex = 0;
        }
    };
	
    var slideBackgroundPhoto = function (imageIndex) {

        var photo = photos[imageIndex];

        var cssMap = Object();
        cssMap['display'] = "none";
        cssMap['background-image'] = "url(" + photo + ")";
        cssMap['background-repeat'] = "no-repeat";
        cssMap['background-size'] = "contain";
        cssMap['background-position'] = "center";

        
        var divNode = $("<div />").css(cssMap).addClass(photo.cssclass);
        divNode.prependTo("#pictureSlider");

        $("#pictureSlider div").fadeIn(animationSpeed);
        var oldDiv = $("#pictureSlider div:not(:first)");
        oldDiv.fadeOut(animationSpeed, function () {
            oldDiv.remove();
            isAnimating = false;
        });
    };
	
	
	var failCleanup = function() {
        if (photos.length > 0) {
            return;
        }
        
        //$('#navboxTitle').text('');
	};


	
	function startShow(){
		//activeIndex = 0;
		nextSlide();
	}

    function shuffle (array) {
        var i = 0, j = 0, temp = null;

        for (i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    var accounts = ['703688669','576678056','612508291'];
    var complete = 0;

    for(i in accounts)
    {
        console.log(accounts[i]);
        var feed = new Instafeed({
            get: 'user',
            userId: accounts[i],
            accessToken: accessToken,
            filter: function(image) {
                photos.push(image.images.standard_resolution.url);
                console.log(image.images.standard_resolution.url);
                return false;
            },
            after: function(a){
                complete++;
                if(complete == accounts.length){
                    shuffle(photos);
                    startShow();
                }
            },
            error: function(err){
                complete++;
                console.log(err);
            }
        });
        feed.run();
    }	

});