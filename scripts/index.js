window.onload = function () {
    const canvas = document.getElementById('canvas-1');     
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const flowField = new FlowField(ctx, canvas.width, canvas.height);
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
        console.log('loaded');
        this.#draw(10, 10);
    }

    // As mentioned before - the # signifies that this is a private method and cannot be called from outside the class
    #draw(x, y) {
        let length = 5;
        length = length * 100;
        // ? beginPath() methon starts a new path (starts drawing a new shape) and ends every other previous path
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        // The line below marks the end point of our line
        this.#ctx.lineTo(x + length, y + length);
        // Draw the line
        this.#ctx.stroke();
    }
}
