(function(window, document) {

    var speedRatio = 1;

    var canvasContainer = document.querySelector('body > svg');

    var starsList = canvasContainer.querySelectorAll('.star');
    var moonLayer = canvasContainer.querySelector('#moon');
    var cloudsList = canvasContainer.querySelectorAll('.cloud');
    var starsGroup = canvasContainer.querySelector('#stars');
    var samouraiLayer = canvasContainer.querySelector('#samourai');
    var groundLayer = canvasContainer.querySelector('#ground');
    var bigTreeLayer = canvasContainer.querySelector('.big-tree');
    var hillsLayer = canvasContainer.querySelector('#hills');
    var frontMountainsLayer = canvasContainer.querySelector('#front-mountains');
    var backMountainLayer = canvasContainer.querySelector('#back-mountain');
    var treeElements = canvasContainer.querySelectorAll('.tree');
    var pathList = canvasContainer.querySelectorAll('.path');
    var caveLayer = canvasContainer.querySelector('#cave');

    var cloudTextGroup = canvasContainer.querySelector('#cloud-text');
    var cloudText = canvasContainer.querySelector('#cloud-text-text');
    var starTextLayer = canvasContainer.querySelector('#star-text');
    var starTextMask = canvasContainer.querySelector('#star-text-clip rect');
    var moonText = canvasContainer.querySelector('#moon-text');

    var moonLightCold = canvasContainer.querySelector('#moon-light-cold');
    var moonLightHot = canvasContainer.querySelector('#moon-light-hot');

    /**
     *
     * Animation function
     * ---
     *
    **/
    var actualizeAnimation = function(xRatio, yRatio) {

        xRatio = (Math.abs(xRatio) < 1 ? xRatio : (xRatio < 0 ? -1 : 1));
        yRatio = (yRatio < 0 ? 0 : (yRatio > 1 ? 1 : yRatio));

        // Front
        var frontXMove = 100 * xRatio;
        var frontYMove = 25 * yRatio;

        samouraiLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        bigTreeLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        groundLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';

        // Away
        var firstPlanXMove = 50 * xRatio;
        var firstPlanYMove = 12.5 * yRatio;
        hillsLayer.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        pathList[2].style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        treeElements.forEach(function(tree) {
            tree.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        })

        // Far away
        var secondPlanXMove = 25 * xRatio;
        var secondPlanYMove = 5.25 * yRatio;
        frontMountainsLayer.style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';
        pathList[1].style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';

        // Far far away
        var thirdPlanXMove = 12.5 * xRatio;
        var thirdPlanYMove = 3.125 * yRatio;
        backMountainLayer.style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';
        caveLayer.style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';
        pathList[0].style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';

        // -----------------

        // Path layers
        caveLayer.style.opacity = yRatio;
        pathList.forEach(function(path) {
            path.style.opacity = yRatio;
        });

        // Moon light
        moonLightHot.style.opacity = yRatio;
        moonLightCold.style.opacity = 1 - yRatio;

        // Stars layers
        starsList.forEach(function(star) {
            star.style.opacity = 0.25  + 0.5 * yRatio;
        });

        // Clouds layers
        var cloudScaleRatio = 1 + .25 * yRatio;
        var cloudTranslateDistance = Math.ceil(270 * yRatio);
        cloudsList.forEach(function(cloud) {
            cloud.style.transform = 'scale('+cloudScaleRatio+') translateY(-'+cloudTranslateDistance+'px)';
        });

        // Text layers
        cloudText.style.transform = 'translateY(-'+112 * yRatio+'px)';
        cloudText.style.opacity = yRatio;
        moonText.style.opacity = yRatio;
        starTextLayer.style.opacity = yRatio;
        starTextMask.setAttribute('width', 388 * yRatio);

    }

    /**
     *
     * device mouvements
     * ---
     *
    **/
    if(window.isMobileOrTablet() && window.DeviceOrientationEvent) {

        window.addEventListener('deviceorientation', function(deviceOrientation) {

            var xRatio = (deviceOrientation.gamma)/45;
            var yRatio = (deviceOrientation.beta)/45;

            if(window.isLandscape()){
                actualizeAnimation(yRatio, (1 - xRatio), true);
            }
            else {
                actualizeAnimation(xRatio, (1 - yRatio));
            }


        }, true)

    }
    else {

        document.addEventListener('mousemove', function(mouseEvent) {

            var mouseEvent = mouseEvent || window.event;
            var containerLayer = canvasContainer.getBoundingClientRect();
            var containerHeight = containerLayer.height;
            var containerWidth = containerLayer.width;

            // Actualize speed
            speedRatio = -5 + (10 * mouseEvent.pageX / containerWidth);

            var xRatio = mouseEvent.pageX/containerWidth/2;
            var yRatio = mouseEvent.pageY/containerHeight;

            actualizeAnimation(xRatio, yRatio);

        }, false);

    }






    /**
     *
     * Stars animation (blink)
     * ---
     *
    **/
    setInterval(function() {

        var starElement = starsList[Math.floor(Math.random()*starsList.length)];

        var previousStarOpacity = starElement.style.opacity;
        starElement.style.opacity = 1;

        setTimeout(function() {
            starElement.style.opacity = previousStarOpacity;
        }, 500);

    }, 1000);



    /**
     *
     * Clouds and trees animation (Wind)
     * ---
     *
    **/
    var clouds = canvasContainer.querySelectorAll('.cloud');
    setInterval(function() {

        clouds.forEach(function(cloud) {

            var cloudPosition = parseInt(cloud.getAttribute('x'));
            var newCloudPosition = Math.ceil(cloudPosition + 1 * speedRatio);

            cloud.setAttribute('x', newCloudPosition);

            var cloudWidth = cloud.getBoundingClientRect().width;
            var containerWidth = canvasContainer.getAttribute('viewBox').split(' ')[2];

            console.log(containerWidth);
            console.log(cloudWidth);

            // Out of the viewbox to the right
            if(speedRatio > 0) {

                if(newCloudPosition  > containerWidth) {
                    cloud.setAttribute('x', -cloudWidth);
                }

            }

            // Out of the viewbox to the left
            else {

                if(newCloudPosition + cloudWidth < 0) {
                    cloud.setAttribute('x', containerWidth + cloudWidth);
                }

            }

        });

    }, 100);

})(window, document);
