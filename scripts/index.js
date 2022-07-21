let animation;
let flowField;
let canvas;
let ctx;

window.onload = function () {
    canvas = document.getElementById('canvas-1');     
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowField(ctx, canvas.width, canvas.height);
    flowField.animate(0);
}

// My comments use the Better Comments extension by Aaron Bond, hence the strange symbols (they make the comment have fancy colors)

/*
Basically comment with the prefix of:
? - is additional information
NOTE - are facts and important mentions
! - are very important things (keep an eye on them!)
*/

// First off, I'll be trying to implement a flow field-like effect
// I'm using object oriented approach, so don't get confused if you don't understand something!
// I will try to explain some things along the way

// I think this one is pretty self-explainatory
// It makes the animation responsive by listening for changes in the window size
window.addEventListener("resize", function(e) {
    this.cancelAnimationFrame(animation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowField(ctx, canvas.width, canvas.height);
    flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

class FlowField {
	// Names starting with # are private class fields
	#ctx;
	#width;
	#height;
	// Here, the "this." references create the encapsulation as the constructor will get the global values and convert them to the private class fields
	// ? Encapsulation is the bundling of data with the methods that work on that data into a single unit

	// NOTE: Technically you could be referencing for example the ctx value from line 3 directly in the draw function, but it is considered a bad practice and we should avoid that
	constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 1;
		this.#width = width;
		this.#height = height;
		this.lastFrameTimestamp = 0;
		this.interval = 1000/60; // This value determines time between repetitions of an event (in ms), so the highier the value the less smooth it's going to run
        this.timer = 0; // Counts time until it's equal to the interval variable value, then calls the event and resets itself
        this.cellSize = 8; // Size of the cells, pretty self explanatory
        this.gradient;
        this.#colorGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.rad = 5;
        this.velocity = 0.02;
	}

    // NOTE: This is an exaple of a private function that references an object inside of the constructor, you can customize it however you want
    #colorGradient() {
            /*
			    ? createLinearGradient() requires 4 properties: starting position x and y, ending position x and y
                ? The way it works is it basically draws a line connecting the specified points then creates a linear gradient along it
            */
			this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
            this.gradient.addColorStop("0.1", "#ff5c33");
            this.gradient.addColorStop("0.2", "#ff66b3");
            this.gradient.addColorStop("0.4", "#ccccff");
            this.gradient.addColorStop("0.6", "#b3ffff");
            this.gradient.addColorStop("0.8", "#80ff80");
            this.gradient.addColorStop("0.9", "#ffff33");
	}

	// As mentioned before - the # signifies that this is a private method and cannot be called from outside the class
    #drawLine(angle, x, y) {
        // Calculating the distance
        let posX = x;
        let posY = y;
        let dx = mouse.x - posX;
        let dy = mouse.y - posY;
        let dist = (dx * dx + dy * dy) * 3;

        if (dist > 500000) dist = 500000;
        else if (dist < 50000) dist = 50000;
		let length = dist * 0.00005; // We are multiplying because for some reason multiplying in JS is faster than dividing

		// ? beginPath() methon starts a new path (starts drawing a new shape) and ends every other previous path
		this.#ctx.beginPath();
		this.#ctx.moveTo(x, y);
		// The line below marks the end point of our line
        // Changing those values will result in changing the length of th lines
		this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
		// Draw the line
		this.#ctx.stroke();
	}

	// Now this is a public method meaning it can be referenced from wherever you want
	animate(timeStamp) {
		// Here, we are calculating the time between frames, so we can limit the fps and not depend on the speed on the CPU
		const dTime = timeStamp - this.lastFrameTimestamp;
		this.lastFrameTimestamp = timeStamp;

		// Limiting the speed in order to avoid different animation speed depending on hardware
		if (this.timer > this.interval) {
			// This method will clear the canvas so we see only the current frame
			this.#ctx.clearRect(0, 0, this.#width, this.#height);

            this.rad += this.velocity;
            if (this.rad > 10 || this.rad < -10) this.velocity *= -1;

            // Looping through the whole canvas, jumping my the cellSize to create a grid
            /*
                ? This thing is called a nested for loop, it's pretty basic knowledge, so I will not bother to explain this in here,
                ? if you don't know how for loops work then my best advice is just to google it and get familliar with this concept as it's pretty crucial
            */
            for (let i = 0; i < this.#height; i += this.cellSize) {
                for (let j = 0; j < this.#width; j += this.cellSize) {
                    // Funky trigonometry stuff
                    // Multiplying by smaller values gives less rotation
                    const angle = (Math.cos(mouse.x * j * 0.00002) + Math.sin(mouse.y * i * 0.00002)) * this.rad;

                    // There we create a bunch of lines in a grid
                    // See line 76 for reference
                    this.#drawLine(angle, j, i);
                }
            }

			// Reseting the timer
			this.timer = 0;
		} else {
			// See line 64 for reference
			this.timer += dTime;
		}

		// ? requestAnimationFrame() methon requests to call a specified function before drawing the next frame and so on...
		animation = requestAnimationFrame(this.animate.bind(this));
	}
}
