let N = 6;
let model = {};

function setup() {
  noCanvas(); // use DOM instead
  loadMarkovModel();
  generate();

  let span = document.getElementById("instruction");
  span.innerText = `Adjust "N" Here (Max - 12, Min - 3): ${N}`;
}

function adjust(input) {
  if (input) {
    if (N >= 12) {
      N = 3;
    } else {
      N++;
    }
  } else {
    if (N <= 3) {
      N = 12;
    } else {
      N--;
    }
  }

  let span = document.getElementById("instruction");
  span.innerText = `Adjust "N" Here (Max - 12, Min - 3): ${N}`;

  span = document.getElementById("content");
  span.innerText = "";
  loadMarkovModel();
  generate();
}

function clearSentences() {
  let span = document.getElementById("content");
  span.innerText = "";

  loadMarkovModel();
  generate();
}

function generate(minLen = 50, maxLen = 200) {
  // pick a random capital as start
  let result = random(Object.keys(model).filter((k) => /^[A-Z]/.test(k)));

  // loop until we hit a full-stop or maxLen
  while (result.length < maxLen) {
    // get the last N-1 chars
    let seq = result.slice(-(N - 1));

    // look it up the model
    let options = model[seq];

    // pick a random next char
    let next = random(options);
    result += next; // add it to our string

    // end if we find a '.', '?' or '!', and have passed minLen
    if (result.length >= minLen && (result.endsWith(".") || result.endsWith("!") || result.endsWith("?")))
      break;
  }

  // add the result to our span
  let span = document.getElementById("content");
  span.innerText += " " + result;
}

function loadMarkovModel() {
  model = {};
  // combine all songs together
  let text = song1Data.lyrics.join(" ");
  text += song2Data.lyrics.join(" ");
  text += song3Data.lyrics.join(" ");
  text += song4Data.lyrics.join(" ");

  //console.log(text);
  // make keys according to the size of N
  for (let i = 0; i < text.length - N - 1; i++) {
    let key = text.substring(i, i + (N - 1));
    let next = text[i + (N - 1)];
    if (!model[key]) model[key] = [];
    model[key].push(next);
  }
  //console.log(model);
}
