(function() {
    // Main
    initHeader();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('login-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        var grd = ctx.createRadialGradient(width/2,height/2,100,width/2,height/2,width/2);
        grd.addColorStop(0,"rgba(255,255,255,0.2)");
        grd.addColorStop(1,"rgba(255,255,255,0.1)");

        ctx.fillStyle=grd;
        ctx.fillRect(0,0,width,height);
    }
})();
