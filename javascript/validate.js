
// Overriding method 'replace' of the class DOMTokenList
DOMTokenList.prototype.replace = function (oldToken, newToken) {
    this.remove(oldToken); this.add(newToken);
}

// Validates and returns field value
const validateAndReturn = function (field, id, min, max) {
    let floatPattern = /^[+-]?\d+(\.\d+)?$/;
    
    // Field indicator dot
    let dot = document.querySelector(id);console.log(dot);

    // replace comma to dot
    let fieldValue = field.value.trim().replace(',', '.');

    if (fieldValue === "") {
        // removes all effects
        field.classList.remove('succ', 'err');

        dot.setAttribute('fill', 'pink');
        dot.setAttribute('cx', 100);
        return undefined; // if invalid data
    }
    if (floatPattern.test(fieldValue)) {
        let floatValue = parseFloat(fieldValue);

        let difference = max - min;
        let relativeY = 40 + (floatValue - min) * 120 / difference;

        dot.setAttribute('cx', relativeY);
        dot.setAttribute('fill', 'red');

        if (floatValue < min || floatValue > max) {
            // replacing status
            field.classList.replace('succ', 'err');
            return undefined; // if invalid data
        } else {
            // replacing status
            field.classList.replace('err', 'succ');
            return floatValue; // valid data
        }
    } else {
        // replacing status
        field.classList.replace('succ', 'err');

        dot.setAttribute('fill', 'pink');
        dot.setAttribute('cx', 100);
        return undefined; // if invalid data
    }
}


// Dot in graph
const point = document.querySelector('#dot');
// Redraws point
const redraw = function (x, y) {
    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
}

// Fixes coordinates if it's not in the graph
// Size *.svg 350x350
const fix = function (coordinate) {
    if (coordinate < 3) return 3; // less
    else if (coordinate > 347) return 347; // more
    else return coordinate; // OK
}


// Submit button
const submitButton = document.querySelector('.submit-button');

let xValue;
const onChangeRedrawDot = function () {
    let yValue = validateAndReturn(yField, '#y', -3, 5),
        rValue = validateAndReturn(rField, '#r',2, 5);

    // Checks for valid data
    if (xValue !== undefined && yValue !== undefined && rValue !== undefined) {
        submitButton.classList.add('able');
        // Relatives points for graph
        let relativeX = 2 * (xValue * 70 / rValue) + 175;
        let relativeY = - 2 * (yValue * 70 / rValue) + 175;
        //Redraws
        redraw(fix(relativeX), fix(relativeY));
    } else {
        submitButton.classList.remove('able');
        //Redraws
        redraw(175, 175);
    }
}

// List of button
const xButtonList = document.querySelectorAll('.x-button');

// Setting 'onClick' listeners for each button
xButtonList.forEach(button => button.addEventListener('click', function () {
    xButtonList.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    xValue = button.value;

    // validate data and redraws point
    onChangeRedrawDot();
}));

// Text line
const yField = document.querySelector('#y-field');
const rField = document.querySelector('#r-field');

// Setting  'onInput' listener for text lines
yField.addEventListener('input', onChangeRedrawDot);
rField.addEventListener('input', onChangeRedrawDot);


// Table of results
const table = document.querySelector('#tabular');

// Setting listener to 'submit' button
submitButton.addEventListener('click', function () {
    let yValue = validateAndReturn(yField, '#y',-3, 5),
        rValue = validateAndReturn(rField, '#r', 2, 5);

    // Checks for valid data
    if (xValue !== undefined && yValue !== undefined && rValue !== undefined) {
        const request = new XMLHttpRequest();
        // Parameters
        const parameters = "x=" + xValue +
                          "&y=" + yValue +
                          "&r=" + rValue;

        request.open('POST', './phpscript/check.php', true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Listener for response
        request.addEventListener('readystatechange', function () {
            if(request.readyState === 4 && request.status === 200) {
                table.innerHTML = request.response;
                scrollDown(500);
            }
        })
        request.send(parameters);
        // Resets all input fields and button clicks
        reset();
    }
});

// Resets input buttons and fields
const reset = function () {
    xButtonList.forEach(button => // Removes class 'active'
        button.classList.remove('active')); // from each button

    xValue = undefined; // Resets xValue as 'undefined'
    yField.value = ""; // Removes yValue
    rField.value = ""; // Removes rValue
    // Redraws point and resets all settings
    onChangeRedrawDot();
}

const clearButton = document.querySelector('#clear');
// Setting listener for 'clear'
clearButton.addEventListener('click', () => {
    fetch('./phpscript/clear.php', { method: 'POST' })
        .then(response => response.text())
        .then(response => table.innerHTML = response);
})

// Setting listener for 'update' to the page
document.addEventListener('DOMContentLoaded', () => {
    fetch('./phpscript/update.php', { method: 'POST' })
        .then(response => response.text())
        .then(data => table.innerHTML = data);
});

// Scrolls down current scrolling element
const scrollDown = function (duration) {
    let start = Date.now(); // start time

    const element = document.scrollingElement; //scrolling element
    const scrollTop = element.scrollTop;
    // Difference between top and height of the page
    const difference = element.scrollHeight - element.scrollTop;

    let timer = setInterval(() => {
        let timePassed = Date.now() - start;
        // Scrolling to down
        element.scrollTop = scrollTop + difference * timePassed / duration;

        if (timePassed > duration) clearInterval(timer);
    });
}
