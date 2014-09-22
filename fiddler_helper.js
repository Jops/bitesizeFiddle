
var canvas_stage,
    container,
    fiddlerHelper,
    fiddlerImg,
    fiddlerSpeech;

var stageX, stageY, shiftKey;

var helperTarget = { x: 500, y: -100 },
    helperPotentials = { x: 0, y: 0 },
    springIntertia = 0.7,
    springKinetic = 0.05;
    helperIntervalTime = 32;
    helperMoveTime = 3000;
    helperMoveTimeOffset = 1000;
    helperJitterTime = 2000;
    helperJitterTimeOffset = 500;

var speech_container = null,
    bubble = null,
    tail = null,
    textFieldContainer = null,
    textField = null,
    textWidth = 10,
    legWidth = 15,
    legHeight = 20,
    legLeed = 5,
    paddingH = 10,
    paddingV = 10,
    slant = 15,
    min_width = 10,
    min_length = 3,
    max_length = 61,
    text_height = 30,
    bg_colour = '#000';

var codeText_elm;

var sampleText = [  "Remember, the variables are Integers.",
                    "Remember, I...am a fish!",
                    "Remember, a for loop...loops.",
                    "OK, so I ran out of hints.",
                    "Wright code and serve your robot overlords.",
                    "Something this way comes.",
                    "I am here to help.",
                    "Honestly I am here to help!",
                    "Write your code better, I am watching!",
                    "Statement: 'Your programming is inferior'.",
                    "Cake or death? ...cake or death?",
                    "Note to self: Am I a Piranha?"];

var fiddlerHelperMain = function() {
    window.onresize();

    canvas_stage = new createjs.Stage("_canvas");

    createjs.Ticker.setFPS( 24 );

    createjs.Ticker.addEventListener( "tick", tick );

    container = canvas_stage.addChild( new createjs.Container() );

    createHelper();

    setInterval( DO, helperIntervalTime );

    window.onclick = mouseDownHandler;

    window.onkeydown = keydownHandler;
    window.onkeyup = keyupHandler;

    codeText_elm = document.getElementById( "code-block" );

    randAction();
    JitterAction();
};

window.onresize = function( e ) {
    var _canvasElm  = document.getElementById("_canvas");
    _canvasElm.width  = window.innerWidth;
    _canvasElm.height = window.innerHeight;
};

var keydownHandler = function( e ) {
    var key_code = ( window.event ) ? event.keyCode : e.keyCode;
    if( key_code == 16 ) shiftKey = true;
};

var keyupHandler = function( e ) {
    var key_code = ( window.event ) ? event.keyCode : e.keyCode;
    if( key_code == 16 ) shiftKey = false;
};

function mouseDownHandler( e )
{
    if( shiftKey )
    {
        helperTarget.x = e.pageX;
        helperTarget.y = e.pageY;
    }
}

var tick = function( e )
{
    canvas_stage.update();
};

function DO()
{
    helperPotentials = jhMath_applySpring(  fiddlerHelper,
                                            helperTarget,
                                            helperPotentials,
                                            springIntertia,
                                            springKinetic );
    fiddlerHelper.x += helperPotentials.x;
    fiddlerHelper.y += helperPotentials.y;
}

function animateSpeechBubble( _time )
{
    createjs.Tween.get( fiddlerSpeech, { override:true } )
                  .to(  { alpha: 1 },
                        _time,
                        createjs.Ease.none )
                  .wait( 3000 )
                  .to(  { alpha: 0 },
                        _time*2,
                        createjs.Ease.none )
                  .call( randAction );
}

function animateFiddlerBounce( _time )
{
    createjs.Tween.get( fiddlerHelper, { override:true } )
                  .to(  { scaleX: 2, scaleY: 2, alpha: 1 },
                        _time,
                        createjs.Ease.none )
                  .to(  { scaleX: 1, scaleY: 1 },
                        _time*3,
                        createjs.Ease.bounceOut )
                  .call( animateFiddlerFade );
}

function animateFiddlerRock()
{
    createjs.Tween.get( fiddlerImg, { loop:true, override: true } )
                  .to(  { rotation: 10 },
                        1000,
                        createjs.Ease.bounceOut )
                  .to(  { rotation:-10 },
                        1000,
                        createjs.Ease.bounceOut );
}

function animateFiddlerFade()
{
    createjs.Tween.get( fiddlerHelper, { override:true } )
                  .wait( 2000 )
                  .to(  { alpha: 0 },
                        2000,
                        createjs.Ease.none );
}

function createHelper()
{
    fiddlerHelper = container.addChild( new createjs.Container() );
    fiddlerImg = fiddlerHelper.addChild( new createjs.Container() );
    var cubeImg = new createjs.Bitmap("bbc-bitesize.png");
    fiddlerImg.addChild( cubeImg );
    var bounds = cubeImg.getBounds();
    cubeImg.x = -bounds.width/2;
    cubeImg.y = -bounds.height/2;
    fiddlerImg.scaleX = fiddlerImg.scaleY = 0.2;
    fiddlerImg.rotation = -10;
    animateFiddlerRock();
    fiddlerSpeech = fiddlerHelper.addChild( new createjs.Container() );
    fiddlerSpeech.x = 10;
    fiddlerSpeech.y = -20;
    speech_init( fiddlerSpeech );
    fiddlerSpeech.alpha = 0;
    setText("");
}

function randAction()
{
    var action = function() {
        setText( sampleText[ Math.floor( jhMath_randRange( 0, sampleText.length-1 ) ) ] );
        animateSpeechBubble( 500 );
        animateFiddlerBounce( 300 );
        var offset = elementOffset( codeText_elm );
        helperTarget.x = offset.left + offset.width + jhMath_randRange( -200, 100 );
        helperTarget.y = offset.top + jhMath_randRange( -50, 100 );
    };
    setTimeout( action, jhMath_randRange( helperMoveTime-helperMoveTimeOffset, helperMoveTime+helperMoveTimeOffset ) );
}

function JitterAction()
{
    var action = function() {
        helperTarget.x = helperTarget.x + jhMath_randRange( -50, 50 );
        helperTarget.y = helperTarget.y + jhMath_randRange( -50, 50 );
        JitterAction();
    };
    setTimeout( action, jhMath_randRange( helperJitterTime-helperJitterTimeOffset, helperJitterTime+helperJitterTimeOffset ) );
}

/**
 * @desc applies 2D spring to a display object returning the new
 *       point incremenation
 * @param obj - display object with xy vec
 * @param target - xy vec target
 * @param potential - the current displacement xy vec (from last calculation)
 * @param inertia - value from 0.1 - 0.9 (default 0.9)
 * @param kinetic - value from 0.1 - 0.9 (default 0.5)
 */
function jhMath_applySpring( obj, target, potential, inertia, kinetic )
{
    var dist    = -obj.x + target.x;
    potential.x = potential.x*inertia + dist*kinetic;
    dist        = -obj.y + target.y;
    potential.y = potential.y*inertia + dist*kinetic;
    return potential;
}

/**
 * @desc generate a random number within given constraints.
 * @param min
 * @param max
 * @return Number
 */
function jhMath_randRange( min, max )
{
    return Math.random()*( max-min+1 )+min;
}

function elementOffset( elm )
{
    var obj = elm.getBoundingClientRect();
    return {    left: obj.left + window.scrollX,
                top: obj.top + window.scrollY,
                width: obj.width,
                height: obj.height };
}

function speech_init( _container )
{
    speech_container = _container.addChild( new createjs.Container() );
    tail = speech_container.addChild( new createjs.Shape() );
    bubble = speech_container.addChild( new createjs.Shape() );
    textFieldContainer = speech_container.addChild( new createjs.Container() );
    textField = new createjs.Text("", "16px Ariel", "#ff7700");
    textField.textBaseline = "alphabetic";
    textFieldContainer = speech_container.addChild( new createjs.Container() );
    textFieldContainer.addChild( textField );
}

function render()
{
    renderLeg();
    renderBubble();
}

function renderBubble()
{
    var w = textWidth;
    if( w < min_width ) w = min_width;
    var rect = {    left: -((w/2)+slant),
                    top: -(legHeight+text_height),
                    right: (w/2)+slant,
                    bottom: -legHeight };

    var gfx = bubble.graphics;
    gfx.clear();
    gfx.beginFill( bg_colour )
       .moveTo( rect.left, rect.bottom )
       .lineTo( rect.left + slant, rect.top )
       .lineTo( rect.right + slant, rect.top )
       .lineTo( rect.right, rect.bottom )
       .lineTo( rect.left, rect.bottom )
       .endFill();

    placeText( rect.left + slant + paddingH, rect.bottom-paddingV );
}

function renderLeg()
{
    // renderCurvedLeg();
    renderSpikeLeg();
}

function renderCurvedLeg()
{
    var gfx = tail.graphics;
    gfx.clear();
    gfx.beginFill( bg_colour )
       .moveTo( 0, 0 )
       .bt( legWidth, 0,
            legWidth, -legHeight,
            legWidth, -legHeight  )
       .lineTo( legLeed, -legHeight )
       .bt( legLeed, 0,
            0, 0,
            0, 0  )
       .endFill();
}

function renderSpikeLeg()
{
    var gfx = tail.graphics;
    gfx.clear();
    gfx.beginFill( bg_colour )
       .moveTo( 0, 0 )
       .lineTo( legWidth, -legHeight  )
       .lineTo( legLeed, -legHeight )
       .lineTo( 0, 0  )
       .endFill();
}

function placeText( _x, _y )
{
    textFieldContainer.x = _x;
    textFieldContainer.y = _y;
}

function setText( msg )
{
    textField.text = msg;
    calculateTextWidth();
    render();
}

function calculateTextWidth()
{
    textWidth = textField.getMeasuredWidth();
}