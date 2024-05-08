//The state of the game 
//This is an object that describes many aspect of the game. From the size of the buildings to the position of the bomb
let state = {};

//The main canvas element and its drawing context
const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


newGame(); //Where everything starts

function newGame(){
    //Reset game state
    state = {
        phase: "aiming", //Aiming | in flight | celebrating
        currentPlayer: 1, //player 1 on the left, player 2 on the right
        bomb: {
            x: undefined,
            y: undefined,
            rotation: 0,
            velocity: { x: 0, y: 0 },
        },

        //Buildings
        backgroundBuildings: [],
        buildings: [],
        blastHoles: [],
    };

    //Generate background buildings. //This is the buildings in the back. This is just for decoration and aesthetics.
    for (let i = 0; i < 11; i++){
        generateBackgroundBuilding(i);
    }

    //Generate buildings //This is the buildings you will be playing on.
    for (let i = 0; i < 8; i++){
        generateBuilding(i);
    }

    initializeBombPosition();

    draw(); //next this function draws everything you will see and interact with on the screen
}

function draw(){
    ctx.save();

    //Flip coordinate system upside down
    ctx.translate(0, window.innerHeight); //This translate method shifts the origin point from the top left to the bottom left. 
    ctx.scale(1, -1); //When we move the origin point downwards, things are still inverted, using the "scale" method help flips it the right way round. //Flips the coordinate system upside down.
    //The reason why we do this is because the (coordinate origin point) is at the top left of the browser (0,0). 
    //In the context of a game, flipping it allows us to flip the origin point to the bottom, where it is more convenient when things happen from bottom to up.
    //Where the bottom of the screen is the ground, and we can build from the bottom.

    ///////
    //Draw scene
    drawBackground();
    drawBackgroundBuildings();
    drawBuildings();
    drawGorilla(1);
    drawGorilla(2);
    drawBomb();

    //Restore transformation
    ctx.restore();

}


//Main functions
//Event handlers
function throwBomb(){

}

//Use the animate function to move the bombs
function animate(timestamp){

}

function generateBackgroundBuilding(index){

}

function generateBuilding(index){

}

function initializeBombPosition(){
    
}

function drawBackground(){
    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight); //Paint the sky by defining a linear gradient. (x,x,y,y)
    gradient.addColorStop(1, "#F8BA85");
    gradient.addColorStop(0, "FFC28E");

    //Draw sky
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    //Draw the moon
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(300,350, 60, 0, 2 * Math.PI); //(x,y,radius,start angle, end angle)
    ctx.fill();

    //The block of code for drawing the moon is so long is because there is no shortcut for fill for a moon shape, so we have to manually do it.

}
//Note: The functions are written in chronological order of when things will happen as we play the game. So from calling a new game
//to printing the graphics, to throwing bombs and having them animated.