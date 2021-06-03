/// <reference path="./ts/p5.global-mode.d.ts"/>

let width = window.innerWidth
let height = window.innerHeight - 0

let balls = []
let numBalls = 100
let vel = 10
let ballX = width / 2
let ballY = height - 100
let radius = 10


let goalLocx = width/2
let goalLocy = 20
let goalSize = 20


let generation = 0
let averageFitness = 0
let mutationRate = 0.02

geneLenght = 500

const createGenes = () => {
    let s = []
    for(let j = 0; j < geneLenght; j++){
        s[j] = p5.Vector.random2D()
    }
    return s
}

const goalCenter = () => {
    x = goalLocx - goalSize / 2
    y = goalLocy - goalSize / 2
    return {"x": x, "y": y}
}

function Ball(startX, startY){
    this.index = 0
    this.x = startX
    this.y = startY
    this.doneFor = 0
    this.color = [255, 255, 255, 150]
    this.done = false
    this.fitness = 0
    this.move = () => {
        if(this.x >= goalLocx && this.x <= goalLocx + goalSize && this.y >= goalLocy && this.y <= goalLocy + goalSize || this.done){
            this.index++
            this.doneFor++
            return
        }
        this.x += vel * this.genes[this.index].x
        this.y += vel * this.genes[this.index].y
        this.index++
    }

    this.draw = () => {
        noStroke();
        fill(this.color)
        ellipse(this.x,this.y, radius, radius);
    }

    this.setGenes = (genes) => {
        this.genes = genes
    }

    this.setColor = () => {

    }

    this.calcFitness = () =>{
        goal = goalCenter()
        d = dist(this.x, this.y, goal.x, goal.y)
        this.fitness = Math.max(0, 1 - d/height + this.doneFor / geneLenght);
    }
}

const nextGen = () => {
    generation++
    console.log(`creating generation: ${generation}`)
    
    var candidates = [];
    var total_fitness = 0;
    for (let i = 0; i < numBalls; i++) {
        var b = balls[i];
        b.calcFitness();
        total_fitness += b.fitness; 
        for (let j = 0; j < (2 ** (b.fitness * 10)); j++) {
            candidates.push(b);
        }
    }

    averageFitness = Math.floor((total_fitness / numBalls) * 100) / 100

    let newBalls = []
    for(i=0;i < numBalls; i++){
        // get 50% moms and dads
        let dad =  candidates[Math.floor(Math.random() * candidates.length)]
        let mom =  candidates[Math.floor(Math.random() * candidates.length)]
        let ball = new Ball(ballX, ballX)

        let genes = [];

        for (let j = 0; j < geneLenght; j++){
            if (Math.random() < mutationRate) {
                genes.push(p5.Vector.random2D());
            }

            else if(j % 2){
                genes.push(dad.genes[j])
            } 
            
            else {
                genes.push(mom.genes[j])
            }
        }
        ball.setGenes(genes)
        newBalls.push(ball)
    }

    balls = newBalls
}



function setup() {
    frameRate(60)
    createCanvas(width, height);
    for(i = 0; i < numBalls; i++){
        b = new Ball(ballX, ballY);
        b.setGenes(createGenes());
        balls.push(b);
    }
}

let hue = 0

function draw() {
    background(55);
    textSize(32);
    fill(255);
    text(`Generation: ${generation}`, 10, 30);
    text(`Average fitness: ${averageFitness}`, 10, 70);
    colorMode(HSB, 255);
    if(hue == 360){hue = 0}
    hue++
    fill(hue, 255, 255);
    colorMode(RGB, 255);

    square(goalLocx - goalSize / 2, goalLocy - goalSize / 2, goalSize)
    for(i = 0; i < balls.length; i++){
        balls[i].draw()
        balls[i].move()
    }

    if(balls[0].index == geneLenght){
        nextGen()
    }
}