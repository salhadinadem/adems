var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};



// inheritance 
function Car(game, spritesheet) {
    this.animation = new Animation(spritesheet, 519, 465, 3, 0.15, 1, true, 0.2);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 585);
}

Car.prototype = new Entity();
Car.prototype.constructor = Car;

Car.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1300) this.x = -230;
    Entity.prototype.update.call(this);
}

Car.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Police(game, spritesheet) {
    this.animation = new Animation(spritesheet, 359, 600, 1, 0.2, 1, true, 0.2);
    this.speed = 60;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);
}

Police.prototype = new Entity();
Police.prototype.constructor = Police;

Police.prototype.update = function () {
    this.y += this.game.clockTick * this.speed;
    if (this.y > 900) this.y = -30;
    Entity.prototype.update.call(this);
}

Police.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/car.png");
AM.queueDownload("./img/police.png");
AM.queueDownload("./img/6.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/6.png")));
    gameEngine.addEntity(new Car(gameEngine, AM.getAsset("./img/car.png")));
    gameEngine.addEntity(new Police(gameEngine, AM.getAsset("./img/police.png")));


    console.log("All Done!");
});