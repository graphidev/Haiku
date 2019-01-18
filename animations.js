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
    var actualizeAnimation = function(xRatio, yRatio, isOrientationSource) {

        if(isOrientationSource) {
            xRatio = xRatio * 1000;
        }

        console.log('xRatio: '+xRatio);

        // Front
        var frontXMove = xRatio * .1;
        var frontYMove = yRatio * .1;

        console.log('frontXMove: '+frontXMove);

        samouraiLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        bigTreeLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        groundLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';

        // Away
        var firstPlanXMove = xRatio * .05;
        var firstPlanYMove = yRatio * .05;
        hillsLayer.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        pathList[2].style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        treeElements.forEach(function(tree) {
            tree.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        })

        // Far away
        var secondPlanXMove = xRatio * .025;
        var secondPlanYMove = yRatio * .025;
        frontMountainsLayer.style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';
        pathList[1].style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';

        // Far far away
        var thirdPlanXMove = xRatio * .0125;
        var thirdPlanYMove = yRatio * .0125;
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
        var cloudTranslateDistance = Math.ceil(250 * yRatio);
        cloudsList.forEach(function(cloud) {
            cloud.style.transform = 'scale('+cloudScaleRatio+') translateY(-'+cloudTranslateDistance+'px)';
        });

        // Text layers
        cloudText.style.transform = 'translateY(-'+112 * yRatio+'px)';
        cloudText.style.opacity = yRatio ;
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
    document.addEventListener('mousemove', function(mouseEvent) {

        var mouseEvent = mouseEvent || window.event;
        var containerLayer = canvasContainer.getBoundingClientRect();
        var containerHeight = containerLayer.height;
        var containerWidth = containerLayer.width;

        // Actualize speed
        speedRatio = -5 + (10 * mouseEvent.pageX / containerWidth);

        // Updating layers position
        var xRatio = containerWidth/2 - mouseEvent.pageX;
        var yRatio = mouseEvent.pageY/containerHeight;

        actualizeAnimation(xRatio, yRatio, false);

    }, false);

    window.addEventListener('deviceorientation', function(deviceOrientation) {

        console.log(deviceOrientation.alpha);

        var xRatio = (deviceOrientation.alpha)/90;
        var yRatio = (deviceOrientation.beta)/45;

        xRatio = (Math.abs(xRatio) < 1 ? xRatio : xRatio/xRatio);
        yRatio = (yRatio < 0 ? 0 : (yRatio > 1 ? 1 : yRatio));

        actualizeAnimation(xRatio, (1 - yRatio), true);

    }, true)



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
            var containerWidth = canvasContainer.getBoundingClientRect().width;

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
