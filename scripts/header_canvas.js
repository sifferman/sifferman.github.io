
var canvas = document.getElementById("header_canvas");
var ctx = canvas.getContext("2d");

fitToContainer(canvas);
draw();

window.addEventListener('resize', fitToContainer);

function fitToContainer() {
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}


function draw() { setTimeout(function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.filter = 'blur(2.5px)';
    for ( let b of balls ) {
        b.draw();
        b.step();
    }

    requestAnimationFrame(draw);
}, 50);}


class Ball {
    constructor() {
        this.r = 15 + Math.random() * 20;
        this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.alpha = .8 * Math.random();
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.vm = Math.random() * .5;
        this.vd = Math.random() * 2 * Math.PI;
        this.am = Math.random() * .5;
        this.ad = Math.random() * 2 * Math.PI;
        this.jm = Math.random() * .05;
        this.jd = Math.random() * 2 * Math.PI;
    }
    randomizeJerk() {
        this.jm = Math.random() * .05;
        this.jd = Math.random() * 2 * Math.PI;
        // console.log("jerk updated");
    }
    vectorSumM( v1m, v1d, v2m, v2d ) {
        return Math.sqrt(
            v1m*v1m + v2m*v2m +
            2*v1m*v2m*Math.cos( v1d - v2d )
        );
    }
    vectorSumD( v1m, v1d, v2m, v2d ) {
        return v1d +
        Math.atan2(
            v2m*Math.sin( v2d-v1d ), v1m + v2m*Math.cos( v2d-v1d )
        );
    }
    reverseHorizontal( d ) {
        d = Math.PI - d;
        if ( d < 0 ) return 2*Math.PI + d;
        return d;
    }
    reverseVertical( d ) {
        return 2*Math.PI - d;
    }
    step() {
        const hidden_boarder = 30;
        if ( Math.random() > .20 ) this.randomizeJerk();
        this.am = Math.min( .5, this.vectorSumM( this.am, this.ad, this.jm, this.jd ));
        this.ad = this.vectorSumD( this.am, this.ad, this.jm, this.jd );
        this.vm = Math.min( .5, this.vectorSumM( this.vm, this.vd, this.am, this.ad ));
        this.vd = this.vectorSumD( this.vm, this.vd, this.am, this.ad );
        this.x += this.vm * Math.cos( this.vd );
        this.y += this.vm * Math.sin( this.vd );
        if ( this.x-this.r < -1*hidden_boarder || this.x+this.r > canvas.offsetWidth+hidden_boarder ) {
            this.vd = this.reverseHorizontal(this.vd);
            this.ad = this.reverseHorizontal(this.ad);
            this.jd = this.reverseHorizontal(this.jd);
            if ( this.x-this.r < -1*hidden_boarder ) this.x = this.r-hidden_boarder;
            else this.x = canvas.offsetWidth+hidden_boarder-this.r;
        }
        if ( this.y-this.r < -1*hidden_boarder || this.y+this.r > canvas.offsetHeight+hidden_boarder ) {
            this.vd = this.reverseVertical(this.vd);
            this.ad = this.reverseVertical(this.ad);
            this.jd = this.reverseVertical(this.jd);
            if ( this.y-this.r < -1*hidden_boarder ) this.y = this.r-hidden_boarder;
            else this.y = canvas.offsetHeight+hidden_boarder-this.r;
        }


        // console.log(this.vm);
    }
    draw() {        
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        // console.log(this.y);
    }
};

let balls = [ ];
for ( var i = 0; i < 69; i++ )
    balls.push( new Ball() );
