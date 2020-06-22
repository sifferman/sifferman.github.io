
var canvas = document.getElementById( "space_canvas" );
var ctx = canvas.getContext("2d");

fitToContainer();
draw();

window.addEventListener('resize', fitToContainer);

function fitToContainer() {
    canvas.style.width='100%';
    canvas.style.height='calc( 22.9vw + 7vmin + 70px + 180px )';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.translate(canvas.offsetWidth/2, canvas.offsetHeight/2);
}

class Planet {
    constructor() {
        this.r = 3 + Math.random() * 16;
        this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.g = Math.pow( this.r, 2 )/10;
        this.x = Math.random() * canvas.offsetWidth - canvas.offsetWidth/2;
        this.y = Math.random() * canvas.offsetHeight - canvas.offsetHeight/2;
        this.vm = Math.random() * 2;
        this.vd = Math.random() * 2 * Math.PI;
        this.am = 0;
        this.ad = 0;
    }
    static #planets = [ ];
    static init( num_planets ) {
        for ( var i = 0; i < num_planets; i++ )
            Planet.#planets.push( new Planet() );
        Planet.#planets.sort(function(a, b) { return b.r - a.r; });
    }
    static step() { for ( var p of Planet.#planets ) p.step(); }
    static draw() { for ( var p of Planet.#planets ) p.draw(); }
    changeAcceleration( planet ) {
        // find accelleration due to Gravity
        var AM = planet.g / ( Math.pow(this.x-planet.x,2) + Math.pow(this.y-planet.y,2) );
        AM = Math.min( AM, 10 );
        // find accelleration direction
        var AD = Math.atan2( planet.y-this.y, planet.x-this.x );
        // add accelleration vector
        this.am = this.vectorSumM( this.am, this.ad, AM, AD );
        this.ad = this.vectorSumD( this.am, this.ad, AM, AD );
        // console.log( this.color );
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
        this.vm = this.vectorSumM( this.vm, this.vd, this.am, this.ad );
        this.vd = this.vectorSumD( this.vm, this.vd, this.am, this.ad );
        this.vm *= .9925;
        this.x += this.vm * Math.cos( this.vd );
        this.y += this.vm * Math.sin( this.vd );

        if ( this.x-this.r < -canvas.offsetWidth/2 || this.x+this.r > canvas.offsetWidth/2 ) {
            this.vd = this.reverseHorizontal(this.vd);
            if ( this.x-this.r < -canvas.offsetWidth/2 ) this.x = this.r-canvas.offsetWidth/2;
            else this.x = canvas.offsetWidth/2-this.r;
        }
        if ( this.y-this.r < -canvas.offsetHeight/2 || this.y+this.r > canvas.offsetHeight/2 ) {
            this.vd = this.reverseVertical(this.vd);
            if ( this.y-this.r < -canvas.offsetHeight/2 ) this.y = this.r-canvas.offsetHeight/2;
            else this.y = canvas.offsetHeight/2-this.r;
        }

        this.am = 0;
        for ( var p of Planet.#planets )
            if ( p != this )
                this.changeAcceleration( p );
    }
    draw() {
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc( this.x, this.y, this.r, 0, 2 * Math.PI );
        ctx.fill();
        // console.log( "drawing" );
    }
}

Planet.init( 20 );


function draw() { setTimeout(function() {

    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    
    Planet.step();
    Planet.draw();

    requestAnimationFrame(draw);

}, 30);}