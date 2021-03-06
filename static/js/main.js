(function () {
  // the `this` means global
  this.teleprompter = this.teleprompter || {};

  teleprompter.main = function () {
    var fullScreenElement =
      document.fullScreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    var exitFullscreenFn =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullscreen ||
      document.msExitFullscreen;

    var requestFullscreenFn =
      Element.prototype.requestFullscreen ||
      Element.prototype.webkitRequestFullscreen ||
      Element.prototype.mozRequestFullScreen ||
      Element.prototype.msRequestFullscreen;

    var html = document.querySelector("html");

    var scrollingNow = false;

    var animationLoop;

    var scrollStep = 3;
    var defaultSpeed = 30;
    var minimumSpeed = 10;
    var maximumSpeed = 60;
    var stepSpeed = 10;

    function renderRequest() {
      window.requestAnimationFrame(render);
    }

    function render() {
      window.scrollBy(0, -scrollStep);
      scroll();
    }

    function scroll() {
      if (window.scrollY && scrollingNow) {
        animationLoop = setTimeout(renderRequest, 1000 / defaultSpeed);
      }
    }

    function pause() {
      window.clearTimeout(animationLoop);
      scrollingNow = false;
    }

    function start() {
      scrollingNow = true;
      scroll();
    }

    function toggle() {
      if (scrollingNow) {
        pause();
      } else {
        start();
      }
    }

    function rewind() {
      window.scrollTo(0, document.body.clientHeight - window.innerHeight);
    }

    function resize(factor) {
      html.style.setProperty(
        "--size-factor",
        parseFloat(html.style.getPropertyValue("--size-factor")) + factor
      );
    }

    function fullscreen(element) {
      if (fullScreenElement) {
        exitFullscreenFn();
      } else {
        requestFullscreenFn.call(element);
      }
    }

    document.addEventListener("keydown", function (event) {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case "-":
            event.preventDefault();
            resize(-0.1);
            break;
          case "=":
            event.preventDefault();
            resize(+0.1);
            break;
        }
      } else {
        switch (event.key) {
          case " ":
            event.preventDefault();
            toggle();
            break;
          case "h":
            event.preventDefault();
            pause();
            rewind();
            break;
          case "-":
            if (defaultSpeed > minimumSpeed) {
              defaultSpeed -= stepSpeed;
              console.log(defaultSpeed);
            }
            break;
          case "=":
            if (defaultSpeed < maximumSpeed) {
              defaultSpeed += stepSpeed;
              console.log(defaultSpeed);
            }
            break;
          case "f":
            event.preventDefault();
            fullscreen(html);
            break;
        }
      }
    });

    document.addEventListener("touchstart", toggle);

    rewind();
    toggle();
  };
})();