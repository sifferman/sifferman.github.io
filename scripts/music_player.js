var volume_slider = document.getElementById( "volume_slider" );

var voice = document.getElementById("voice_audio");
voice.muted = false;
voice.volume = volume_slider.value/100;
var hype = document.getElementById("hype_audio");
hype.muted = true;
hype.volume = volume_slider.value/100;
var eb = document.getElementById("eb_audio");
eb.muted = true;
eb.volume = volume_slider.value/100;
var bass = document.getElementById("bass_audio");
bass.muted = true;
bass.volume = volume_slider.value/100;
var percussion = document.getElementById("percussion_audio");
percussion.muted = true;
percussion.volume = volume_slider.value/100;
var clap = document.getElementById("clap_audio");
clap.volume = volume_slider.value/100;
var raindrop = document.getElementById("raindrop_audio");
raindrop.volume = volume_slider.value/100;
var ethan = document.getElementById("ethan_audio");
ethan.volume = volume_slider.value/100;




var canvas = document.getElementById("player_canvas");
var ctx = canvas.getContext("2d");

var sheet_music = document.getElementById("sheet_music");

fitToContainer(canvas);
draw();

sheet_music.addEventListener("load", fitToContainer);
window.addEventListener('resize', fitToContainer);

function fitToContainer() {
    canvas.style.width = "100%";
    canvas.width  = canvas.offsetWidth;
    canvas.height = sheet_music.height * 1.1;
    console.log(canvas.height);
}

const line_begin = .154;
const line_end   = .945;
function draw() { setTimeout(function() {

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    var t = ( 4*voice.currentTime / voice.duration ) % 1;
    var line_x = canvas.offsetWidth * ( line_begin + t * ( line_end - line_begin ) );

    ctx.lineWidth = canvas.offsetWidth / 350;
    ctx.strokeStyle = "green";
    ctx.globalAlpha = .5;
    ctx.beginPath();
    ctx.moveTo( line_x, canvas.offsetHeight * .02 );
    ctx.lineTo( line_x, canvas.offsetHeight * .98 );
    ctx.stroke();

    requestAnimationFrame(draw);
}, 0);}



var paused = true;
var playToggle_b = document.getElementById("playToggle_b");

function playToggle() {
    paused = !paused;
    
    if ( !paused ) {
        playToggle_b.src = "media/music/icons/pause-button.svg";
        voice.play();
         hype.play();
           eb.play();
         bass.play();
    percussion.play();
    }
    else {
        playToggle_b.src = "media/music/icons/play-button.svg";
        voice.pause();
         hype.pause();
           eb.pause();
         bass.pause();
    percussion.pause();
    }

}

// repeat
voice.addEventListener("ended", function() {
        voice.currentTime = 0;
         hype.currentTime = 0;
           eb.currentTime = 0;
         bass.currentTime = 0;
    percussion.currentTime = 0;
        voice.play();
         hype.play();
           eb.play();
         bass.play();
    percussion.play();
});

// mute
var voice_b = document.getElementById("voice_mute");
function      toggle_voice() {
    if ( voice.muted ) {
        voice.muted = false;
        voice_b.src = "media/music/icons/sfx-button.svg";
    } else {
        voice.muted = true;
        voice_b.src = "media/music/icons/mute-button.svg";
    }
}
var hype_b = document.getElementById("hype_mute");
function      toggle_hype() {
    if ( hype.muted ) {
        hype.muted = false;
        hype_b.src = "media/music/icons/sfx-button.svg";
    } else {
        hype.muted = true;
        hype_b.src = "media/music/icons/mute-button.svg";
    }
}
var eb_b = document.getElementById("eb_mute");
function      toggle_eb() {
    if ( eb.muted ) {
        eb.muted = false;
        eb_b.src = "media/music/icons/sfx-button.svg";
    } else {
        eb.muted = true;
        eb_b.src = "media/music/icons/mute-button.svg";
    }
}
var bass_b = document.getElementById("bass_mute");
function      toggle_bass() {
    if ( bass.muted ) {
        bass.muted = false;
        bass_b.src = "media/music/icons/sfx-button.svg";
    } else {
        bass.muted = true;
        bass_b.src = "media/music/icons/mute-button.svg";
    }
}
var percussion_b = document.getElementById("percussion_mute");
function      toggle_percussion() {
    if ( percussion.muted ) {
        percussion.muted = false;
        percussion_b.src = "media/music/icons/sfx-button.svg";
    } else {
        percussion.muted = true;
        percussion_b.src = "media/music/icons/mute-button.svg";
    }
}

// volume
volume_slider.oninput = function() {
        voice.volume = this.value/100;
         hype.volume = this.value/100;
           eb.volume = this.value/100;
         bass.volume = this.value/100;
    percussion.volume = this.value/100;
    clap.volume = this.value/100;
    raindrop.volume = this.value/100;
ethan.volume = this.value/100;
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

function handleVisibilityChange() {
    if ( document.hidden ) {
        paused = false;
        playToggle();
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);