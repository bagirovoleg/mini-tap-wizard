// playerData.js

const STORAGE_KEYS = {
  gold: 'gold',
  exp: 'exp',
  level: 'level',
  points: 'points',
  stats: 'stats',
};

let gold = parseInt(localStorage.getItem(STORAGE_KEYS.gold)) || 0;
let exp = parseInt(localStorage.getItem(STORAGE_KEYS.exp)) || 0;
let level = parseInt(localStorage.getItem(STORAGE_KEYS.level)) || 1;
let points = parseInt(localStorage.getItem(STORAGE_KEYS.points)) || 0;

let stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats)) || {
  strength: 0,
  vitality: 0,
  energy: 0,
};

function save() {
  localStorage.setItem(STORAGE_KEYS.gold, gold);
  localStorage.setItem(STORAGE_KEYS.exp, exp);
  localStorage.setItem(STORAGE_KEYS.level, level);
  localStorage.setItem(STORAGE_KEYS.points, points);
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
}

function reset() {
  gold = 0;
  exp = 0;
  level = 1;
  points = 0;
  stats = { strength: 0, vitality: 0, energy: 0 };
  save();
}

// Getters & setters

function getGold() { return gold; }
function setGold(value) { gold = value; save(); }

function getExp() { return exp; }
function setExp(value) { exp = value; save(); }

function getLevel() { return level; }
function setLevel(value) { level = value; save(); }

function getPoints() { return points; }
function setPoints(value) { points = value; save(); }

function getStats() { return stats; }
function setStats(newStats) { stats = newStats; save(); }

function addStat(stat) {
  if (points <= 0) return false;
  if (stats.hasOwnProperty(stat)) {
    stats[stat]++;
    points--;
    save();
    return true;
  }
  return false;
}

export {
  getGold,
  setGold,
  getExp,
  setExp,
  getLevel,
  setLevel,
  getPoints,
  setPoints,
  getStats,
  setStats,
  addStat,
  reset,
};
