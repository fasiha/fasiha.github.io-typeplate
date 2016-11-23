'use strict';

/*
Monty Hall problem.
*/
function mean(arr) {
  let sum = 0;
  for (let elt of arr) {
    sum += elt;
  }
  return sum / arr.length;
}

function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function montyHall(stay) {
  const numDoors = 3;
  const car = Math.floor(numDoors * Math.random());
  const guess = Math.floor(numDoors * Math.random());

  if (stay) {
    return car === guess;
  }

  let doors = new Set(Array.from(Array(numDoors), (_, n) => n));
  // Monty opens a door != guess, and != car.
  doors.delete(car);
  doors.delete(guess);
  let openDoorGoat = sample(Array.from(doors));

  // Switchers open the door != openDoorGoat and != guess
  doors = new Set(Array.from(Array(numDoors), (_, n) => n));
  doors.delete(openDoorGoat);
  doors.delete(guess);

  return car === sample(Array.from(doors));
}

function monteCarlo() {
  const stayers = mean(Array.from(Array(1e3), _ => montyHall(true)));
  const switchers = mean(Array.from(Array(1e3), _ => montyHall(false)));
  const num2str = x => '' + Math.round(x * 1e4) / 1e2;
  document.getElementById('monty-hall-switchers').textContent =
    num2str(switchers);
  document.getElementById('monty-hall-stayers').textContent = num2str(stayers);
}

/*
The criterion of dissimilarity plots.
*/
function linspace(a, b, num) {
  const δ = (b - a) / (num - 1);
  return Array.from(Array(num), (_, i) => a + δ * i);
}

let pLie = [ 0, .1, .25, .5, 1 ];
let pPlaus = linspace(0, 1, 51);

function makeTrace(pUseful, pLie, pPlausVec) {
  return {
    x : pPlausVec.slice(),
    y : pPlausVec.map(pp => (pUseful * pp) / (pUseful * pp + pLie * (1 - pp))),
    type : 'scatter',
    name : `pLie=${pLie}`
  };
}
function pUsefulToData(pUseful) {
  return pLie.map(pLie => makeTrace(pUseful, pLie, pPlaus));
}

let layout = {
  title : `pUseful = 1`,
  xaxis : {title : 'pPlausible'},
  yaxis : {title : 'p(H | says H)'}
};

Plotly.newPlot('myDiv', pUsefulToData(1), layout);
Plotly.newPlot('myDiv-2', pUsefulToData(.5),
               (layout.title = 'pUseful = 0.5') && layout);
Plotly.newPlot('myDiv-3', pUsefulToData(.1),
               (layout.title = 'pUseful = 0.1') && layout);
