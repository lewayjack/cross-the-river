"use strict";

var gameObject = function(posX, posY, gOSpt) {
    this.x = posX;
    this.y = posY;
    this.sprite = gOSpt;
};

gameObject.prototype.render = function() {
ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var inherit = function(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.constructor = subClass; // set constructor on prototype
};

var score = 0,
    level = 1,
    hero = 3;
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

var Enemy = function(row, start) {
    let posY = 60 + row * TILE_HEIGHT;
    gameObject.call(this, start, posY, "images/enemy-bug.png");
    this.speed = getRandNum(1, 3);

};

inherit(Enemy, gameObject);
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x < 505) {
        this.x = this.x + TILE_WIDTH * dt * this.speed;
    } else {
        this.x = enemyStart[getRandNum(0, 3)];
        this.speed = getRandNum(1, 4);
    }
};

// Enemy.prototype.render = function() {
    // ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };



// my own player class include update(), render() and a handleInput() method
var Player = function() {
    gameObject.call(this, 200, 384, cos[getRandNum(0, 7)]);
};

inherit(Player, gameObject);
Player.prototype.update = function() {
    this.x;
    this.y;
    this.checkCollisions();
    this.checkMsg(winMsg);

};



Player.prototype.handleInput = function(passedKey) {
    if (passedKey === "left" && this.x > 50) {
        this.x = this.x - TILE_WIDTH;
    } else if (passedKey === "right" && this.x < 350) {
        this.x = this.x + TILE_WIDTH;
    } else if (passedKey === "down" && this.y < 350) {
        this.y = this.y + TILE_HEIGHT;
    } else if (passedKey === "up") {
        if (this.y > 40) {
            this.y = this.y - TILE_HEIGHT;
            if (score >= level * 50 && this.y < 0) {
                this.reset();
                winMsg = 1;
                score = 0;
                level++;
            }
        }

    }
    passedKey = null; //clear the value of the key
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 384;
    this.sprite = cos[getRandNum(0, 7)];
};

Player.prototype.checkCollisions = function() {
    if (this.x >= gem.x - 50 &&
        this.x < gem.x + 50 &&
        this.y >= gem.y - 73 &&
        this.y <= gem.y + 13) {
        score++; //player move on the gems to collect gems
    };
    for (var i = 0; i < numberOfEnemies; i++) {
        if (this.x >= allEnemies[i].x - 50 &&
            this.x < allEnemies[i].x + 60 &&
            this.y >= allEnemies[i].y - 10 &&
            this.y <= allEnemies[i].y + 10) { //set this value to set the range to check collisions bugs
            //console.log("lose", this.x, allEnemies[i].x, this.y, allEnemies[i].y);

            this.reset();
            winMsg = 2;
            hero--;
        }
    }

};

Player.prototype.checkMsg = function(msg) {

    if (msg === 1) {
        showTopMessage('MISSION ' + level + '!!!');
        setTimeout("winMsg = 0", 800);
    } else if (msg === 2) {
        showTopMessage("OOPS!!!");
        setTimeout("winMsg = 3", 600);
    } else if (msg === 0) {
        let limit = level * 50 - score >= 0 ? level * 50 - score : 0; //make sure player collect enough gems
        showTopMessage("GO GET " + limit + " GEMS!!!");
        if (limit === 0) {
            showTopMessage("GO!!!");
        }
    } else if (msg === 3) {
        showTopMessage(hero + ' HERO LEFT!!!');
        setTimeout("winMsg = 0", 600);
    }
};

// Player.prototype.render = function() {
    // ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

var Gem = function() {
    var x = TILE_WIDTH + getRandNum(1, 5) + 25;
    var y = TILE_HEIGHT + getRandNum(1, 4) + 30;
    gameObject.call(this, x, y, "images/Gem-Blue.png");

};
inherit(Gem, gameObject);

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 80);
};
Gem.prototype.update = function() {
    if (score >= level * 50) { //when it comes to another level change the gem position 
        this.x = TILE_WIDTH * getRandNum(0, 5) + 25;
        this.y = TILE_HEIGHT * getRandNum(1, 4) + 30;
    }
};



function getRandNum(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

var allEnemies = []; // Place all enemy objects in an array called allEnemies
var cos = [
    "images/char-boy.png",
    "images/char-cat-girl.png",
    "images/char-horn-girl.png",
    "images/char-pink-girl.png",
    "images/char-princess-girl.png",
    "images/enemy-bug.png",
    "images/Rock.png"
];
var player = new Player(); // instantiate player object.
var numberOfEnemies = getRandNum(3, 7); // get random number bugs
var winMsg = 0; //0 for information go,1 for win, 2 for lose,3 for how many hero left
var gem = new Gem(); // instantiate gem object.



for (let i = 0; i < numberOfEnemies; i++) {
    var enemyStart = [-101, -202, -303, -404]; // to make sure that the enemies don't start all at the same time.
    (function(i) {
        let row = i < 3 ? i : getRandNum(0, 3); // to make sure that only 1-3 row has  bugs
        allEnemies.push(new Enemy(row, enemyStart[i])); // instantiate bugs objects.
    })(i);

}

document.addEventListener('keyup', function(e) { // This listens for key presses and sends the keys to your Player.handleInput() method.
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (hero > 0) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

function showTopMessage(text) { //draw the game information

    ctx.fillRect(0, 0, c.width, 50);
    ctx.font = "46pt Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, c.width / 2, 50);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(text, c.width / 2, 50);

}