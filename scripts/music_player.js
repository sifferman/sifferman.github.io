
var voice = document.getElementById("voice_audio");
var hype = document.getElementById("hype_audio");

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

const line_begin = .142;
const line_end   = .97;
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
}, 25);}


function play() {
    voice.play();
    hype.play();
    voice.muted = !document.getElementById("check_voice").checked;
     hype.muted = !document.getElementById("check_hype").checked;
}

voice.addEventListener("ended", function() {
    voice.currentTime = 0;
    hype.currentTime = 0;
    voice.play();
    hype.play();
});

function toggle_voice(cb) { voice.muted = !cb.checked; }
function  toggle_hype(cb) {  hype.muted = !cb.checked; }
