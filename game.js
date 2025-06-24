const game = document.getElementById('game');
const wizard = document.getElementById('wizard');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const hpBarInner = document.getElementById('hp-bar-inner');
const hpText = document.getElementById('hp-text');

const manaBarInner = document.getElementById('mana-bar-inner');
const manaText = document.getElementById('mana-text');

const expBarInner = document.getElementById('exp-bar-inner');
const expText = document.getElementById('exp-text');

let gold = parseInt(localStorage.getItem('gold')) || 0;
let exp = parseInt(localStorage.getItem('exp')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;
let points = parseInt(localStorage.getItem('points')) || 0;

let stats = JSON.parse(localStorage.getItem('stats')) || {
  strength: 0,
  vitality: 0,
  energy: 0,
};

let enemies = [];
let isMoving = false;

let wizardHpMax = 10 + stats.vitality * 2;
let wizardHp = wizardHpMax;
let wizardManaMax = 10 + stats.energy * 3;
let wizardMana = wizardManaMax;

let castInterval;
let attackInterval;

function updateWizardBars() {
  wizardHpMax = 10 + stats.vitality * 2;
  wizardManaMax = 10 + stats.energy * 3;

  if (wizardHp > wizardHpMax) wizardHp = wizardHpMax;
  if (wizardMana > wizardManaMax) wizardMana = wizardManaMax;

  hpBarInner.style.width = `${(wizardHp / wizardHpMax) * 100}%`;
  hpText.textContent = `${wizardHp} / ${wizardHpMax}`;

  manaBarInner.style.width = `${(wizardMana / wizardManaMax) * 100}%`;
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
  document.getElementById('level').textContent = `Level: ${level}`;
  document.getElementById('stat-points').textContent = points;
  document.getElementById('str-val').textContent = stats.strength;
  document.getElementById('vit-val').textContent = stats.vitality;
  document.getElementById('eng-val').textContent = stats.energy;

  updateWizardBars();
  updateExpBar();
}

function saveProgress() {
  localStorage.setItem('gold', gold);
  localStorage.setItem('exp', exp);
  localStorage.setItem('level', level);
  localStorage.setItem('points', points);
  localStorage.setItem('stats', JSON.stringify(stats));
}

function addStat(stat) {
  if (points <= 0) return;
  stats[stat]++;
  points--;

  if (stat === 'vitality') wizardHp += 2;
  updateWizardBars();
  updateHUD();
  saveProgress();
}

function spawnWave() {
  // Usuwamy stare moby
  enemies.forEach(e => e.remove());
  enemies = [];

  // Losujemy liczbę mobów z wagami
  const count = getWeightedEnemyCount();

  const hasChampion = count >= 7;
  const allEmpowered = count >= 6;

  // Wyliczamy odstępy tak, by moby nie nachodziły na siebie i mieściły się w 640px
  // Maksymalna szerokość to 640 - zostawimy po 40px marginesu po bokach
  const totalWidth = 640 - 80;
  const spacing = totalWidth / count;

  for (let i = 0; i < count; i++) {
    // Pozycja x — dodajemy losowy offset ±10px by efekt grupy był naturalny
    const baseX = 40 + spacing * i;
    const randomOffset = (Math.random() * 20) - 10; // od -10 do +10
    const x = baseX + randomOffset;

    // Pozycja y (trochę w pionie)
    const y = 50 + Math.random() * 20;

    const isChampion = hasChampion && i === 0;
    const isEmpowered = allEmpowered && !isChampion && Math.random() < 0.5;

    createEnemy(x, y, isChampion, isEmpowered);
  }
}

// Funkcja losująca liczbę mobów z wagami (większe prawdopodobieństwo małych ilości)
function getWeightedEnemyCount() {
  const weights = [30, 25, 20, 10, 7, 5, 2, 1]; // 1-8 mobów
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i + 1;
  }
  return 1;
}

// createEnemy z parametrami na czempiona i wzmacnianego
function createEnemy(x, y, isChampion = false, isEmpowered = false) {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;

  // HP wg typu (czempion 6 HP, wzmacniany 4, normalny 3)
  if (isChampion) {
    enemy.dataset.hp = 6;
    enemy.classList.add('champion');
  } else if (isEmpowered) {
    enemy.dataset.hp = 4;
    enemy.classList.add('empowered');
  } else {
    enemy.dataset.hp = 3;
  }

  // Pasek HP
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
  updateWizardBars();

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
          saveProgress();

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
  updateWizardBars();
  setTimeout(() => wizard.classList.remove('wizard-hit'), 200);
}

function regenMana() {
  const maxMana = 10 + stats.energy * 3;
  if (wizardMana < maxMana) {
    wizardMana++;
    if (wizardMana > maxMana) wizardMana = maxMana;
    updateWizardBars();
  }
}

castInterval = setInterval(castFireball, Math.max(300, 1500 - stats.energy * 100));
attackInterval = setInterval(checkEnemyAttack, 1500);
setInterval(regenMana, 1000);

updateHUD();
spawnWave();
moveWizardToTarget();

restartBtn.addEventListener('click', () => {
  wizardHp = 10 + stats.vitality * 2;
  wizardMana = 10 + stats.energy * 3;
  updateWizardBars();
  gameOverScreen.classList.add('hidden');
  spawnWave();
  moveWizardToTarget();
  clearInterval(castInterval);
  clearInterval(attackInterval);
  castInterval = setInterval(castFireball, Math.max(300, 1500 - stats.energy * 100));
  attackInterval = setInterval(checkEnemyAttack, 1500);
});

function addStat(stat) {
  if (points <= 0) return;
  stats[stat]++;
  points--;

  if (stat === 'vitality') wizardHp += 2;
  updateWizardBars();
  updateHUD();
  saveProgress();
}
