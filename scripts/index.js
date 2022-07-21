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
		this.#ctx.strokeStyle = "white";
		this.#width = width;
		this.#height = height;
		this.lastFrameTimestamp = 0;
		this.interval = 1000/60; // This value determines time between repetitions of an event (in ms), so the highier the value the less smooth it's going to run
        this.timer = 0; // Counts time until it's equal to the interval variable value, then calls the event and resets itself
        this.cellSize = 15; // Size of the cells, pretty self explanatory
	}

	// As mentioned before - the # signifies that this is a private method and cannot be called from outside the class
	#drawLine(x, y) {
		let length = 3;
		length = length * 100;
		// ? beginPath() methon starts a new path (starts drawing a new shape) and ends every other previous path
		this.#ctx.beginPath();
		this.#ctx.moveTo(x, y);
		// The line below marks the end point of our line
		this.#ctx.lineTo(x + 5, y + 5);
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

            // Looping through the whole canvas, jumping my the cellSize to create a grid
            /*
            ? This thing is called a nested for loop, it's pretty basic knowledge, so I will not bother to explain this in here,
            ? if you don't know how for loops work then my best advice is just to google it and get familliar with this concept as it's pretty crucial
            */
            for (let i = 0; i < this.#height; i += this.cellSize) {
                for (let j = 0; j < this.#width; j += this.cellSize) {
                    // There we create a bunch of lines in a grid
                    // See line 76 for reference
                    this.#drawLine(j, i);
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
