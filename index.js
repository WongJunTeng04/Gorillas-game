//The state of the game 
//This is an object that describes many aspect of the game. From the size of the buildings to the position of the bomb
let state = {};

//The main canvas element and its drawing context
const canvas = document.getElementsById("game");
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

//Note: The functions are written in chronological order of when things will happen as we play the game. So from calling a new game
//to printing the graphics, to throwing bombs and having them animated.