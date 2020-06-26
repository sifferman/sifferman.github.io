var volume_slider = document.getElementById( "volume_slider" );

var voice = document.getElementById("voice_audio");
voice.muted = false;
voice.volume = volume_slider.value;
var hype = document.getElementById("hype_audio");
hype.muted = true;
hype.volume = volume_slider.value;
var eb = document.getElementById("eb_audio");
eb.muted = true;
eb.volume = volume_slider.value;
var bass = document.getElementById("bass_audio");
bass.muted = true;
bass.volume = volume_slider.value;
var percussion = document.getElementById("percussion_audio");
percussion.muted = true;
percussion.volume = volume_slider.value;
var clap = document.getElementById("clap_audio");
clap.volume = volume_slider.value;
var raindrop = document.getElementById("raindrop_audio");
raindrop.volume = volume_slider.value;
var ethan = document.getElementById("ethan_audio");
ethan.volume = volume_slider.value;




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
    // console.log(canvas.height);
}

const line_begin = .154;
const line_end   = .945;
const measures = 7;
var Ireset = 0;
function draw() { setTimeout(function() {

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    var t = ( 4*voice.currentTime / voice.duration ) % 1;
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

function sync() {
    const delay = .01;
    if ( Math.abs(       hype.currentTime - voice.currentTime ) > delay )       hype.currentTime = voice.currentTime;
    if ( Math.abs(         eb.currentTime - voice.currentTime ) > delay )         eb.currentTime = voice.currentTime;
    if ( Math.abs(       bass.currentTime - voice.currentTime ) > delay )       bass.currentTime = voice.currentTime;
    if ( Math.abs( percussion.currentTime - voice.currentTime ) > delay ) percussion.currentTime = voice.currentTime;
}


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
        sync();
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
    sync();
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
        hype.currentTime = voice.currentTime;
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
        eb.currentTime = voice.currentTime;
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
        bass.currentTime = voice.currentTime;
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
        percussion.currentTime = voice.currentTime;
        percussion.muted = false;
        percussion_b.src = "media/music/icons/sfx-button.svg";
    } else {
        percussion.muted = true;
        percussion_b.src = "media/music/icons/mute-button.svg";
    }
}

// volume
volume_slider.oninput = function() {
        voice.volume = this.value;
         hype.volume = this.value;
           eb.volume = this.value;
         bass.volume = this.value;
    percussion.volume = this.value;
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

function handleVisibilityChange() {
    if ( document.hidden ) {
        paused = false;
        playToggle();
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);