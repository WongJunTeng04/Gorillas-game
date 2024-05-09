//Note: The functions are written in chronological order of when things will happen as we play the game. So from calling a new game
//to printing the graphics, to throwing bombs and having them animated.


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

        scale: 1,
    };

    //Generate background buildings. //This is the buildings in the back. This is just for decoration and aesthetics.
    for (let i = 0; i < 11; i++){
        generateBackgroundBuilding(i);
    }

    //Generate buildings //This is the buildings you will be playing on.
    for (let i = 0; i < 8; i++){
        generateBuilding(i);
    }

    calculateScale();

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
    ctx.scale(state.scale, state.scale);

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

//!!!!Entity generation!!!!
function generateBackgroundBuilding(index){
    const previousBuilding = state.backgroundBuildings[index - 1];

    const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4 //Adds 4 units as a gap from the previous building.
    : -30;


    //Generate the sizes for the building. where the width and height is random. For the width, anything between 60 and 110 is allowed.
    const minWidth = 60;
    const maxWidth = 110;
    const width = minWidth + Math.random() * (maxWidth - minWidth);

    //Generate the sizes for the building. where the width and height is random. For the height, anything between 80 and 350 is allowed.
    const minHeight = 80;
    const maxHeight = 350;
    const height = minHeight + Math.random() * (maxHeight - minHeight);

    state.backgroundBuildings.push({x, width, height });
}

function generateBuilding(index){
    const previousBuilding = state.buildings[index -1]; //Starting place.

    const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : 0;

    const minWidth = 80;
    const maxWidth = 130;
    const width = minWidth + Math.random() * (maxWidth - minWidth);

    const platformWithGorilla = index === 1 || index === 6;

    const minHeight = 40;
    const maxHeight = 300;
    const minHeightGorilla = 30;
    const maxHeightGorilla = 150;

    const height = platformWithGorilla
    ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
    : minHeight + Math.random() * (maxHeight - minHeight);


    //Generate an array of booleans to show if the light is on or off in a room. //For aesthetic reasons
    const lightsOn = [];
    for (let i = 0; i < 50; i++) {
        const light = Math.random() <= 0.33 ? true : false;
        lightsOn.push(light);
    }

    state.buildings.push({x, width, height, lightsOn });
}

function initializeBombPosition(){
    const building = 
    state.currentPlayer === 1
        ? state.buildings.at(1) //second building
        : state.buildings.at(-2); //Second last building

    const gorillaX = building.x + building.width / 2;
    const gorillaY = building.height;

    const gorillaHandOffsetX = state.currentPlayer === 1 ? -28 : 28;
    const gorillaHandOffsetY = 107;

    state.bomb.x = gorillaX + gorillaHandOffsetX;
    state.bomb.y = gorillaY + gorillaHandOffsetY;
    state.bomb.velocity.x = 0;
    state.bomb.velocity.y = 0;
}


//!!!!Drawing the entities on the canvas!!!!
function drawBackground(){
    const background = ctx.createLinearGradient(0, 0, 0, window.innerHeight / state.scale); //Paint the sky by defining a linear gradient. (x,x,y,y)
    gradient.addColorStop(1, "#F8BA85");
    gradient.addColorStop(0, "FFC28E");

    //Draw sky
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, window.innerWidth / state.scale , window.innerHeight / state.scale);

    //Draw the moon
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(300, 350, 60, 0, 2 * Math.PI); //(x,y,radius,start angle, end angle)
    ctx.fill();

    //The block of code for drawing the moon is so long is because there is no shortcut for fill for a moon shape, so we have to manually do it.

}

function drawBackgroundBuildings() {
    state.backgroundBuildings.array.forEach((building) => {
        ctx.fillStyle = "#947285";
        ctx.fillRect(building.x, 0, building.width, building.height); 
    });
}

function drawBuildings() {
    state.buildings.forEach((building) => {
        //Draw buildings
        ctx.fillStyle = "#4A3C68"; //Set colour for the main buildings
        ctx.fillRect(building.x, 0, bulding.width, building.height);

        //Draw windows
        const windowWidth = 10; //Window should have a width of 10 units
        const windowHeight = 12; //Window should have a height of 12 units
        const gap = 15; 
        //Decides how far the window is from the top left corner of the building (both horizontally and vertically(like a padding))
        //&& the gap between each window.
        
        const numberOfFloors = Math.ceil(
            (building.height - gap) / (windowHeight + gap)
        );

        const numberOfRoomsPerFloor = Math.floor(
            (building.width - gap) / (windowWidth + gap)
        );

        for (let floor = 0; floor < numberOfFloors; floor++) {
            for (let room = 0; room < numberOfRoomsPerFloor; room++){
                if (building.lightsOn[floor * numberOfRoomsPerFloor + room]){ //If there is lights on in the room, print a window.
                    ctx.save(); 

                    ctx.translate(building.x + gap, building.height - gap); //Positioning the window in a 2d grid that is initialised above.
                    ctx.scale(1, -1);
                    
                    //Drawing the windows.
                    const x = room * (windowWidth + gap);
                    const y = floor * (windowHeight + gap);

                    ctx.fillStyle = "#EBB6A2";
                    ctx.fillRect(x, y, windowWidth, windowHeight);

                    ctx.restore();
                }
            }
        }
    });
}

//Drawing the gorillas.
function drawGorilla(player) {
    ctx.save();

    const building = 
    player === 1
    ? state.buildings.at(1) //Second building
    : state.buildings.at(-2) //Second last building

    ctx.translate(building.x + building.width / 2, buidling.height);

    drawGorillaBody();
    drawGorillaLeftArm(player);
    drawGorillaRightArm(player);
    drawGorillaFace(player);

    ctx.restore();
}

function drawGorillaBody() {
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, 15); //left leg outline
    ctx.lineTo(-7, 0); //left leg outline
    ctx.lineTo(-20, 0); //left foot outline
    ctx.lineTo(-17, 18); //body
    ctx.lineTo(-20, 44); //body

    ctx.lineTo(-11, 77); //body
    ctx.lineTo(0, 84); //body
    ctx.lineTo(11, 77); //body

    ctx.lineTo(20, 44); //body
    ctx.lineTo(17, 18); //body
    ctx.lineTo(20, 0); //body
    ctx.lineTo(7, 0); //body
    ctx.fill(); //fill the shape
}

function drawGorilla(player) {
    ctx.save();

    const building = 
    player === 1
    ? state.buildings.at(1) //Second building
    : state.buildings.at(-2); //Second last building

    ctx.translate(building.x + building.width / 2, building.height);

    drawGorillaBody();
    drawGorillaLeftArm(player);
    drawGorillaRightArm(player);
    drawGorillaFace(player);

    ctx.restore();
}

function drawGorillaLeftArm(player) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 18;

    ctx.beginPath();
    ctx.moveTo(-14, 50);

    if (state.phase === "aiming" && state.currentPlayer === 1 && player === 1) {
        ctx.quadraticCurveTo(-44, 63, -28, 107); //Aiming (while holding the bomb)
    } else if (state.phase === "celebrating" && state.currentPlayer === player) {
        ctx.quadraticCurveTo(-44, 63, -28, 107); //Celebrating
    } else{
        ctx.quadraticCurveTo(-44, 45, -28, 12); //Neutral 
    }

    ctx.stroke();
}

function drawGorillaRightArm(player) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 18;

    ctx.beginPath();
    ctx.moveTo(+14, 50);

    if (state.phase === "aiming" && state.currentPlayer === 2 && player === 2){
        ctx.quadraticCurveTo(+44, 63, +28, 107); //Aiming (while holding the bomb)
    } else if (state.phase ==="celebrating" && state.currentPlayer === player) {
        ctx.quadraticCurveTo(+44, 63, +28, 107); //Celebrating
    } else{
        ctx.quadraticCurveTo(+44, 45, +28, 12); //Neutral
    }

    ctx.stroke();

}

function drawGorillaFace(player) {
    //Face
    ctx.fillStyle = "lightgray";
    ctx.beginPath();
    ctx.arc(0, 63, 9, 0, 2 * Math.PI);
    ctx.moveTo(-3.5, 70);
    ctx.arc(-3.5, 70, 4, 0, 2 * Math.PI);
    ctx.moveTo(+3.5, 70);
    ctx.arc(+3.5, 70, 4, 0, 2 * Math.PI);
    ctx.fill();

    //Eyes
     ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-3.5, 70, 1.4, 0, 2 * Math.PI);
    ctx.moveTo(+3.5, 70);
    ctx.arc(+3.5, 70, 1.4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.4;

    //Nose
    ctx.beginPath();
    ctx.moveTo(-3.5, 66.5);
    ctx.lineTo(-1.5, 65);
    ctx.moveTo(3.5, 66.5);
    ctx.lineTo(1.5, 65);
    ctx.stroke();

    //Mouth
    ctx.beginPath();
    if (state.phase === "celebrating" && state.currentPlayer === player) {
        ctx.moveTo(-5, 60);
        ctx.quadraticCurveTo(0, 56, 5, 60);
    } else {
        ctx.moveTo(-5, 56);
        ctx.quadraticCurveTo(0, 60, 5, 56);
    }
    ctx.stroke();
}

function drawBomb() {
    ctx.save();
    ctx.translate(state.bomb.x, state.bomb.y);

    //Draw circle
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.fill();

    //Restore transformation
    ctx.restore();
}

function calculateScale() {
    const lastBuilding = state.buildings.at(-1);
    const totalWidthOfTheCity = lastBuilding.x + lastBuilding.width;

    state.scale = window.innerWidth / totalWidthOfTheCity;
}

//Resize canvas element to fit the new size.
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateScale();
    initializeBombPosition();
    draw();
});