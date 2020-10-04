// musicPlayer_canvas.js //

var volume_slider = document.getElementById( "Volume__Slider" );

var audio = [ ];
audio.push( document.getElementById("Audio__Voice") );
audio.push( document.getElementById("Audio__Hype") );
audio.push( document.getElementById("Audio__Eb") );
audio.push( document.getElementById("Audio__Bass") );
audio.push( document.getElementById("Audio__Percussion") );
for ( var a of audio ) {
    a.muted = true;
    a.volume = volume_slider.value;
    a.currentTime = 0;
}
audio[0].muted = false;


var clap = document.getElementById("Audio__Clap");
clap.volume = volume_slider.value;
var raindrop = document.getElementById("Audio__Raindrop");
raindrop.volume = volume_slider.value;
var ethan = document.getElementById("Audio__Ethan");
ethan.volume = volume_slider.value;


var mute_buttons = [ ];
mute_buttons.push( document.getElementById("Mute__Voice") );
mute_buttons.push( document.getElementById("Mute__Hype") );
mute_buttons.push( document.getElementById("Mute__Eb") );
mute_buttons.push( document.getElementById("Mute__Bass") );
mute_buttons.push( document.getElementById("Mute__Percussion") );


var play_delay = [ ];
while ( play_delay.length < 5 ) play_delay.push( 0 );



var canvas = document.getElementById("Player__Canvas");
var ctx = canvas.getContext("2d");

var sheet_music = document.getElementById("Sheet-Music");

fitToContainer(canvas);
draw();

sheet_music.addEventListener("load", fitToContainer);
window.addEventListener('resize', fitToContainer);

function fitToContainer() {
    canvas.style.width = "100%";
    canvas.width  = canvas.offsetWidth;
    canvas.height = sheet_music.height * 1.1;
    // console.log(canvas.height);
}

const line_begin = .154;
const line_end   = .945;
const measures = 7;
var Ireset = 0;
function draw() { setTimeout(function() {

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    var t = ( 4*audio[0].currentTime / audio[0].duration ) % 1;
    var line_x = canvas.offsetWidth * ( line_begin + t * ( line_end - line_begin ) );

    ctx.lineWidth = canvas.offsetWidth / 350;
    ctx.strokeStyle = "green";
    ctx.globalAlpha = .5;
    ctx.beginPath();
    ctx.moveTo( line_x, canvas.offsetHeight * .02 );
    ctx.lineTo( line_x, canvas.offsetHeight * .93 );
    ctx.stroke();

    if ( t*measures-1.5 > Ireset || ( Ireset==6 && t*measures < .5 ) ) {
        sync();
        Ireset++;
        Ireset %= ( measures );
        // console.log(Ireset);
    }

    requestAnimationFrame(draw);
}, 0);}


const delay = .01;
function sync( w_delay = 1 ) {
    for ( var i = 1; i < audio.length; i++ ) {

        if ( Math.abs( audio[i].currentTime - audio[0].currentTime ) > delay ) {

            let temp_delay = audio[i].currentTime - audio[0].currentTime;
            play_delay[i] += ( (Math.abs(temp_delay)>1) ? 0:temp_delay );
            audio[i].currentTime = audio[0].currentTime - play_delay[i]*w_delay;
        }
        // console.log( i.toString()+": "+play_delay[i].toString() );
    }

}


var paused = true;
var playToggle_b = document.getElementById("PlayToggleButton");

function playToggle() {
    paused = !paused;
    
    if ( !paused ) {
        playToggle_b.src = "../media/music/main/icons/pause-button.svg";
        for ( var a of audio ) a.play();
    }
    else {
        playToggle_b.src = "../media/music/main/icons/play-button.svg";
        sync( 0 );
        for ( var a of audio ) a.pause();
    }

}

// repeat
audio[0].addEventListener("ended", function() {
    audio[0].currentTime = 0;
    sync( 0 );
    for ( var a of audio ) a.play();
});

// mute

function toggle_voice()      { toggle_mute(0); }
function toggle_hype()       { toggle_mute(1); }
function toggle_eb()         { toggle_mute(2); }
function toggle_bass()       { toggle_mute(3); }
function toggle_percussion() { toggle_mute(4); }

function toggle_mute( i ) {
    if ( audio[i].muted ) {
        audio[i].muted = false;
        mute_buttons[i].src = "../media/music/main/icons/sfx-button.svg";
    } else {
        audio[i].muted = true;
        audio[i].currentTime = audio[0].currentTime - play_delay[i];
        mute_buttons[i].src = "../media/music/main/icons/mute-button.svg";
    }
}


// volume
volume_slider.oninput = function() {
    for ( var a of audio ) a.volume = this.value;
    clap.volume = this.value;
    raindrop.volume = this.value;
    ethan.volume = this.value;
}

function playClap() {
    clap.currentTime = 0;
    clap.play();
}
function playRaindrop() {
    raindrop.currentTime = 0;
    raindrop.play();
}
function playEthan() {
    ethan.currentTime = 0;
    ethan.play();
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
function handleVisibilityChange() {
    if ( document.hidden ) {
        paused = false;
        playToggle();
    }
}
