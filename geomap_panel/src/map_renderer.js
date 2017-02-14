import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const animationUpdateInterval = 10;
    const animationUpdateLength = 1000;
    var animationTimer = -1;

    ctrl.events.on('render', function () {
        startAnimationSequence();
    });

    function initializeMap () {
        ctrl.map = new Map(ctrl, mapContainer, onMapReady);
    }

    function render () {
        if (ctrl.map.ready) {
            ctrl.map.draw();
        }
    }

    function onMapReady () {
        if (isAnimating()) {
            setTimeout(function () {
                ctrl.map.lerpDataValues(getAnimationRatio());
                render();
            }, animationUpdateInterval);
        } else if (animationTimer > 0) {
            stopAnimationSequence();
        }
    }

    function startAnimationSequence () {
        if (!ctrl.map) {
            initializeMap();
        }

        ctrl.map.setData(ctrl.data);
        animationTimer = getTime();
        render();
    }

    function stopAnimationSequence () {
        animationTimer = -1;
        ctrl.map.lerpDataValues(1);
        render();
    }

    function getTime () {
        return (new Date().getTime());
    }

    function isAnimating () {
        return (getTime() - animationTimer) < animationUpdateLength;
    }

    function getAnimationRatio () {
        return clamp01((getTime() - animationTimer) / animationUpdateLength);
    }

    function clamp01 (val) {
        if (val < 0) return 0;
        if (val > 1) return 1;
        return val;
    }
}