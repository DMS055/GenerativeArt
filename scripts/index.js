window.onload = function () {
    const canvas = document.getElementById('canvas-1');     
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const flowField = new FlowField(ctx, canvas.width, canvas.height);
}

// First off, I'll be trying to implement a flow field-like effect
// I'm using object oriented approach, so don't get confused if you don't understand something!
// I will try to explain some things along the way

class FlowField {
    // Names starting with # are private class fields
    #ctx;
    #width;
    #height;
    // Here, the "this." references create the encapsulation as the constructor will get the global values and convert them to the private class fields
    // NOTE: Technically you could be referencing for example the ctx value from line 3 directly in the draw function, but it is considered a bad practice and we should avoid that
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        console.log('loaded');
    }
}
