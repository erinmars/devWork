const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgbSplitBtn = document.querySelector('.rgb-split');
const greenScreenBtn = document.querySelector('.green-screen');
const redEffectBtn = document.querySelector('.red-effect');

/**
 * pipe in the user video - nav.mediaDevices.getUserMedia returns
 * a promise
 */
function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream); // convert this object to a url
            video.play(); //emits an event - canplay - so canvas cant take pics
        })
        .catch(err => {
            console.error("OH NO!!!", err);
        });
}

/**
 * take a frame and lay it into the canvas
 */
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    //the canvas needs to be the same size as the video
    canvas.width = width;
    canvas.height = height;
    //return the set int so you can control it outside if needed.
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        //pixels = greenScreen(pixels);

        // ctx.globalAlpha = 0.1; // this ten more frame - transparency of the current image on top - stacking and stackin
        //put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

function takePhoto() {
    //play the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
    //outputs base 64 version of the image.
    const data = canvas.toDataURL('image/jpeg');
    //we can create a link to the image to add to the photo strip
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'pretty');
    link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="pretty woman">`
    strip.insertBefore(link, strip.firstChild); //prepend the link before the strip

}

/**
 * how filters work get pixels out of canvas, mess with them and return them back
 */
function redEffect() {
    //cant use map - this is a special kind of array
    // increment for the 4 parts of the data - rgba
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //red channel
        pixels.data[i + 1] = pixels.data[i + 1] - 150; //green channel
        pixels.data[i + 2] = pixels.data[i + 2] * 10; // blue

    }
    return pixels;
}

function rgbSplit() {
    //cant use map - this is a special kind of array
    // increment for the 4 parts of the data - rgba
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; //red channel
        pixels.data[i + 500] = pixels.data[i + 1]; //green channel
        pixels.data[i - 550] = pixels.data[i + 2]; // blue

    }
    return pixels;
}

function greenScreen() {
    const levels = {}; //holds min and max - levels = find a range and take them out
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    //console.log(levels);
    //loop over every single pixel, figure out which ones the red
    //green blue are, then you say if they're anywhere in between
    //min and max vals, we take it out. the 4th pix is alpha
    // set it to 0 and its transparent
    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        //check the range min maxes to take out the alpha (set it to 0)
        if (red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
rgbSplitBtn.addEventListener('click', rgbSplit);
greenScreenBtn.addEventListener('click', greenScreen);