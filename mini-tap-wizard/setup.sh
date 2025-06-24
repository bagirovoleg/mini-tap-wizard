#!/bin/bash

# Tworzenie struktury folderów
mkdir -p src

# Zapis index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mini Tap Wizard</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="main-wrapper">
    <div class="hud">
      <span id="level">Level: 1</span>
      <span id="exp">EXP: 0</span>
      <span id="gold">Gold: 0</span>
    </div>

    <div class="exp-bar" id="exp-bar">
      <div class="exp-bar__inner" id="exp-bar-inner"></div>
      <div class="exp-text" id="exp-text">0 / 0</div>
    </div>

    <div id="hp-mp-bars">
      <div id="hp-circles"></div>
      <div id="mana-circles"></div>
    </div>

    <div class="stats-panel">
      <p>Points to spend: <span id="stat-points">0</span></p>
      <div>
        <button onclick="addStat('strength')">+ Strength (<span id="str-val">0</span>)</button>
        <button onclick="addStat('vitality')">+ Vitality (<span id="vit-val">0</span>)</button>
        <button onclick="addStat('energy')">+ Energy (<span id="eng-val">0</span>)</button>
      </div>
    </div>

    <div id="game">
      <div id="wizard"></div>
    </div>

    <div id="game-over" class="hidden">
      <h2>You died!</h2>
      <button id="restart-btn">Restart</button>
    </div>
  </div>

  <script type="module" src="src/main.js"></script>
</body>
</html>
EOF

# Zapis style.css
cat > style.css << 'EOF'
body {
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
  font-family: sans-serif;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

#game {
  position: relative;
  width: 100%;
  flex: 1;
  background-color: #103c1b;
  overflow: hidden;
  box-shadow: 0 0 10px #000;
}

#wizard {
  position: absolute;
  width: 40px;
  height: 60px;
  background-color: #2ecc71;
  left: 50%;
  top: calc(100% - 100px);
  transform: translateX(-50%);
  border-radius: 8px;
}

.enemy {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #e74c3c;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.enemy-hit {
  animation: flash 0.3s;
}

.fireball {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 50%;
}

.hud {
  margin-top: 10px;
  font-size: 18px;
  display: flex;
  gap: 20px;
}

.stats-panel {
  margin: 10px;
  font-size: 16px;
  text-align: center;
}

.stats-panel button {
  margin: 2px;
  cursor: pointer;
}

.healthbar {
  position: absolute;
  height: 6px;
  background-color: red;
  top: -10px;
  left: 0;
  width: 100%;
  border: 1px solid #000;
  border-radius: 3px;
}

.healthbar__inner {
  height: 100%;
  background-color: limegreen;
  width: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.mana-bar {
  position: absolute;
  height: 6px;
  background-color: #00008B;
  top: -22px;
  left: 0;
  width: 100%;
  border: 1px solid #000066;
  border-radius: 2px;
}

.mana-bar__inner {
  height: 100%;
  background-color: #00BFFF;
  width: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.bar-text {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-family: monospace;
  color: #fff;
  user-select: none;
  pointer-events: none;
}

.exp-bar {
  position: relative;
  height: 12px;
  background-color: #2e0854;
  border-radius: 6px;
  margin: 10px auto 0 auto;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 0 10px #7f3fbf;
}

.exp-bar__inner {
  height: 100%;
  background-color: #a64ca6;
  border-radius: 6px;
  width: 0;
  transition: width 0.4s ease;
}

.exp-text {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 0;
  left: 0;
  font-family: monospace;
  font-size: 12px;
  color: #fff;
  user-select: none;
  pointer-events: none;
}

#game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000000cc;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  z-index: 20;
  color: white;
  font-size: 24px;
}

#game-over button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}

.hidden {
  display: none;
}

@keyframes flash {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

#hp-mp-bars {
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 600px;
  margin: 10px auto;
  gap: 10px;
}

#hp-circles, #mana-circles {
  display: flex;
  gap: 4px;
  align-items: center;
}

.circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #333;
}

.hp-full {
  background-color: #ff0000;
  border-color: #990000;
}

.hp-empty {
  background-color: #330000;
}

.mana-full {
  background-color: #00aaff;
  border-color: #004466;
}

.mana-empty {
  background-color: #003344;
}
EOF

# Zapis src/main.js
cat > src/main.js << 'EOF'
import { wizard, initWizard, regenMana } from './wizard.js';
import { enemies, spawnWave, clearEnemies } from './enemies.js';
import { castFireball } from './fireball.js';
import { checkEnemyAttack } from './attack.js';
import { updateHUD } from './ui.js';
import { saveProgress } from './storage.js';
import { addStat } from './stats.js';

const game = document.getElementById('game');
const wizardElem = document.getElementById('wizard');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let castInterval, attackInterval;
let isMoving = false;

function createEnemy(x, y, isChampion = false, isEmpowered = false) {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;
  enemy.dataset.hp = isChampion ? '6' : isEmpowered ? '4' : '3';

  if (isChampion) enemy.style.backgroundColor = '#FFD700'; // gold
  else if (isEmpowered) enemy.style.backgroundColor = '#3399FF'; // blue

  const hpBar = document.createElement('div');
  hpBar.classList.add('healthbar');
  const hpInner = document.createElement('div');
  hpInner.classList.add('healthbar__inner');
  hpBar.appendChild(hpInner);
  enemy.appendChild(hpBar);

  game.appendChild(enemy);
  enemies.push(enemy);
}

function moveWizardToTarget() {
  if (enemies.length === 0) return;
  const wizardX = wizardElem.offsetLeft;
  const closest = enemies.reduce((a, b) =>
    Math.abs(a.offsetLeft - wizardX) < Math.abs(b.offsetLeft - wizardX) ? a : b
  );
  const targetX = closest.offsetLeft;
  isMoving = true;
  const step = wizardX < targetX ? 2 : -2;
  const interval = setInterval(() => {
    const x = wizardElem.offsetLeft;
    const next = x + step;
    if ((step > 0 && next >= targetX) || (step < 0 && next <= targetX)) {
      clearInterval(interval);
      isMoving = false;
    }
    wizardElem.style.left = `${next}px`;
  }, 20);
}

function startGameLoops() {
  castInterval = setInterval(() => {
    if (!isMoving) castFireball();
  }, Math.max(300, 1500 - wizard.stats.energy * 100));

  attackInterval = setInterval(() => {
    checkEnemyAttack();
    if (wizard.hp <= 0) {
      clearInterval(castInterval);
      clearInterval(attackInterval);
      gameOverScreen.classList.remove('hidden');
    }
  }, 1500);

  setInterval(() => {
    regenMana();
    updateHUD();
  }, 1000);
}

restartBtn.addEventListener('click', () => {
  initWizard();
  clearEnemies();
  spawnWave(createEnemy);
  moveWizardToTarget();
  gameOverScreen.classList.add('hidden');

  clearInterval(castInterval);
  clearInterval(attackInterval);
  startGameLoops();
  updateHUD();
  saveProgress(wizard);
});

// expose addStat for inline onclick buttons
window.addStat = addStat;

initWizard();
updateHUD();
spawnWave(createEnemy);
moveWizardToTarget();
startGameLoops();
EOF

# Zapis src/wizard.js
cat > src/wizard.js << 'EOF'
import { loadProgress } from './storage.js';

export const wizard = {
  gold: 0,
  exp: 0,
  level: 1,
  points: 0,
  stats: {
    strength: 0,
    vitality: 0,
    energy: 0,
  },
  hpMax() {
    return 10 + this.stats.vitality * 2;
  },
  manaMax() {
    return 10 + this.stats.energy * 3;
  },
  hp: 0,
  mana: 0,
};

export function initWizard() {
  const data = loadProgress();
  wizard.gold = data.gold;
  wizard.exp = data.exp;
  wizard.level = data.level;
  wizard.points = data.points;
  wizard.stats = data.stats;
  wizard.hp = wizard.hpMax();
  wizard.mana = wizard.manaMax();
}

export function damageWizard(amount) {
  wizard.hp -= amount;
  if (wizard.hp < 0) wizard.hp = 0;
}

export function regenMana(amount = 1) {
  wizard.mana += amount;
  if (wizard.mana > wizard.manaMax()) wizard.mana = wizard.manaMax();
}

export function resetWizard() {
  wizard.hp = wizard.hpMax();
  wizard.mana = wizard.manaMax();
  wizard.gold = 0;
  wizard.exp = 0;
  wizard.level = 1;
  wizard.points = 0;
  wizard.stats = { strength: 0, vitality: 0, energy: 0 };
}
EOF

# Zapis src/enemies.js
cat > src/enemies.js << 'EOF'
export let enemies = [];

const game = document.getElementById('game');

export function clearEnemies() {
  enemies.forEach(e => e.remove());
  enemies = [];
}

export function spawnWave(createEnemyFunc) {
  clearEnemies();

  const count = getWeightedEnemyCount();
  const hasChampion = count >= 7;
  const allEmpowered = count >= 6;

  const spacing = 640 / (count + 1);
  for (let i = 0; i < count; i++) {
    const x = spacing * (i + 1);
    const y = 200 + Math.random() * 20;
    const isChamp = hasChampion && i === 0;
    const isEmp = allEmpowered && !isChamp && Math.random() < 0.5;
    createEnemyFunc(x, y, isChamp, isEmp);
  }
}

function getWeightedEnemyCount() {
  const weights = [30, 25, 20, 10, 7, 5, 2, 1];
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i + 1;
  }
  return 1;
}
EOF

# Zapis src/fireball.js
cat > src/fireball.js << 'EOF'
import { wizard } from './wizard.js';
import { enemies } from './enemies.js';
import { updateHUD } from './ui.js';
import { saveProgress } from './storage.js';

const game = document.getElementById('game');

export function castFireball() {
  if (enemies.length === 0) return;
  const manaCost = 1;
  if (wizard.mana < manaCost) return; // not enough mana

  wizard.mana -= manaCost;
  updateHUD();

  const fireball = document.createElement('div');
  fireball.classList.add('fireball');
  fireball.style.left = `${wizardElem().offsetLeft + 10}px`;
  fireball.style.top = `${wizardElem().offsetTop}px`;
  game.appendChild(fireball);

  const damage = 1 + wizard.stats.strength;

  const interval = setInterval(() => {
    const y = parseInt(fireball.style.top);
    fireball.style.top = `${y - 5}px`;
    if (y < 0) {
      fireball.remove();
      clearInterval(interval);
    }

    enemies.forEach((enemy, i) => {
      const r1 = fireball.getBoundingClientRect();
      const r2 = enemy.getBoundingClientRect();
      if (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
      ) {
        let hp = parseInt(enemy.dataset.hp);
        hp = Math.max(0, hp - damage);
        enemy.dataset.hp = hp;
        const inner = enemy.querySelector('.healthbar__inner');
        inner.style.width = `${(hp / 6) * 100}%`;
        enemy.classList.add('enemy-hit');
        setTimeout(() => enemy.classList.remove('enemy-hit'), 300);

        if (hp <= 0) {
          enemy.remove();
          enemies.splice(i, 1);
          wizard.gold += 5;
          wizard.exp += 10;
          const expNeeded = wizard.level * 20;
          if (wizard.exp >= expNeeded) {
            wizard.exp -= expNeeded;
            wizard.level++;
            wizard.points++;
          }
          updateHUD();
          saveProgress(wizard);

          if (enemies.length === 0) {
            setTimeout(() => {
              // next wave logic here (optional)
            }, 500);
          }
        }

        fireball.remove();
        clearInterval(interval);
      }
    });
  }, 20);
}

function wizardElem() {
  return document.getElementById('wizard');
}
EOF

# Zapis src/attack.js
cat > src/attack.js << 'EOF'
import { wizard, damageWizard } from './wizard.js';
import { enemies } from './enemies.js';
import { updateHUD } from './ui.js';

const gameOverScreen = document.getElementById('game-over');

export function checkEnemyAttack() {
  if (enemies.length === 0) return;

  damageWizard(1);
  updateHUD();

  const wizardElem = document.getElementById('wizard');
  wizardElem.classList.add('wizard-hit');
  setTimeout(() => wizardElem.classList.remove('wizard-hit'), 200);

  if (wizard.hp <= 0) {
    gameOverScreen.classList.remove('hidden');
  }
}
EOF

# Zapis src/storage.js
cat > src/storage.js << 'EOF'
export function saveProgress(data) {
  localStorage.setItem('gold', data.gold);
  localStorage.setItem('exp', data.exp);
  localStorage.setItem('level', data.level);
  localStorage.setItem('points', data.points);
  localStorage.setItem('stats', JSON.stringify(data.stats));
}

export function loadProgress() {
  return {
    gold: parseInt(localStorage.getItem('gold')) || 0,
    exp: parseInt(localStorage.getItem('exp')) || 0,
    level: parseInt(localStorage.getItem('level')) || 1,
    points: parseInt(localStorage.getItem('points')) || 0,
    stats: JSON.parse(localStorage.getItem('stats')) || {
      strength: 0,
      vitality: 0,
      energy: 0,
    },
  };
}
EOF

# Zapis src/ui.js
cat > src/ui.js << 'EOF'
import { wizard } from './wizard.js';

const expBarInner = document.getElementById('exp-bar-inner');
const expText = document.getElementById('exp-text');
const hpCirclesContainer = document.getElementById('hp-circles');
const manaCirclesContainer = document.getElementById('mana-circles');
const goldText = document.getElementById('gold');
const levelText = document.getElementById('level');
const statPointsText = document.getElementById('stat-points');
const strValText = document.getElementById('str-val');
const vitValText = document.getElementById('vit-val');
const engValText = document.getElementById('eng-val');

export function updateHUD() {
  goldText.textContent = `Gold: ${wizard.gold}`;
  levelText.textContent = `Level: ${wizard.level}`;
  statPointsText.textContent = wizard.points;
  strValText.textContent = wizard.stats.strength;
  vitValText.textContent = wizard.stats.vitality;
  engValText.textContent = wizard.stats.energy;

  updateExpBar();
  updateCircles();
}

export function updateExpBar() {
  const expNeeded = wizard.level * 20;
  const percent = (wizard.exp / expNeeded) * 100;
  expBarInner.style.width = `${percent}%`;
  expText.textContent = `${wizard.exp} / ${expNeeded}`;
}

export function updateCircles() {
  hpCirclesContainer.innerHTML = '';
  manaCirclesContainer.innerHTML = '';

  const maxDisplay = 20;
  const hpMaxDisplay = Math.min(wizard.hpMax(), maxDisplay);
  const manaMaxDisplay = Math.min(wizard.manaMax(), maxDisplay);

  const hpFullCount = Math.round((wizard.hp / wizard.hpMax()) * hpMaxDisplay);
  const manaFullCount = Math.round((wizard.mana / wizard.manaMax()) * manaMaxDisplay);

  for (let i = 0; i < hpMaxDisplay; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.classList.add(i < hpFullCount ? 'hp-full' : 'hp-empty');
    hpCirclesContainer.appendChild(circle);
  }

  for (let i = 0; i < manaMaxDisplay; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.classList.add(i < manaFullCount ? 'mana-full' : 'mana-empty');
    manaCirclesContainer.appendChild(circle);
  }
}
EOF

# Zapis src/stats.js
cat > src/stats.js << 'EOF'
import { wizard } from './wizard.js';
import { updateHUD } from './ui.js';

export function addStat(stat) {
  if (wizard.points <= 0) return;
  wizard.stats[stat]++;
  wizard.points--;
  updateHUD();
}
EOF

chmod +x setup.sh
echo "Setup script created: run './setup.sh' to generate project files."
