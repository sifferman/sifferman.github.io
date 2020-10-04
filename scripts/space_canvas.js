
var canvas = document.getElementById( "Space__Canvas" );
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

var friction = document.getElementById("Friction").value;
var speed = document.getElementById("Speed").value;
var distance_exponent = document.getElementById("Distance-Exponent").value;
var num_planets = document.getElementById("Num-Planets").value;

var planets = [ ];
class Planet {
    constructor() {
        this.r = 3 + Math.random() * 16;
        this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.g = Math.pow( this.r, 3 )/18;
        this.x = Math.random() * canvas.offsetWidth - canvas.offsetWidth/2;
        this.y = Math.random() * canvas.offsetHeight - canvas.offsetHeight/2;
        this.vm = Math.random() * 5;
        this.vd = Math.random() * 2 * Math.PI;
        this.am = 0;
        this.ad = 0;
    }
    static init() { Planet.update_num_planets(); }
    static step() { for ( var p of planets ) p.step(); }
    static draw() { for ( var p of planets ) p.draw(); }
    changeAcceleration( planet ) {
        // find accelleration due to Gravity
        var AM = planet.g /
            Math.pow(
                Math.pow(this.x-planet.x,2) + Math.pow(this.y-planet.y,2),
                1/2 * distance_exponent
            );
        AM = Math.min( AM, 100 );
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
    static update_num_planets() {
        while ( num_planets > planets.length )
            planets.push( new Planet() );
        while ( num_planets < planets.length )
            planets.pop();
        planets.sort(function(a, b) { return b.r - a.r; });
    }
    step() {
        this.vm = this.vectorSumM( this.vm, this.vd, this.am*speed, this.ad);
        this.vd = this.vectorSumD( this.vm, this.vd, this.am*speed, this.ad );
        this.vm *= 1 - Math.pow( friction, 1/speed );
        this.x += this.vm * Math.cos( this.vd )*speed / 10;
        this.y += this.vm * Math.sin( this.vd )*speed / 10;

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
        for ( var p of planets )
            if ( p != this )
                this.changeAcceleration( p );

        // if ( this == Planet.#planets[0] ) console.log( this.vm );
    }
    draw() {
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc( this.x, this.y, this.r, 0, 2 * Math.PI );
        ctx.fill();
        // console.log( "drawing" );
    }
}

Planet.init();

document.getElementById("Friction").oninput = function()
    { friction = this.value; /* console.log("Friction: "); console.log(friction); */ }
document.getElementById("Speed").oninput = function()
    { speed = this.value; /* console.log("Speed: "); console.log(speed); */ }
document.getElementById("Distance-Exponent").oninput = function()
    { distance_exponent = this.value; /* console.log("Distance-Exponent: "); console.log(distance_exponent); */ }
document.getElementById("Num-Planets").oninput = function()
    { num_planets = this.value; Planet.update_num_planets(); /* console.log("Num-Planets: "); console.log(num_planets); */ }







function draw() { setTimeout(function() {

    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    
    Planet.step();
    Planet.draw();

    requestAnimationFrame(draw);

}, 20);}
