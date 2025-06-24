const game = document.getElementById('game');
const wizard = document.getElementById('wizard');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const expBarInner = document.getElementById('exp-bar-inner');
const expText = document.getElementById('exp-text');

let gold = 0;
let exp = 0;
let level = 1;
let points = 0;

let stats = {
  strength: 0,
  vitality: 0,
  energy: 0,
};

let wave = 0;
let enemies = [];
let isMoving = false;

let wizardHpMax = 10 + stats.vitality * 2;
let wizardHp = wizardHpMax;
let wizardManaMax = 10 + stats.energy * 3;
let wizardMana = wizardManaMax;

let castInterval;
let attackInterval;

const wizardHpBar = document.createElement('div');
wizardHpBar.classList.add('healthbar');
const wizardHpInner = document.createElement('div');
wizardHpInner.classList.add('healthbar__inner');
wizardHpBar.appendChild(wizardHpInner);
wizard.appendChild(wizardHpBar);

const manaBar = document.createElement('div');
manaBar.classList.add('mana-bar');
const manaBarInner = document.createElement('div');
manaBarInner.classList.add('mana-bar__inner');
manaBar.appendChild(manaBarInner);
wizard.appendChild(manaBar);

const hpText = document.createElement('div');
hpText.classList.add('bar-text');
wizard.appendChild(hpText);

const manaText = document.createElement('div');
manaText.classList.add('bar-text');
manaText.style.top = '-54px';
wizard.appendChild(manaText);

function updateWizardHpBar() {
  wizardHpMax = 10 + stats.vitality * 2;
  wizardManaMax = 10 + stats.energy * 3;

  if (wizardHp > wizardHpMax) wizardHp = wizardHpMax;
  if (wizardMana > wizardManaMax) wizardMana = wizardManaMax;

  wizardHpInner.style.width = `${(wizardHp / wizardHpMax) * 100}%`;
  manaBarInner.style.width = `${(wizardMana / wizardManaMax) * 100}%`;

  hpText.textContent = `${wizardHp} / ${wizardHpMax}`;
  manaText.textContent = `${wizardMana} / ${wizardManaMax}`;
}

function updateExpBar() {
  const expNeeded = level * 20;
  const progressPercent = Math.min(100, (exp / expNeeded) * 100);
  expBarInner.style.width = progressPercent + '%';
  expText.textContent = `${exp} / ${expNeeded}`;
}

function updateHUD() {
  document.getElementById('gold').textContent = `Gold: ${gold}`;
  document.getElementById('exp').textContent = `EXP: ${exp}`;
  document.getElementById('level').textContent = `Level: ${level}`;
  document.getElementById('stat-points').textContent = points;
  document.getElementById('str-val').textContent = stats.strength;
  document.getElementById('vit-val').textContent = stats.vitality;
  document.getElementById('eng-val').textContent = stats.energy;

  updateExpBar();
  updateWizardHpBar();
}

function addStat(stat) {
  if (points <= 0) return;
  stats[stat]++;
  points--;

  if (stat === 'vitality') wizardHp += 2;
  updateWizardHpBar();
  updateHUD();
}

function spawnWave() {
  enemies.forEach(e => e.remove());
  enemies = [];

  const count = Math.floor(Math.random() * 5) + 3; // 3-7 enemies
  const spacing = 640 / (count + 1);
  for (let i = 0; i < count; i++) {
    const x = spacing * (i + 1);
    const y = 40 + Math.random() * 50; // near top
    createEnemy(x, y);
  }
}

function createEnemy(x, y) {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;
  enemy.dataset.hp = '3';

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
  const wizardX = wizard.offsetLeft;
  const closest = enemies.reduce((a, b) =>
    Math.abs(a.offsetLeft - wizardX) < Math.abs(b.offsetLeft - wizardX) ? a : b
  );
  const targetX = closest.offsetLeft;
  isMoving = true;
  const step = wizardX < targetX ? 2 : -2;
  const interval = setInterval(() => {
    const x = wizard.offsetLeft;
    const next = x + step;
    if ((step > 0 && next >= targetX) || (step < 0 && next <= targetX)) {
      clearInterval(interval);
      isMoving = false;
    }
    wizard.style.left = `${next}px`;
  }, 20);
}

function castFireball() {
  if (enemies.length === 0 || isMoving) return;
  const manaCost = 1;
  if (wizardMana < manaCost) return;

  wizardMana -= manaCost;
  updateWizardHpBar();

  const fireball = document.createElement('div');
  fireball.classList.add('fireball');
  fireball.style.left = `${wizard.offsetLeft + 10}px`;
  fireball.style.top = `${wizard.offsetTop}px`;
  game.appendChild(fireball);

  const damage = 1 + stats.strength;

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
        inner.style.width = `${(hp / 3) * 100}%`;
        enemy.classList.add('enemy-hit');
        setTimeout(() => enemy.classList.remove('enemy-hit'), 300);

        if (hp <= 0) {
          enemy.remove();
          enemies.splice(i, 1);
          gold += 5;
          exp += 10;
          const expNeeded = level * 20;
          if (exp >= expNeeded) {
            exp -= expNeeded;
            level++;
            points++;
          }
          updateHUD();

          if (enemies.length === 0) {
            setTimeout(() => {
              spawnWave();
              moveWizardToTarget();
            }, 500);
          } else moveWizardToTarget();
        }

        fireball.remove();
        clearInterval(interval);
      }
    });
  }, 20);
}

function checkEnemyAttack() {
  if (enemies.length === 0) return;

  wizard.classList.add('wizard-hit');
  wizardHp -= 1;
  if (wizardHp <= 0) {
    clearInterval(castInterval);
    clearInterval(attackInterval);
    gameOverScreen.classList.remove('hidden');
  }
  updateWizardHpBar();
  setTimeout(() => wizard.classList.remove('wizard-hit'), 200);
}

function regenMana() {
  const maxMana = 10 + stats.energy * 3;
  if (wizardMana < maxMana) {
    wizardMana++;
    if (wizardMana > maxMana) wizardMana = maxMana;
    updateWizardHpBar();
  }
}

castInterval = setInterval(castFireball, 1500);
attackInterval = setInterval(checkEnemyAttack, 1500);
setInterval(regenMana, 1000);

updateHUD();
spawnWave();
moveWizardToTarget();

restartBtn.addEventListener('click', () => {
  wizardHp = 10 + stats.vitality * 2;
  wizardMana = 10 + stats.energy * 3;
  updateWizardHpBar();
  gameOverScreen.classList.add('hidden');
  spawnWave();
  moveWizardToTarget();
  clearInterval(castInterval);
  clearInterval(attackInterval);
  castInterval = setInterval(castFireball, 1500);
  attackInterval = setInterval(checkEnemyAttack, 1500);
});

function addStat(stat) {
  if (points <= 0) return;
  stats[stat]++;
  points--;

  if (stat === 'vitality') wizardHp += 2;
  updateWizardHpBar();
  updateHUD();
}
