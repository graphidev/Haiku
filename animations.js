(function(window, document) {

    var speedRatio = 1;

    var canvasContainer = document.querySelector('body > svg');

    var starsList = canvasContainer.querySelectorAll('.star');

    var moonLayer = canvasContainer.querySelector('#moon');
    var starTextLayer = canvasContainer.querySelector('#star-text');
    var cloudTextLayer = canvasContainer.querySelector('#cloud-text');
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

    var moonLightCold = canvasContainer.querySelector('#moon-light-cold');
    var moonLightHot = canvasContainer.querySelector('#moon-light-hot');

    /**
     *
     * Cursor move event
     * ---
     *
    **/
    var previousCursorPosition = false;
    document.addEventListener('mousemove', function(mouseEvent) {

        var mouseEvent = mouseEvent || window.event;

        var containerLayer = canvasContainer.getBoundingClientRect();
        var containerHeight = containerLayer.height;
        var containerWidth = containerLayer.width;

        // Updating layers position
        var xRange = containerWidth/2 - mouseEvent.pageX;
        var yRange = containerHeight/2 - mouseEvent.pageY;

        // Front
        var frontXMove = xRange * .1;
        var frontYMove = yRange * .1;
        samouraiLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        bigTreeLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';
        groundLayer.style.transform = 'translate('+frontXMove+'px,'+frontYMove+'px)';

        // Away
        var firstPlanXMove = xRange * .05;
        var firstPlanYMove = yRange * .05;
        hillsLayer.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        pathList[2].style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        treeElements.forEach(function(tree) {
            tree.style.transform = 'translate('+firstPlanXMove+'px,'+firstPlanYMove+'px)';
        })

        // Far away
        var secondPlanXMove = xRange * .025;
        var secondPlanYMove = yRange * .025;
        frontMountainsLayer.style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';
        pathList[1].style.transform = 'translate('+secondPlanXMove+'px,'+secondPlanYMove+'px)';

        // Far far away
        var thirdPlanXMove = xRange * .0125;
        var thirdPlanYMove = yRange * .0125;
        backMountainLayer.style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';
        caveLayer.style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';
        pathList[0].style.transform = 'translate('+thirdPlanXMove+'px,'+thirdPlanYMove+'px)';

        // Space things
        var spacePlanXMove = xRange * .003125;
        var spacePlanYMove = yRange * .003125;
        moonLayer.style.transform = 'translate('+spacePlanXMove+'px,'+spacePlanYMove+'px)';
        starsGroup.style.transform = 'translate('+spacePlanXMove/2+'px,'+spacePlanYMove/2+'px)';
        cloudTextLayer.style.transform = 'translate('+spacePlanXMove+'px,'+spacePlanYMove+'px)';
        starTextLayer.style.transform = 'translate('+spacePlanXMove+'px,'+spacePlanYMove+'px)';

        // Global changement
        var verticalDistanceRatio = mouseEvent.pageY/containerHeight;

        caveLayer.style.opacity = verticalDistanceRatio;
        pathList.forEach(function(path) {
            path.style.opacity = verticalDistanceRatio;
        });

        moonLightHot.style.opacity = verticalDistanceRatio;
        moonLightCold.style.opacity = 1 - verticalDistanceRatio;


        var cloudScaleRatio = 1 + .25 * verticalDistanceRatio;
        var cloudTranslateDistance = Math.ceil(250 * verticalDistanceRatio);
        cloudsList.forEach(function(cloud) {
            cloud.style.transform = 'scale('+cloudScaleRatio+') translateY(-'+cloudTranslateDistance+'px)';
        });

        // Update last mouse coordinates
        previousCursorPosition = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
        };

    }, false);


    /**
     *
     * Stars animation
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
     * Wind : Clouds and trees animation
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
                    cloud.setAttribute('x', containerWidth + cloudWith);
                }

            }

        });

    }, 100);

})(window, document);
