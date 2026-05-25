/**
 * CYBERDEFENSE // IDLE - Core Game Engine
 * Fully procedural incremental tower defense running on HTML5 Canvas.
 * No external media assets needed. Audio is synthesized in real-time.
 */

// ==========================================
// 1. SOUND GENERATION SYSTEM (Web Audio Synth)
// ==========================================
class SynthEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.analyser = null;
    this.bufferLength = 0;
    this.dataArray = null;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Live waveform analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.analyser.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  connectNode(node) {
    if (this.analyser) {
      node.connect(this.analyser);
    } else {
      node.connect(this.ctx.destination);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) this.init();
    return this.muted;
  }

  playShoot(type) {
    if (this.muted || !this.ctx) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    
    switch (type) {
      case 'pulse': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        this.connectNode(gain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.12);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.start(t);
        osc.stop(t + 0.13);
        break;
      }
      case 'plasma': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        this.connectNode(gain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.start(t);
        osc.stop(t + 0.36);
        break;
      }
      case 'stasis': {
        // Continuous soft modulation click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        this.connectNode(gain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.sin(t * 50) * 100, t);
        
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.setValueAtTime(0.001, t + 0.04);

        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }
      case 'tesla': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        this.connectNode(gain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.setValueAtTime(800, t + 0.04);
        osc.frequency.setValueAtTime(1500, t + 0.08);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.start(t);
        osc.stop(t + 0.13);
        break;
      }
    }
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.setValueAtTime(90, t + 0.04);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  playExplode() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    
    // Low frequency drone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.45);

    // High frequency sizzle
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.connect(gain2);
    this.connectNode(gain2);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(250, t);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.25);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    gain2.gain.setValueAtTime(0.12, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.start(t);
    osc.stop(t + 0.46);
    osc2.start(t);
    osc2.stop(t + 0.26);
  }

  playCoin() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playLose() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.8);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  playWin() {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      this.connectNode(gain);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.12);

      gain.gain.setValueAtTime(0.06, t + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.3);

      osc.start(t + idx * 0.12);
      osc.stop(t + idx * 0.12 + 0.35);
    });
  }
}

const Audio = new SynthEngine();

// ==========================================
// 2. GRID SECTORS (Map Definitions)
// ==========================================
const SECTORS = [
  {
    id: 0,
    name: "Sector 01: S-Curve",
    description: "Standard industrial pipeline route. Easy corridor control.",
    difficulty: 1.0,
    multiplier: 1.0,
    maxWaves: 20,
    pathPoints: [
      {x: 0, y: 2},
      {x: 5, y: 2},
      {x: 5, y: 7},
      {x: 10, y: 7},
      {x: 10, y: 3},
      {x: 15, y: 3},
      {x: 15, y: 6}
    ]
  },
  {
    id: 1,
    name: "Sector 02: Spiral Lab",
    description: "Highly winding containment chamber. Maximum range exposure.",
    difficulty: 1.5,
    multiplier: 1.6,
    maxWaves: 25,
    pathPoints: [
      {x: 0, y: 0},
      {x: 14, y: 0},
      {x: 14, y: 8},
      {x: 2, y: 8},
      {x: 2, y: 3},
      {x: 11, y: 3},
      {x: 11, y: 6},
      {x: 5, y: 6},
      {x: 5, y: 5}
    ]
  },
  {
    id: 2,
    name: "Sector 03: Cyber Loop",
    description: "Intense grid lines. Multiple sharp hairpin turns.",
    difficulty: 2.2,
    multiplier: 2.8,
    maxWaves: 30,
    pathPoints: [
      {x: 0, y: 5},
      {x: 2, y: 5},
      {x: 2, y: 1},
      {x: 7, y: 1},
      {x: 7, y: 8},
      {x: 11, y: 8},
      {x: 11, y: 2},
      {x: 14, y: 2},
      {x: 14, y: 6},
      {x: 15, y: 6}
    ]
  },
  {
    id: 3,
    name: "Sector 04: Crosshairs",
    description: "Symmetrical tactical junction. Defense lines meet at central hub.",
    difficulty: 3.0,
    multiplier: 4.2,
    maxWaves: 35,
    pathPoints: [
      {x: 0, y: 1},
      {x: 13, y: 1},
      {x: 13, y: 8},
      {x: 3, y: 8},
      {x: 3, y: 4},
      {x: 10, y: 4},
      {x: 10, y: 6}
    ]
  },
  {
    id: 4,
    name: "Sector 05: Circuit Core",
    description: "The ultimate matrix node. Winding micro-chords and loops.",
    difficulty: 4.0,
    multiplier: 6.5,
    maxWaves: 40,
    pathPoints: [
      {x: 0, y: 8},
      {x: 1, y: 8},
      {x: 1, y: 1},
      {x: 14, y: 1},
      {x: 14, y: 7},
      {x: 5, y: 7},
      {x: 5, y: 3},
      {x: 11, y: 3},
      {x: 11, y: 5}
    ]
  }
];

const TIER_MULTIPLIERS = {
  1: { hp: 1.0, speed: 1.0, credits: 1.0, crystals: 1.0 },
  2: { hp: 2.5, speed: 2.5, credits: 2.0, crystals: 2.0 },
  3: { hp: 6.0, speed: 6.0, credits: 4.5, crystals: 4.0 },
  4: { hp: 15.0, speed: 15.0, credits: 10.0, crystals: 8.0 },
  5: { hp: 40.0, speed: 40.0, credits: 22.0, crystals: 16.0 }
};

// ==========================================
// 3. BALANCING CONFIGURATIONS
// ==========================================
const TOWER_METADATA = {
  pulse: {
    name: "Pulse Laser",
    baseCost: 50,
    baseRange: 130,
    baseRate: 1.4, // shots per sec
    baseDamage: 12,
    color: '#00ffff',
    description: "Rapid single-target energy pulse. Reliable basic defense."
  },
  plasma: {
    name: "Plasma Cannon",
    baseCost: 150,
    baseRange: 100,
    baseRate: 0.5,
    baseDamage: 38,
    splashRadius: 55,
    color: '#ff007f',
    description: "Heavy orbital payload. High damage with kinetic splash radius."
  },
  stasis: {
    name: "Stasis Relay",
    baseCost: 100,
    baseRange: 115,
    baseRate: 4.0, // Ticks per second
    baseDamage: 2.5, // low ticking damage
    slowEffect: 0.35, // 35% slow
    color: '#39ff14',
    description: "Draws continuous coolant beam that slows target speeds."
  },
  tesla: {
    name: "Tesla Matrix",
    baseCost: 350,
    baseRange: 120,
    baseRate: 0.8,
    baseDamage: 22,
    maxTargets: 3,
    color: '#ffff00',
    description: "High voltage matrix chaining electrical arcs to multiple targets."
  }
};

const UPGRADES_META = {
  pulse: [
    { id: 'pulse_dmg', name: "Pulse Hypercharge", stat: 'damage', scale: 0.12, baseCost: 25, costScale: 1.30, desc: "+12% Damage per level." },
    { id: 'pulse_rate', name: "Pulse Speed Boost", stat: 'rate', scale: 0.06, baseCost: 30, costScale: 1.32, desc: "+6% Fire Rate per level." },
    { id: 'pulse_range', name: "Pulse Extended Lens", stat: 'range', scale: 0.05, baseCost: 25, costScale: 1.28, desc: "+5% Attack Range per level." }
  ],
  plasma: [
    { id: 'plasma_dmg', name: "Plasma Heat-Core", stat: 'damage', scale: 0.15, baseCost: 75, costScale: 1.35, desc: "+15% Heavy Damage per level." },
    { id: 'plasma_splash', name: "Kinetic Shockwave", stat: 'splash', scale: 0.08, baseCost: 90, costScale: 1.38, desc: "+8% Explosion Radius per level." },
    { id: 'plasma_range', name: "Magnetic Railgun", stat: 'range', scale: 0.04, baseCost: 80, costScale: 1.32, desc: "+4% Attack Range per level." }
  ],
  stasis: [
    { id: 'stasis_dmg', name: "Stasis Friction Tick", stat: 'damage', scale: 0.10, baseCost: 50, costScale: 1.30, desc: "+10% Laser Damage per level." },
    { id: 'stasis_slow', name: "Absolute Zero Coolant", stat: 'slow', scale: 0.05, maxVal: 0.70, maxLevel: 7, baseCost: 60, costScale: 1.35, desc: "+5% Slow Factor per level (Max 70%)." },
    { id: 'stasis_range', name: "Broad Beam Aperture", stat: 'range', scale: 0.05, baseCost: 50, costScale: 1.28, desc: "+5% Tracking Range per level." }
  ],
  tesla: [
    { id: 'tesla_dmg', name: "Tesla Volt Surge", stat: 'damage', scale: 0.14, baseCost: 150, costScale: 1.38, desc: "+14% Arc Damage per level." },
    { id: 'tesla_targets', name: "Multi-Chain Arc", stat: 'targets', scale: 1.0, maxVal: 8, maxLevel: 5, baseCost: 250, costScale: 1.60, desc: "+1 Max Chained Target per level (Max 8)." },
    { id: 'tesla_range', name: "Ionized Atmosphere", stat: 'range', statOverride: true, scale: 0.05, baseCost: 120, costScale: 1.32, desc: "+5% Bolt Chain Range per level." }
  ],
  quantum: [
    { id: 'q_cost', name: "Tachyon Builders", stat: 'cost_red', scale: 0.02, maxVal: 5, baseCosts: [1, 2, 3, 5, 8], costType: 'crystals', desc: "Reduces Construct credit costs of all towers by -2% per level (Max -10%)." },
    { id: 'q_cd', name: "Overclock Generators", stat: 'skills_cd', scale: 0.04, maxVal: 5, baseCosts: [1, 2, 3, 5, 8], costType: 'crystals', desc: "Increases operator skills recharge speed by +4% per level (Max +20%)." },
    { id: 'q_hp', name: "Grid Saboteurs", stat: 'enemy_hp', scale: 0.02, maxVal: 5, baseCosts: [2, 3, 5, 8, 12], costType: 'crystals', desc: "Disrupts incoming threat networks, reducing base enemy HP by -2% per level (Max -10%)." },
    { id: 'q_offline', name: "Offline Scrapers", stat: 'offline_rate', scale: 0.10, maxVal: 5, baseCosts: [1, 2, 3, 5, 8], costType: 'crystals', desc: "Enhances passive offline credit generation rate by +10% per level (Max +50%)." },
    { id: 'q_bonus', name: "Prestige Synthesizers", stat: 'completion_bonus', scale: 0.20, maxVal: 5, baseCosts: [2, 3, 5, 8, 12], costType: 'crystals', desc: "Increases credits completion bonuses when securing sectors by +20% per level (Max +100%)." },
    { id: 'q_range', name: "Coaxial Refractors", stat: 'global_range', scale: 0.02, maxVal: 5, baseCosts: [2, 3, 5, 8, 12], costType: 'crystals', desc: "Expands base range of all constructed towers by +2% per level (Max +10%)." },
    { id: 'q_thorns', name: "Quantum Thorns", stat: 'thorns', scale: 0.08, maxVal: 5, baseCosts: [2, 4, 6, 8, 10], costType: 'crystals', desc: "Deals 8% max HP retaliation damage per level to hostiles that impact the core." }
  ],
  attack: [
    { id: 'att_dmg_mult', name: "Global Overdrive", stat: 'att_dmg', scale: 0.05, maxVal: 99, baseCost: 100, costScale: 1.40, desc: "+5% Damage globally for all constructed towers per level." },
    { id: 'att_speed_mult', name: "Tachyon Feeder", stat: 'att_speed', scale: 0.03, maxVal: 99, baseCost: 120, costScale: 1.45, desc: "+3% Fire/Tick Rate globally for all towers per level." },
    { id: 'att_crit_mult', name: "Critical Decimation", stat: 'att_crit', scale: 0.30, maxVal: 50, baseCost: 150, costScale: 1.50, desc: "+0.3 Critical hit damage factor for Pulse Lasers per level." },
    { id: 'att_range_mult', name: "Global Range Extender", stat: 'att_range', scale: 0.02, maxVal: 80, baseCost: 130, costScale: 1.42, desc: "+2% Range globally for all constructed towers per level." },
    { id: 'att_knockback', name: "Graviton Bullets", stat: 'att_knockback', scale: 0.15, maxVal: 50, baseCost: 180, costScale: 1.45, desc: "Unlocks and increases recoil knockback on all projectiles by +15% per level." }
  ],
  defense: [
    { id: 'def_shield_max', name: "Core Shield Max", stat: 'def_shield', scale: 10, maxVal: 99, baseCost: 100, costScale: 1.40, desc: "Unlocks and increases Core Energy Shield capacity by +10 points per level." },
    { id: 'def_shield_regen', name: "Shield Regeneration", stat: 'def_regen', scale: 0.20, maxVal: 99, baseCost: 120, costScale: 1.45, desc: "Regenerates active Core Energy Shields by +0.2 shield points per second per level." },
    { id: 'def_pct', name: "Defense % Reduction", stat: 'def_pct', scale: 0.03, maxVal: 25, baseCost: 150, costScale: 1.50, desc: "Slashes all incoming Core Integrity damage by -3% per level (Max -75%)." },
    { id: 'def_thorns_pct', name: "Shield Thorns", stat: 'def_thorns', scale: 0.15, maxVal: 50, baseCost: 140, costScale: 1.40, desc: "Deals +15% hostile max HP retaliation damage per level when Core Shield is active." }
  ],
  utility: [
    { id: 'ut_interest', name: "Wave Bank Interest", stat: 'ut_interest', scale: 0.05, maxVal: 50, baseCost: 100, costScale: 1.40, desc: "Earns +5% interest (max 15₡ cap per lvl) of saved balance at end of each wave." },
    { id: 'ut_credits_kill', name: "Tax Scrapers", stat: 'ut_credits', scale: 1.0, maxVal: 99, baseCost: 120, costScale: 1.45, desc: "Earns +1 extra Cyber-Credit permanently per threat unit neutralized." },
    { id: 'ut_skills_cd', name: "Operator Clock Speed", stat: 'ut_cd', scale: 0.04, maxVal: 50, baseCost: 150, costScale: 1.50, desc: "Accelerates Operator Skills recharges (Lightning, Overclock) by +4% per level." },
    { id: 'ut_refund', name: "Sim Refund Program", stat: 'ut_refund', scale: 0.10, maxVal: 3, baseCost: 200, costScale: 1.80, desc: "Enhances dismantle refund percentage by +10% per level (Max 100% full refund)." }
  ]
};

const MODULES_REGISTRY = [
  { id: 'tachyon', name: "Tachyon Overdrive", desc: "Manipulates simulation speed parameters, unlocking 6x and 8x game speeds." },
  { id: 'swarms', name: "Swarms Decryption", desc: "Alters wave synthesis density. Swarm size increased by +30%, but their base HP is reduced by -15%." },
  { id: 'harvester', name: "Crit Harvester", desc: "Attacking vectors that die from a Critical Hit have a +10% chance to yield double credit rewards." },
  { id: 'amplifier', name: "Resonance Amplifier", desc: "Broadens signal resonance. Placed towers deal +15% damage, but their Construct costs increase by +10%." },
  { id: 'capacitor', name: "Active HP Capacitor", desc: "Regenerates +1 HP per second to core structural integrity while a wave simulation is actively running." },
  { id: 'absorb', name: "Absorb Fields", desc: "Integrates specialized micro-shields. Restricts damage by -20% when hostiles reach the end gate." }
];

// ==========================================
// 4. GAME STATE ENGINE
// ==========================================
class GameEngine {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    
    // Core settings
    this.gridWidth = 16;
    this.gridHeight = 10;
    this.cellWidth = 50;
    this.cellHeight = 50;

    // Simulation Clock
    this.lastTime = 0;
    this.speedMultiplier = 1;
    this.isPaused = true;
    this.autoWave = true;
    this.autoReboot = true;
    this.waveRunning = false;

    // Player State
    this.coins = 50;
    this.baseHealth = 100;
    this.maxBaseHealth = 100;
    
    this.currentSectorId = 0;
    this.currentWave = 1;
    
    // Progression State (Saved)
    this.unlockedSectorMax = 0; // index of max sector unlocked
    this.completedSectors = [];  // IDs of sectors completed
    this.completedSectorTiers = {}; // key: sector_id, value: max_tier_completed
    this.selectedSectorTiers = {};  // key: sector_id, value: selected_tier
    this.permanentUpgrades = {}; // key: upgrade_id, value: level
    this.sectorHighWaves = {};   // key: sector_id, value: max_wave_reached
    
    // Entities
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.enemiesRemainingToSpawn = 0;
    
    // Path cache
    this.pathCoordinates = [];
    this.blockedGrid = Array(this.gridWidth).fill(null).map(() => Array(this.gridHeight).fill(false));
    
    // UI selection state
    this.activePlacementType = null;
    this.selectedPlacedTower = null;
    this.hoveredGridX = -1;
    this.hoveredGridY = -1;

    // Tactical Active Operator Skills
    this.lightningCooldown = 0;
    this.lightningMaxCooldown = 20; // 20s
    this.shieldCooldown = 0;
    this.shieldMaxCooldown = 40; // 40s
    this.lightningActiveMode = false;
    this.quantumCrystals = 0;

    // Lifetime Statistics
    this.stats = {
      totalKills: 0,
      totalCoinsEarned: 50,
      towersPlaced: 0,
      totalRuns: 0,
      mapsCleared: 0,
      enemyKills: { normal: 0, fast: 0, tank: 0, boss: 0 }
    };

    // Tracking run earnings
    this.runEarnings = 0;

    // Equipped Modules deck builder state
    this.equippedModules = [];

    // Core Energy Shield health buffer state
    this.coreShield = 0;

    // Spawning queue for real-time speed synchronization
    this.spawnQueue = [];
    this.spawnTimerAccumulator = 0;
    this.spawnInterval = 0.6; // seconds (equal to original 600ms timer)
    this.isEndlessMode = false;
  }

  init() {
    this.loadGame();
    this.loadSector(this.currentSectorId, false);
    this.setupListeners();
    this.renderPermanentUpgradesTab('pulse');
    this.renderSectorsList();
    this.renderDossier();
    this.renderModulesDeck();
    this.updateUI();

    // Start Animation frame loop
    requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  // ==========================================
  // SAVE & LOAD MECHANICS
  // ==========================================
  saveGame() {
    const data = {
      coins: this.coins,
      unlockedSectorMax: this.unlockedSectorMax,
      completedSectors: this.completedSectors,
      completedSectorTiers: this.completedSectorTiers,
      selectedSectorTiers: this.selectedSectorTiers,
      permanentUpgrades: this.permanentUpgrades,
      sectorHighWaves: this.sectorHighWaves,
      stats: this.stats,
      currentSectorId: this.currentSectorId,
      quantumCrystals: this.quantumCrystals,
      equippedModules: this.equippedModules,
      coreShield: this.coreShield,
      isEndlessMode: this.isEndlessMode,
      waveRunning: this.waveRunning,
      exitTime: Date.now(),
      towers: this.towers.map(t => ({
        type: t.type,
        gx: t.gridX,
        gy: t.gridY,
        level: t.level,
        targeting: t.targeting
      }))
    };
    localStorage.setItem("CyberDefense_Save", JSON.stringify(data));
  }

  loadGame() {
    const raw = localStorage.getItem("CyberDefense_Save");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      this.coins = data.coins !== undefined ? data.coins : 50;
      this.unlockedSectorMax = data.unlockedSectorMax || 0;
      this.completedSectors = data.completedSectors || [];
      this.completedSectorTiers = data.completedSectorTiers || {};
      this.selectedSectorTiers = data.selectedSectorTiers || {};
      
      // Migrate old completed sector tracking to tier tracking
      if (this.completedSectors.length > 0 && Object.keys(this.completedSectorTiers).length === 0) {
        this.completedSectors.forEach(id => {
          this.completedSectorTiers[id] = 1;
        });
      }

      this.permanentUpgrades = data.permanentUpgrades || {};
      this.sectorHighWaves = data.sectorHighWaves || {};
      this.currentSectorId = data.currentSectorId || 0;
      this.quantumCrystals = data.quantumCrystals || 0;
      this.equippedModules = data.equippedModules || [];
      this.coreShield = data.coreShield !== undefined ? data.coreShield : 0;
      this.isEndlessMode = data.isEndlessMode !== undefined ? data.isEndlessMode : false;
      
      if (data.stats) {
        this.stats = { ...this.stats, ...data.stats };
        if (!this.stats.enemyKills) {
          this.stats.enemyKills = { normal: 0, fast: 0, tank: 0, boss: 0 };
        }
      }

      // Recreate towers if map matches
      if (data.towers) {
        this.towers = data.towers.map(d => {
          const t = new Tower(d.type, d.gx, d.gy, this.getTowerUpgradedStats(d.type));
          t.level = d.level || 1;
          t.targeting = d.targeting || 'first';
          return t;
        });
      }

      // Calculate offline earnings
      const wasWaveRunning = data.waveRunning !== undefined ? data.waveRunning : false;
      if (data.exitTime && this.towers.length > 0 && !wasWaveRunning) {
        const elapsedMs = Date.now() - data.exitTime;
        const minutes = Math.floor(elapsedMs / 60000);
        
        // Trigger offline overlay if gone for at least 3 minutes
        if (minutes >= 3) {
          const baseRate = 3; // 3 credits per minute base
          const sectorBonus = 1 + (this.unlockedSectorMax || 0) * 1.5;
          const offlineLevel = this.permanentUpgrades['q_offline'] || 0;
          const offlineMultiplier = 1 + offlineLevel * 0.10;
          const finalMin = Math.min(720, minutes); // 12h cap
          const accumulated = Math.round(finalMin * baseRate * sectorBonus * offlineMultiplier);
          
          if (accumulated > 0) {
            setTimeout(() => {
              const hrs = Math.floor(minutes / 60);
              const mins = minutes % 60;
              document.getElementById("offline-time-val").innerText = `${hrs}h ${mins}m`;
              document.getElementById("offline-credits-val").innerText = `${accumulated} ₡`;
              
              const banner = document.getElementById("offline-banner");
              banner.classList.remove("hidden-overlay");
              
              const claimBtn = document.getElementById("claim-offline-btn");
              const onClaim = () => {
                banner.classList.add("hidden-overlay");
                this.earnCoins(accumulated, true);
                Audio.playCoin();
                claimBtn.removeEventListener("click", onClaim);
              };
              claimBtn.addEventListener("click", onClaim);
            }, 800);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load save data", e);
    }
  }

  resetGame() {
    if (confirm("FACTORY WIPEOUT: Are you absolutely sure you want to delete all permanent upgrade levels, map completions, and coins? This cannot be undone!")) {
      localStorage.removeItem("CyberDefense_Save");
      location.reload();
    }
  }

  calculateCrystalsPending() {
    const lifetimeCoins = this.stats.totalCoinsEarned || 0;
    const totalCrystals = Math.floor(Math.sqrt(lifetimeCoins / 500));
    return Math.max(0, totalCrystals - this.quantumCrystals);
  }

  triggerPrestige() {
    const pending = this.calculateCrystalsPending();
    if (pending <= 0) return;
    
    if (confirm(`INITIATE QUANTUM REBOOT? This will inject subatomic dark energy into the grid, resetting active sector placements and credits in exchange for +${pending} Quantum Crystals (+${pending * 3}% credit gains permanently). Permanent upgrades will remain intact.`)) {
      this.quantumCrystals += pending;
      this.coins = 50;
      this.towers = [];
      this.saveGame();
      this.loadSector(0, false); // reboot to Sector 01
      Audio.playWin(); // play ascending synthesis tune
      this.createFloatingText("QUANTUM INJECTION SUCCESSFUL", 400, 250, '#b026ff', 18);
    }
  }

  // ==========================================
  // LEVEL SECTOR LOGIC
  // ==========================================
  loadSector(sectorId, isRefundActive = true) {
    const isNewSector = this.currentSectorId !== sectorId;

    // If refund active, return 100% of placed tower coins to credit pool
    if (isRefundActive) {
      let refundTotal = 0;
      this.towers.forEach(t => {
        refundTotal += t.getTotalValue();
      });
      if (refundTotal > 0) {
        this.earnCoins(refundTotal, false); // earn without adding to stats
        this.createFloatingText(`+${refundTotal} Refund`, 400, 250, '#00ffff', 18);
      }

      // Taxed Carry-over: keep only 20% of credits (min 50 credits) when switching sectors
      if (isNewSector) {
        const oldCoins = this.coins;
        this.coins = Math.max(50, Math.round(this.coins * 0.20));
        const taxedAmount = oldCoins - this.coins;
        if (taxedAmount > 0) {
          setTimeout(() => {
            this.createFloatingText(`Sector Tax: -${taxedAmount}₡`, 400, 290, '#ff9900', 14);
          }, 600);
        }
      }
    }

    this.currentSectorId = sectorId;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.enemiesRemainingToSpawn = 0;
    this.spawnQueue = [];
    this.particles = [];
    this.floatingTexts = [];
    this.currentWave = 1;
    this.baseHealth = this.maxBaseHealth;
    this.waveRunning = false;
    this.isPaused = true;
    this.runEarnings = 0;
    this.isEndlessMode = false;

    const mapMeta = SECTORS[sectorId];
    
    // Generate precise path coordinates (interpolate grid layout to canvas coordinates)
    this.pathCoordinates = this.generatePrecisePath(mapMeta.pathPoints);

    // Compute grid tile blocking (prevent placing towers on path tiles)
    this.computeBlockedTiles(mapMeta.pathPoints);

    this.selectedPlacedTower = null;
    this.activePlacementType = null;
    
    // Update play button state
    const playBtn = document.getElementById("play-pause-btn");
    playBtn.innerHTML = `<span class="icon">▶</span> <span class="label">START WAVE</span>`;
    playBtn.classList.remove("active");

    this.renderSectorsList();
    this.updateUI();
    this.saveGame();
  }

  rebootWave() {
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.currentWave = 1;
    this.baseHealth = this.maxBaseHealth;
    this.waveRunning = false;
    this.isPaused = true;
    this.runEarnings = 0;
    this.enemiesRemainingToSpawn = 0;
    this.spawnQueue = [];
    this.isEndlessMode = false;

    // Placed towers are PRESERVED! Just clear active targets
    this.towers.forEach(t => {
      t.lastShot = 0;
      t.activeBeamTarget = null;
      t.activeChainTargets = [];
    });

    const playBtn = document.getElementById("play-pause-btn");
    playBtn.innerHTML = `<span class="icon">▶</span> <span class="label">START WAVE</span>`;
    playBtn.classList.remove("active");

    this.selectedPlacedTower = null;
    this.activePlacementType = null;

    this.updateUI();
    this.saveGame();
  }

  generatePrecisePath(points) {
    const precisePoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      
      const p1Canvas = this.gridToCanvas(p1.x, p1.y);
      const p2Canvas = this.gridToCanvas(p2.x, p2.y);
      
      // Calculate length
      const dx = p2Canvas.x - p1Canvas.x;
      const dy = p2Canvas.y - p1Canvas.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      // Step factor (1 pixel step)
      const steps = Math.floor(distance);
      for (let s = 0; s < steps; s++) {
        const ratio = s / steps;
        precisePoints.push({
          x: p1Canvas.x + dx * ratio,
          y: p1Canvas.y + dy * ratio
        });
      }
    }
    // Add final point
    precisePoints.push(this.gridToCanvas(points[points.length-1].x, points[points.length-1].y));
    return precisePoints;
  }

  computeBlockedTiles(pathPoints) {
    // Reset grid
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        this.blockedGrid[x][y] = false;
      }
    }

    // Mark nodes and paths between nodes
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const p1 = pathPoints[i];
      const p2 = pathPoints[i+1];
      
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            this.blockedGrid[x][y] = true;
          }
        }
      }
    }
  }

  gridToCanvas(gx, gy) {
    return {
      x: gx * this.cellWidth + this.cellWidth / 2,
      y: gy * this.cellHeight + this.cellHeight / 2
    };
  }

  canvasToGrid(cx, cy) {
    return {
      x: Math.floor(cx / this.cellWidth),
      y: Math.floor(cy / this.cellHeight)
    };
  }

  // Get permanently upgraded tower parameters
  getTowerUpgradedStats(type) {
    const meta = TOWER_METADATA[type];
    const stats = { ...meta };
    
    // Apply permanent tech levels
    const upgrades = UPGRADES_META[type] || [];
    upgrades.forEach(u => {
      const lv = this.permanentUpgrades[u.id] || 0;
      if (lv > 0) {
        let upgradeMult = 1 + lv * u.scale;
        
        if (u.maxVal) {
          // Cap scaling
          upgradeMult = Math.min(u.maxVal, lv * u.scale);
        }

        if (u.stat === 'damage') {
          stats.baseDamage *= upgradeMult;
        } else if (u.stat === 'rate') {
          stats.baseRate *= upgradeMult;
        } else if (u.stat === 'range') {
          stats.baseRange *= upgradeMult;
        } else if (u.stat === 'splash') {
          stats.splashRadius *= upgradeMult;
        } else if (u.stat === 'slow') {
          stats.slowEffect = Math.min(u.maxVal, meta.slowEffect + lv * u.scale);
        } else if (u.stat === 'targets') {
          stats.maxTargets = Math.min(u.maxVal, meta.maxTargets + Math.round(lv * u.scale));
        }
      }
    });

    // Apply Quantum Global Range boost
    const rangeLevel = this.permanentUpgrades['q_range'] || 0;
    if (rangeLevel > 0) {
      stats.baseRange *= (1 + rangeLevel * 0.02);
    }

    // Apply Attack Global Range extender (+2% range per lvl)
    const attRangeLevel = this.permanentUpgrades['att_range_mult'] || 0;
    if (attRangeLevel > 0) {
      stats.baseRange *= (1 + attRangeLevel * 0.02);
    }

    // Apply Attack Global Speed increase (+3% rate per lvl)
    const attSpeedLevel = this.permanentUpgrades['att_speed_mult'] || 0;
    if (attSpeedLevel > 0) {
      stats.baseRate *= (1 + attSpeedLevel * 0.03);
    }

    return stats;
  }

  getConstructCost(type) {
    const meta = TOWER_METADATA[type];
    const costLevel = this.permanentUpgrades['q_cost'] || 0;
    const reduction = 1 - costLevel * 0.02;
    let cost = Math.round(meta.baseCost * reduction);
    if (this.equippedModules.includes('amplifier')) {
      cost = Math.round(cost * 1.10);
    }
    return cost;
  }

  // ==========================================
  // INPUT & LISTENERS INTERACTION
  // ==========================================
  setupListeners() {
    // Speed selections (Delegated event listener to support dynamic Tachyon Overdrive speed buttons)
    const speedSelectors = document.querySelector(".speed-selectors");
    if (speedSelectors) {
      speedSelectors.addEventListener("click", (e) => {
        const btn = e.target.closest(".speed-btn");
        if (!btn) return;
        
        document.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.speedMultiplier = parseInt(btn.dataset.speed);
        Audio.playCoin(); // small click confirmation sound
      });
    }

    // Start / Pause Wave
    const playBtn = document.getElementById("play-pause-btn");
    playBtn.addEventListener("click", () => {
      Audio.init(); // Initialize audio on first gesture
      if (this.waveRunning) {
        this.isPaused = !this.isPaused;
        playBtn.innerHTML = this.isPaused ? 
          `<span class="icon">▶</span> <span class="label">RESUME WAVE</span>` : 
          `<span class="icon">⏸</span> <span class="label">PAUSE WAVE</span>`;
        if (this.isPaused) playBtn.classList.remove("active");
        else playBtn.classList.add("active");
      } else {
        this.startNextWave();
      }
    });

    // Option toggles
    const autoWaveBtn = document.getElementById("auto-wave-btn");
    autoWaveBtn.addEventListener("click", () => {
      this.autoWave = !this.autoWave;
      autoWaveBtn.classList.toggle("checked", this.autoWave);
    });

    const autoRebootBtn = document.getElementById("auto-restart-btn");
    autoRebootBtn.addEventListener("click", () => {
      this.autoReboot = !this.autoReboot;
      autoRebootBtn.classList.toggle("checked", this.autoReboot);
    });

    const muteBtn = document.getElementById("mute-btn");
    muteBtn.addEventListener("click", () => {
      const isMuted = Audio.toggleMute();
      document.getElementById("mute-icon").innerText = isMuted ? "🔇" : "🔊";
      muteBtn.classList.toggle("active", isMuted);
    });

    // Canvas click placement / selection
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      // Account for CSS scale sizing
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;
      
      const grid = this.canvasToGrid(cx, cy);
      this.handleCanvasClick(grid.x, grid.y, e.shiftKey);
    });

    // Hover mouse movements for structural preview & range indicators
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;
      
      const grid = this.canvasToGrid(cx, cy);
      this.hoveredGridX = grid.x;
      this.hoveredGridY = grid.y;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.hoveredGridX = -1;
      this.hoveredGridY = -1;
    });

    // Handle tower shop clicks
    document.querySelectorAll(".shop-card").forEach(card => {
      card.addEventListener("click", () => {
        const type = card.dataset.tower;
        const meta = TOWER_METADATA[type];
        
        // Deselect if already selected
        if (this.activePlacementType === type) {
          this.cancelPlacement();
          return;
        }

        if (this.coins < this.getConstructCost(type)) {
          this.createFloatingText("INSUFFICIENT CREDITS", 400, 250, '#ff0055', 18);
          return;
        }

        this.activePlacementType = type;
        this.selectedPlacedTower = null;
        document.querySelectorAll(".shop-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        
        // Show placement HUD
        const overlay = document.getElementById("placement-overlay");
        overlay.classList.remove("hidden-overlay");
        
        this.updateUI();
      });
    });

    // Cancel placement
    document.getElementById("cancel-placement-btn").addEventListener("click", () => this.cancelPlacement());

    // Sidebar operational tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tab = btn.dataset.tab;
        document.getElementById(`tab-${tab}`).classList.add("active");
        
        if (tab === 'dossier') {
          this.renderDossier();
        } else if (tab === 'modules') {
          this.renderModulesDeck();
        } else if (tab === 'upgrades') {
          const activeSubTab = document.querySelector(".sub-tab-btn.active");
          if (activeSubTab) {
            this.renderPermanentUpgradesTab(activeSubTab.dataset.upgradeType);
          }
        }
        
        this.updateUI();
      });
    });

    // Upgrades Subtabs switcher
    document.querySelectorAll(".sub-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderPermanentUpgradesTab(btn.dataset.upgradeType);
      });
    });

    // Inspector dismantling & upgrading
    document.getElementById("inspect-close-btn").addEventListener("click", () => {
      this.selectedPlacedTower = null;
      this.updateUI();
    });

    document.getElementById("inspect-upgrade-btn").addEventListener("click", () => {
      if (this.selectedPlacedTower) {
        const cost = this.selectedPlacedTower.getUpgradeCost();
        if (this.coins >= cost) {
          this.spendCoins(cost);
          this.selectedPlacedTower.level++;
          Audio.playCoin();

          const pos = this.gridToCanvas(this.selectedPlacedTower.gridX, this.selectedPlacedTower.gridY);
          this.createExplosion(pos.x, pos.y, this.selectedPlacedTower.stats.color, 8);
          this.createFloatingText("LEVEL UP!", pos.x, pos.y - 15, '#39ff14', 12);

          this.updateUI();
          this.saveGame();
        } else {
          this.createFloatingText("INSUFFICIENT CREDITS", 400, 250, '#ff0055', 18);
        }
      }
    });

    document.getElementById("inspect-sell-btn").addEventListener("click", () => {
      if (this.selectedPlacedTower) {
        const refund = this.selectedPlacedTower.getTotalValue();
        this.earnCoins(refund, false);
        Audio.playCoin();

        // Particle explosion
        const pos = this.gridToCanvas(this.selectedPlacedTower.gridX, this.selectedPlacedTower.gridY);
        this.createExplosion(pos.x, pos.y, '#00ffff', 12);

        // Remove
        this.towers = this.towers.filter(t => t !== this.selectedPlacedTower);
        this.selectedPlacedTower = null;
        
        this.updateUI();
        this.saveGame();
      }
    });

    // Targeting priority selectors
    document.querySelectorAll(".target-priority-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.selectedPlacedTower) {
          const priority = btn.dataset.priority;
          this.selectedPlacedTower.targeting = priority;
          Audio.playCoin(); // small selection confirmation click
          this.updateUI();
          this.saveGame();
        }
      });
    });

    // Active Grid Powers
    document.getElementById("skill-lightning-btn").addEventListener("click", () => {
      if (this.lightningCooldown <= 0) {
        this.lightningActiveMode = true;
        this.activePlacementType = null;
        this.selectedPlacedTower = null;
        
        // Update HUD
        const overlay = document.getElementById("placement-overlay");
        overlay.classList.remove("hidden-overlay");
        overlay.querySelector(".overlay-text").innerText = "Select targeting coordinates for Sky Lightning";
        this.updateUI();
      }
    });

    document.getElementById("skill-shield-btn").addEventListener("click", () => {
      if (this.shieldCooldown <= 0) {
        this.shieldCooldown = this.shieldMaxCooldown;
        
        // Restore 30 core health
        this.baseHealth = Math.min(this.maxBaseHealth, this.baseHealth + 30);
        Audio.playShoot('tesla'); // play resonance hum
        
        // Visual effects at core
        const points = SECTORS[this.currentSectorId].pathPoints;
        const lastNode = points[points.length - 1];
        const pos = this.gridToCanvas(lastNode.x, lastNode.y);
        this.createExplosion(pos.x, pos.y, '#39ff14', 18);
        this.createFloatingText("+30 CORE HP", pos.x, pos.y - 20, '#39ff14', 15);
        
        this.updateUI();
        this.saveGame();
      }
    });

    // Dialog overlays
    document.getElementById("dismiss-defeat-btn").addEventListener("click", () => {
      document.getElementById("game-over-banner").classList.add("hidden-overlay");
      this.rebootWave();
    });

    document.getElementById("victory-next-btn").addEventListener("click", () => {
      document.getElementById("victory-banner").classList.add("hidden-overlay");
      
      const nextMap = this.currentSectorId + 1;
      if (nextMap < SECTORS.length) {
        this.loadSector(nextMap, true);
      } else {
        // Loops back or infinite mode
        this.loadSector(this.currentSectorId, true);
        this.createFloatingText("Map secured again!", 400, 250, '#39ff14', 20);
      }
    });

    document.getElementById("victory-endless-btn").addEventListener("click", () => {
      document.getElementById("victory-banner").classList.add("hidden-overlay");
      this.isEndlessMode = true;
      this.createFloatingText("ENDLESS MODULATION ACTIVE", 400, 250, '#b026ff', 20);
      
      // Progress wave
      this.currentWave++;
      this.saveGame();
      this.updateUI();
      
      if (this.autoWave) {
        setTimeout(() => this.startNextWave(), 800);
      } else {
        const playBtn = document.getElementById("play-pause-btn");
        playBtn.innerHTML = `<span class="icon">▶</span> <span class="label">START WAVE ${this.currentWave}</span>`;
        playBtn.classList.remove("active");
      }
    });

    // System management
    document.getElementById("save-btn").addEventListener("click", () => {
      this.saveGame();
      this.createFloatingText("GRID STATS WRITTEN TO LOCALSTORAGE", 400, 250, '#39ff14', 16);
    });
    
    document.getElementById("reset-btn").addEventListener("click", () => this.resetGame());
    document.getElementById("prestige-btn").addEventListener("click", () => this.triggerPrestige());

    // Global Keyboard Shortcuts for shop construct triggers and Escape cancelations
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const key = e.key;
      if (key === '1') {
        const card = document.querySelector(".shop-card[data-tower='pulse']");
        if (card) card.click();
      } else if (key === '2') {
        const card = document.querySelector(".shop-card[data-tower='plasma']");
        if (card) card.click();
      } else if (key === '3') {
        const card = document.querySelector(".shop-card[data-tower='stasis']");
        if (card) card.click();
      } else if (key === '4') {
        const card = document.querySelector(".shop-card[data-tower='tesla']");
        if (card) card.click();
      } else if (key === 'Escape') {
        if (this.activePlacementType || this.lightningActiveMode) {
          this.cancelPlacement();
        } else if (this.selectedPlacedTower) {
          this.selectedPlacedTower = null;
          this.updateUI();
        }
      }
    });

    // Active Background Simulation visibility catchup loop
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.backgroundTime = Date.now();
      } else {
        if (this.backgroundTime && this.waveRunning && !this.isPaused) {
          const elapsedMs = Date.now() - this.backgroundTime;
          let elapsedSec = elapsedMs / 1000;
          if (elapsedSec > 180) {
            elapsedSec = 180; // clamp catchup simulation at 3 minutes
          }
          if (elapsedSec > 1.0) {
            const step = 0.05;
            let accumulated = 0;
            while (accumulated < elapsedSec) {
              this.update(step);
              accumulated += step;
            }
          }
        }
        this.backgroundTime = null;
      }
    });
  }

  cancelPlacement() {
    this.activePlacementType = null;
    this.lightningActiveMode = false;
    document.querySelectorAll(".shop-card").forEach(c => c.classList.remove("selected"));
    document.getElementById("placement-overlay").classList.add("hidden-overlay");
    document.getElementById("placement-overlay").querySelector(".overlay-text").innerText = "Select a grid tile to place your tower";
    this.updateUI();
  }

  handleCanvasClick(gx, gy, shiftKey = false) {
    if (gx < 0 || gx >= this.gridWidth || gy < 0 || gy >= this.gridHeight) return;

    // 1. Active Sky Lightning Strike Targeting
    if (this.lightningActiveMode) {
      this.lightningCooldown = this.lightningMaxCooldown;
      this.lightningActiveMode = false;
      
      const pos = this.gridToCanvas(gx, gy);
      
      // Strike physics: deal 220 shock damage to all enemies within 75px range
      const strikeRange = 75;
      this.enemies.forEach(e => {
        const dx = e.x - pos.x;
        const dy = e.y - pos.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= strikeRange) {
          e.takeDamage(220, true); // critical damage!
        }
      });

      Audio.playShoot('tesla'); // electrical blast audio
      this.createExplosion(pos.x, pos.y, '#ffff33', 15);

      // Render lightning flash line particle
      this.particles.push({
        x: pos.x,
        y: pos.y,
        life: 0.35,
        maxLife: 0.35,
        update: function(dt) { this.life -= dt; },
        draw: (ctx) => {
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#ffff00';
          ctx.beginPath();
          ctx.moveTo(pos.x - 30 + Math.random()*60, 0);
          ctx.lineTo(pos.x - 15 + Math.random()*30, pos.y / 2);
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.stroke();
          
          ctx.strokeStyle = 'rgba(255, 255, 0, 0.45)';
          ctx.lineWidth = 8;
          ctx.stroke();
          ctx.restore();
        }
      });

      this.createFloatingText("⚡ LIGHTNING STRIKE!", pos.x, pos.y - 25, '#ffff33', 14);

      this.cancelPlacement();
      this.saveGame();
      return;
    }

    // 2. Placement Mode Active
    if (this.activePlacementType) {
      // Check if tile blocked
      if (this.blockedGrid[gx][gy]) {
        this.createFloatingText("CANNOT CONSTRUCT ON PATH", gx * 50 + 25, gy * 50 + 25, '#ff003c', 13);
        return;
      }

      // Check if tower already exists
      const existing = this.towers.find(t => t.gridX === gx && t.gridY === gy);
      if (existing) {
        this.createFloatingText("SLOT OCCUPIED", gx * 50 + 25, gy * 50 + 25, '#ff003c', 13);
        return;
      }

      // Construct
      const meta = TOWER_METADATA[this.activePlacementType];
      const constructCost = this.getConstructCost(this.activePlacementType);
      if (this.coins >= constructCost) {
        const stats = this.getTowerUpgradedStats(this.activePlacementType);
        const t = new Tower(this.activePlacementType, gx, gy, stats);
        this.towers.push(t);
        this.stats.towersPlaced++;

        this.spendCoins(constructCost);
        
        Audio.playShoot('pulse'); // construct sound
        const pos = this.gridToCanvas(gx, gy);
        this.createExplosion(pos.x, pos.y, stats.color, 10);

        if (shiftKey && this.coins >= this.getConstructCost(this.activePlacementType)) {
          this.updateUI();
        } else {
          this.cancelPlacement();
        }
        this.saveGame();
      } else {
        this.createFloatingText("INSUFFICIENT CREDITS", 400, 250, '#ff0055', 18);
        this.cancelPlacement();
      }
      return;
    }

    // 2. Select Existing Tower
    const existing = this.towers.find(t => t.gridX === gx && t.gridY === gy);
    if (existing) {
      this.selectedPlacedTower = existing;
    } else {
      this.selectedPlacedTower = null;
    }
    
    this.updateUI();
  }

  // ==========================================
  // ECONOMY & UTILS
  // ==========================================
  earnCoins(amount, addToStats = true) {
    let finalAmount = amount;
    if (addToStats) {
      const mult = 1 + this.quantumCrystals * 0.03;
      finalAmount = Math.round(amount * mult);
      this.stats.totalCoinsEarned += finalAmount;
      this.runEarnings += finalAmount;
    }
    this.coins += finalAmount;
    this.updateUI();
  }

  spendCoins(amount) {
    this.coins = Math.max(0, this.coins - amount);
    this.updateUI();
  }

  // ==========================================
  // WAVES PROGRESSION
  // ==========================================
  startNextWave() {
    if (this.waveRunning) return;
    
    this.waveRunning = true;
    this.isPaused = false;
    this.enemies = [];
    
    const playBtn = document.getElementById("play-pause-btn");
    playBtn.innerHTML = `<span class="icon">⏸</span> <span class="label">PAUSE WAVE</span>`;
    playBtn.classList.add("active");

    // Clear runtime bullets
    this.projectiles = [];
    
    // Wave spawn formula
    const mapMeta = SECTORS[this.currentSectorId];
    const wave = this.currentWave;
    
    // Calculate total enemies
    let enemyCount = 8 + wave * 2;
    let swarmHpMult = 1.0;
    if (this.equippedModules.includes('swarms')) {
      enemyCount = Math.round(enemyCount * 1.30);
      swarmHpMult = 0.85; // -15% HP
    }
    
    const selectedTier = this.selectedSectorTiers[this.currentSectorId] || 1;
    const tierMult = TIER_MULTIPLIERS[selectedTier] || TIER_MULTIPLIERS[1];
    
    const baseHp = 18 * mapMeta.difficulty * tierMult.hp;
    const hpNerfLevel = this.permanentUpgrades['q_hp'] || 0;
    const hpMultiplier = 1 - hpNerfLevel * 0.02;
    let healthCurve = baseHp * Math.pow(1.16, wave - 1) * hpMultiplier * swarmHpMult;
    if (this.isEndlessMode && wave > mapMeta.maxWaves) {
      const endlessWaves = wave - mapMeta.maxWaves;
      healthCurve *= Math.pow(1.25, endlessWaves);
    }
    const rewardCurve = Math.round(4 * mapMeta.multiplier * Math.pow(1.10, wave - 1) * tierMult.credits);

    // Spawn queue
    let queue = [];
    for (let i = 0; i < enemyCount; i++) {
      let type = 'normal';
      let hp = healthCurve;
      let spd = 1.35;
      let col = '#e0115f'; // Neon ruby
      let size = 10;
      let coinVal = rewardCurve;

      // Enemy variety based on waves
      if (i % 7 === 3 && wave >= 4) {
        type = 'flyer';
        hp = healthCurve * 0.75;
        spd = 1.6;
        col = '#da00ff'; // Neon magenta flyer
        size = 9;
        coinVal = Math.round(rewardCurve * 1.3);
      } else if (i % 6 === 5 && wave >= 3) {
        type = 'fast';
        hp = healthCurve * 0.45;
        spd = 2.4;
        col = '#00f6ff'; // Neon cyan
        size = 8;
        coinVal = Math.round(rewardCurve * 0.8);
      } else if (i % 8 === 7 && wave >= 5) {
        type = 'tank';
        hp = healthCurve * 3.2;
        spd = 0.7;
        col = '#ff9900'; // Neon orange
        size = 14;
        coinVal = Math.round(rewardCurve * 2.2);
      }

      // Boss on every 10th wave
      if (wave % 10 === 0 && i === enemyCount - 1) {
        type = 'boss';
        hp = healthCurve * 8.5;
        spd = 0.55;
        col = '#b026ff'; // Glowing purple
        size = 20;
        coinVal = Math.round(rewardCurve * 10);
      }

      const speedMult = 1.0 + (selectedTier - 1) * 0.15;
      queue.push({
        type,
        hp: Math.round(hp),
        maxHp: Math.round(hp),
        speed: spd * speedMult,
        color: col,
        size,
        coinReward: coinVal,
        spawnDelay: i * 800 // milliseconds
      });
    }

    this.enemiesRemainingToSpawn = enemyCount;
    this.stats.totalRuns++;

    // Load queue into the state engine for delta-time driven spawning
    this.spawnQueue = queue;
    this.spawnTimerAccumulator = this.spawnInterval; // Start ready to spawn the first enemy instantly
  }

  handleDefeat() {
    this.waveRunning = false;
    this.isPaused = true;
    Audio.playLose();

    if (this.autoReboot) {
      // Clean reload without dialog
      this.rebootWave();
      this.createFloatingText("GRID REBOOTED - RUN RESUMED", 400, 250, '#ff003c', 16);
      setTimeout(() => this.startNextWave(), 1000);
    } else {
      // Show full defeat screen
      document.getElementById("run-earnings").innerText = this.runEarnings;
      document.getElementById("game-over-banner").classList.remove("hidden-overlay");
    }
  }

  handleVictory() {
    this.waveRunning = false;
    this.isPaused = true;
    Audio.playWin();

    // Wave Bank Interest permanent upgrade
    const interestLvl = this.permanentUpgrades['ut_interest'] || 0;
    if (interestLvl > 0) {
      const rate = interestLvl * 0.05;
      const cap = interestLvl * 15;
      const interestEarned = Math.round(Math.min(this.coins * rate, cap));
      if (interestEarned > 0) {
        this.earnCoins(interestEarned, false);
        this.createFloatingText(`+${interestEarned}₡ INTEREST`, 400, 200, '#ffd700', 14);
      }
    }

    const mapMeta = SECTORS[this.currentSectorId];
    
    // High wave records
    const record = this.sectorHighWaves[this.currentSectorId] || 0;
    if (this.currentWave > record) {
      this.sectorHighWaves[this.currentSectorId] = this.currentWave;
    }

    // Complete sector logic
    if (this.currentWave >= mapMeta.maxWaves && !this.isEndlessMode) {
      const selectedTier = this.selectedSectorTiers[this.currentSectorId] || 1;
      const tierMult = TIER_MULTIPLIERS[selectedTier] || TIER_MULTIPLIERS[1];
      const oldMaxTier = this.completedSectorTiers[this.currentSectorId] || 0;

      if (selectedTier > oldMaxTier) {
        this.completedSectorTiers[this.currentSectorId] = selectedTier;
        
        // Direct crystal completion reward
        const crystalReward = Math.round(selectedTier * mapMeta.difficulty);
        this.quantumCrystals += crystalReward;
        setTimeout(() => {
          this.createFloatingText(`+${crystalReward} QUANTUM CRYSTALS`, 400, 160, '#b026ff', 16);
        }, 1200);
      }

      if (!this.completedSectors.includes(this.currentSectorId)) {
        this.completedSectors.push(this.currentSectorId);
      }
      
      this.stats.mapsCleared = Object.values(this.completedSectorTiers).reduce((sum, val) => sum + val, 0);
      
      // Unlock next sector
      const nextId = this.currentSectorId + 1;
      if (nextId < SECTORS.length && nextId > this.unlockedSectorMax) {
        this.unlockedSectorMax = nextId;
      }

      // Show Victory banner
      const bonusLevel = this.permanentUpgrades['q_bonus'] || 0;
      const bonusMultiplier = 1 + bonusLevel * 0.20;
      const victoryBonus = 100 * mapMeta.multiplier * mapMeta.difficulty * bonusMultiplier * tierMult.credits;
      this.earnCoins(victoryBonus, true);
      
      document.getElementById("victory-bonus-val").innerText = Math.round(victoryBonus);
      document.getElementById("victory-banner").classList.remove("hidden-overlay");
    } else {
      // Just progress wave
      this.currentWave++;
      this.saveGame();
      this.updateUI();
      
      if (this.autoWave) {
        setTimeout(() => this.startNextWave(), 800);
      } else {
        const playBtn = document.getElementById("play-pause-btn");
        playBtn.innerHTML = `<span class="icon">▶</span> <span class="label">START WAVE ${this.currentWave}</span>`;
        playBtn.classList.remove("active");
      }
    }
  }

  // ==========================================
  // UPDATES LOGIC (Physics & Combat loop)
  // ==========================================
  tick(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    
    // Scale delta time by our speed selectors
    let dt = (timestamp - this.lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // clamp lag spikes
    
    dt *= this.speedMultiplier;
    
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.tick(t));
  }

  update(dt) {
    // Decrement operator active tactical power cooldowns
    const cdLevel = this.permanentUpgrades['q_cd'] || 0;
    const utCdLevel = this.permanentUpgrades['ut_skills_cd'] || 0;
    const cdSpeed = 1 + cdLevel * 0.04 + utCdLevel * 0.04;

    if (this.lightningCooldown > 0) {
      this.lightningCooldown = Math.max(0, this.lightningCooldown - dt * cdSpeed);
    }
    if (this.shieldCooldown > 0) {
      this.shieldCooldown = Math.max(0, this.shieldCooldown - dt * cdSpeed);
    }

    // Core Shield Regeneration
    const shieldMaxLvl = this.permanentUpgrades['def_shield_max'] || 0;
    if (shieldMaxLvl >= 1 && !this.isPaused) {
      const shieldRegenLvl = this.permanentUpgrades['def_shield_regen'] || 0;
      const maxShieldVal = shieldMaxLvl * 10;
      const regenRate = shieldRegenLvl * 0.2; // shield points per second
      if (this.coreShield === undefined) this.coreShield = 0;
      if (this.coreShield < maxShieldVal && regenRate > 0) {
        this.coreShield = Math.min(maxShieldVal, this.coreShield + regenRate * dt);
        
        // Directly update the Shield HTML bar and text for smooth animations
        const shieldPct = (this.coreShield / maxShieldVal) * 100;
        const fillEl = document.getElementById("core-shield-fill");
        if (fillEl) fillEl.style.width = `${shieldPct}%`;
        const textEl = document.getElementById("core-health-val");
        if (textEl) textEl.innerText = `HP: ${this.baseHealth}/${this.maxBaseHealth} (+${Math.round(this.coreShield)} SHIELD)`;
      }
    }

    if (this.isPaused) {
      // Still update UI floating numbers and effects so graphics aren't frozen
      this.particles.forEach(p => p.update(dt));
      this.particles = this.particles.filter(p => p.life > 0);
      this.floatingTexts.forEach(ft => ft.update(ft, dt));
      this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
      return;
    }

    // Real-time speed-synchronized enemy spawning
    if (this.waveRunning && this.spawnQueue.length > 0) {
      this.spawnTimerAccumulator += dt;
      while (this.spawnQueue.length > 0 && this.spawnTimerAccumulator >= this.spawnInterval) {
        this.spawnTimerAccumulator -= this.spawnInterval;
        const spec = this.spawnQueue.shift();
        if (spec) {
          this.enemies.push(new Enemy(
            spec.type,
            spec.hp,
            spec.maxHp,
            spec.speed,
            spec.color,
            spec.size,
            spec.coinReward,
            [...this.pathCoordinates]
          ));
          this.enemiesRemainingToSpawn--;
        }
      }
    }

    // Active HP Capacitor (+1 HP/s during waves)
    if (this.equippedModules.includes('capacitor') && this.waveRunning) {
      if (this.capacitorRegenAccumulator === undefined) this.capacitorRegenAccumulator = 0;
      this.capacitorRegenAccumulator += dt;
      if (this.capacitorRegenAccumulator >= 1.0) {
        const ticks = Math.floor(this.capacitorRegenAccumulator);
        this.capacitorRegenAccumulator -= ticks;
        this.baseHealth = Math.min(this.maxBaseHealth, this.baseHealth + ticks);
        this.updateUI();
      }
    }

    // 1. Update Enemies
    this.enemies.forEach(e => e.update(dt));
    
    // Check if any enemy reached core
    this.enemies.forEach(e => {
      if (e.reachedEnd) {
        // Core Thorns retaliation (Quantum + Shield Thorns)
        const thornsLevel = this.permanentUpgrades['q_thorns'] || 0;
        const defThornsLvl = this.permanentUpgrades['def_thorns_pct'] || 0;
        let retaliationPercent = thornsLevel * 0.08;
        if (this.coreShield > 0 && defThornsLvl > 0) {
          retaliationPercent += defThornsLvl * 0.15;
        }
        
        if (retaliationPercent > 0) {
          const retaliationDmg = e.maxHealth * retaliationPercent;
          e.takeDamage(retaliationDmg);
        }

        // Damage Calculation
        let coreDmg = (e.type === 'boss' ? 45 : 10);
        
        // Active card absorb
        if (this.equippedModules.includes('absorb')) {
          coreDmg = Math.round(coreDmg * 0.8);
        }
        
        // Defense % reduction permanent upgrade
        const defPctLvl = this.permanentUpgrades['def_pct'] || 0;
        if (defPctLvl > 0) {
          coreDmg = Math.round(coreDmg * (1 - defPctLvl * 0.03));
        }

        // Intercept with Shield Buffer
        let absorbed = 0;
        if (shieldMaxLvl >= 1 && this.coreShield > 0) {
          absorbed = Math.min(this.coreShield, coreDmg);
          this.coreShield -= absorbed;
          coreDmg -= absorbed;
          
          // Spawn blue shield damage particles and absorption indicators
          this.createExplosion(e.x, e.y, '#00bfff', 12);
          this.createFloatingText(`-${Math.round(absorbed)} SHIELD`, e.x, e.y - 15, '#00bfff', 13);
        }

        if (coreDmg > 0) {
          this.baseHealth = Math.max(0, this.baseHealth - coreDmg);
          this.createExplosion(e.x, e.y, '#ff003c', 15);
          this.createFloatingText(`-${coreDmg} CORE`, e.x, e.y, '#ff003c', 14);
        }

        Audio.playLose(); // small thud
        this.updateUI();
      }
    });
    
    // Filter dead or completed
    this.enemies = this.enemies.filter(e => e.health > 0 && !e.reachedEnd);

    // 2. Check Defeat state
    if (this.baseHealth <= 0) {
      this.handleDefeat();
      return;
    }

    // 3. Update Towers
    this.towers.forEach(t => t.update(dt, this.enemies, this.projectiles, this.ctx));

    // 4. Update Projectiles
    this.projectiles.forEach(p => p.update(dt, this.enemies, (pos, color) => this.createExplosion(pos.x, pos.y, color, 8)));
    this.projectiles = this.projectiles.filter(p => !p.destroyed);

    // 5. Update FX Particles
    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => p.life > 0);

    this.floatingTexts.forEach(ft => ft.update(ft, dt));
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);

    // 6. Check Wave Completion
    if (this.waveRunning && this.enemies.length === 0 && this.enemiesRemainingToSpawn === 0) {
      // Verify all enemies spawned
      this.handleVictory();
    }
  }

  // ==========================================
  // RENDER GRAPHICS (HTML5 Canvas Drawing)
  // ==========================================
  render() {
    // Render dossier preview animations if active
    this.drawDossierPreviews();

    // Render live synth oscilloscope trace
    this.drawOscilloscope();

    // Clear board
    this.ctx.fillStyle = '#040306';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Cyber Grid background lines
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += this.cellWidth) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += this.cellHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Draw Map Path
    this.renderPath();

    // Draw Placement HUD Highlights
    if (this.activePlacementType) {
      this.renderPlacementGrid();
    }

    // Draw Towers
    this.towers.forEach(t => t.draw(this.ctx));
    
    // Draw visual range indicators for selected tower
    if (this.selectedPlacedTower) {
      const pos = this.gridToCanvas(this.selectedPlacedTower.gridX, this.selectedPlacedTower.gridY);
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, this.selectedPlacedTower.stats.baseRange, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.22)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.fillStyle = 'rgba(0, 255, 255, 0.025)';
      this.ctx.fill();
    }

    // Draw placement range preview and model preview
    if (this.activePlacementType && this.hoveredGridX >= 0 && this.hoveredGridX < this.gridWidth && this.hoveredGridY >= 0 && this.hoveredGridY < this.gridHeight) {
      const pos = this.gridToCanvas(this.hoveredGridX, this.hoveredGridY);
      const meta = TOWER_METADATA[this.activePlacementType];
      const stats = this.getTowerUpgradedStats(this.activePlacementType);
      
      const isBlocked = this.blockedGrid[this.hoveredGridX][this.hoveredGridY];
      const isOccupied = this.towers.some(t => t.gridX === this.hoveredGridX && t.gridY === this.hoveredGridY);
      const isValid = !isBlocked && !isOccupied;

      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, stats.baseRange, 0, Math.PI * 2);
      this.ctx.strokeStyle = isValid ? 'rgba(0, 255, 255, 0.25)' : 'rgba(255, 0, 80, 0.35)';
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([6, 4]); // Dashed line for preview feel
      this.ctx.stroke();
      this.ctx.setLineDash([]); // Reset
      
      this.ctx.fillStyle = isValid ? 'rgba(0, 255, 255, 0.03)' : 'rgba(255, 0, 80, 0.05)';
      this.ctx.fill();

      // Model structural preview
      this.ctx.save();
      this.ctx.globalAlpha = 0.45;
      
      // Draw Base
      this.ctx.fillStyle = '#181424';
      this.ctx.strokeStyle = isValid ? 'rgba(0, 255, 255, 0.4)' : 'rgba(255, 0, 80, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.rect(pos.x - 18, pos.y - 12, 36, 26);
      this.ctx.fill();
      this.ctx.stroke();

      // Core colored node
      this.ctx.fillStyle = isValid ? stats.color : '#ff0055';
      this.ctx.beginPath();
      if (this.activePlacementType === 'pulse') {
        this.ctx.arc(pos.x, pos.y - 6, 6, 0, Math.PI * 2);
      } else if (this.activePlacementType === 'plasma') {
        this.ctx.rect(pos.x - 6, pos.y - 12, 12, 12);
      } else if (this.activePlacementType === 'stasis') {
        this.ctx.moveTo(pos.x - 6, pos.y);
        this.ctx.lineTo(pos.x + 6, pos.y);
        this.ctx.lineTo(pos.x, pos.y - 14);
        this.ctx.closePath();
      } else if (this.activePlacementType === 'tesla') {
        this.ctx.fillStyle = '#261b36';
        this.ctx.fillRect(pos.x - 3, pos.y - 12, 6, 12);
        this.ctx.fillStyle = stats.color;
        this.ctx.arc(pos.x, pos.y - 12, 5, 0, Math.PI * 2);
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw Laser Beams (drawn underneath particles)
    this.renderContinuousBeams();

    // Draw Projectiles
    this.projectiles.forEach(p => p.draw(this.ctx));

    // Draw Enemies
    this.enemies.forEach(e => e.draw(this.ctx));

    // Draw FX Particles
    this.particles.forEach(p => p.draw(this.ctx));

    // Draw Floating Damage Texts
    this.floatingTexts.forEach(ft => {
      this.ctx.fillStyle = ft.color;
      this.ctx.font = `bold ${ft.size}px ${ft.font}`;
      this.ctx.textAlign = 'center';
      this.ctx.globalAlpha = ft.life;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.globalAlpha = 1.0;
    });
  }

  renderPath() {
    const points = SECTORS[this.currentSectorId].pathPoints;
    
    // Draw thick glowing pipe line
    this.ctx.beginPath();
    const start = this.gridToCanvas(points[0].x, points[0].y);
    this.ctx.moveTo(start.x, start.y);
    for (let i = 1; i < points.length; i++) {
      const pt = this.gridToCanvas(points[i].x, points[i].y);
      this.ctx.lineTo(pt.x, pt.y);
    }
    
    // Outer tube glow
    this.ctx.strokeStyle = 'rgba(180, 0, 255, 0.08)';
    this.ctx.lineWidth = 32;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.12)';
    this.ctx.lineWidth = 20;
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(18, 11, 28, 0.9)';
    this.ctx.lineWidth = 14;
    this.ctx.stroke();

    // Core vector pipeline center
    this.ctx.strokeStyle = '#2a1a45';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw Gates
    const firstGate = this.gridToCanvas(points[0].x, points[0].y);
    this.ctx.fillStyle = '#ff0055';
    this.ctx.beginPath();
    this.ctx.arc(firstGate.x, firstGate.y, 8, 0, Math.PI*2);
    this.ctx.fill();

    const endGate = this.gridToCanvas(points[points.length-1].x, points[points.length-1].y);
    this.ctx.fillStyle = '#00ffaa';
    this.ctx.beginPath();
    this.ctx.arc(endGate.x, endGate.y, 10, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = '#00ffaa';
    this.ctx.fillStyle = 'rgba(0, 255, 170, 0.2)';
    this.ctx.arc(endGate.x, endGate.y, 18, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0; // reset
  }

  renderPlacementGrid() {
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        if (this.blockedGrid[x][y]) {
          // Blocked tile (Path)
          this.ctx.fillStyle = 'rgba(255, 0, 80, 0.08)';
          this.ctx.fillRect(x * 50, y * 50, 50, 50);
        } else {
          // Valid placement tile
          this.ctx.strokeRect(x * 50, y * 50, 50, 50);
        }
      }
    }
  }

  renderContinuousBeams() {
    // Draws stasis beam coolant lasers and Tesla chain lightning
    this.towers.forEach(t => {
      if (t.type === 'stasis' && t.activeBeamTarget) {
        const e = t.activeBeamTarget;
        const start = this.gridToCanvas(t.gridX, t.gridY);
        
        // Inner intense beam
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y - 4);
        this.ctx.lineTo(e.x, e.y);
        this.ctx.strokeStyle = '#39ff14';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Outer neon aura
        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
        this.ctx.lineWidth = 6;
        this.ctx.stroke();
      }
      
      if (t.type === 'tesla' && t.activeChainTargets && t.activeChainTargets.length > 0) {
        const start = this.gridToCanvas(t.gridX, t.gridY);
        let fromX = start.x;
        let fromY = start.y - 6;

        t.activeChainTargets.forEach(tgt => {
          // Chaining lightning bolts
          this.ctx.beginPath();
          this.ctx.moveTo(fromX, fromY);
          
          // Draw jagged lightning segments
          const segments = 4;
          const dx = tgt.x - fromX;
          const dy = tgt.y - fromY;
          for (let s = 1; s < segments; s++) {
            const ratio = s / segments;
            const targetX = fromX + dx * ratio + (Math.random() - 0.5) * 12;
            const targetY = fromY + dy * ratio + (Math.random() - 0.5) * 12;
            this.ctx.lineTo(targetX, targetY);
          }
          this.ctx.lineTo(tgt.x, tgt.y);
          
          this.ctx.strokeStyle = '#ffff66';
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
          
          this.ctx.strokeStyle = 'rgba(255,255,0,0.45)';
          this.ctx.lineWidth = 4.5;
          this.ctx.stroke();

          // Next chain links from target
          fromX = tgt.x;
          fromY = tgt.y;
        });
      }
    });
  }

  // ==========================================
  // EFFECT PARTICLE SYSTEMS
  // ==========================================
  createExplosion(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 80;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        0.4 + Math.random() * 0.4,
        2 + Math.random() * 3
      ));
    }
  }

  createFloatingText(text, x, y, color = '#ffffff', size = 12) {
    this.floatingTexts.push({
      text, x, y, color, size,
      font: varStyle('font-display', 'Orbitron'),
      life: 1.0,
      update: function(ft, dt) {
        ft.y -= 30 * dt; // float upwards
        ft.life -= 1.6 * dt; // fade out fast
      }
    });
  }

  // ==========================================
  // UPGRADES AND UI RENDERING
  // ==========================================
  renderPermanentUpgradesTab(type) {
    const list = UPGRADES_META[type] || [];
    const container = document.getElementById("upgrades-container");
    container.innerHTML = "";

    list.forEach(up => {
      const lv = this.permanentUpgrades[up.id] || 0;
      const maxLvl = up.maxLevel || (up.maxVal && up.maxVal > 1 ? up.maxVal : null);
      const isMax = maxLvl && lv >= maxLvl;
      
      let cost = 0;
      let isAffordable = false;
      let displayCost = "";
      
      if (type === 'quantum') {
        cost = isMax ? 0 : up.baseCosts[lv];
        displayCost = isMax ? "MAX PROTOCOL" : `${cost} 💠`;
        isAffordable = this.quantumCrystals >= cost;
      } else {
        cost = Math.round(up.baseCost * Math.pow(up.costScale, lv));
        displayCost = isMax ? "MAX PROTOCOL" : `${cost} ₡`;
        isAffordable = this.coins >= cost;
      }
      
      // Calculate current and next impact display
      let currentVal = "0%";
      let nextVal = "";
      
      if (type === 'quantum') {
        const sign = (up.stat === 'cost_red' || up.stat === 'enemy_hp') ? '-' : '+';
        currentVal = `${sign}${Math.round(lv * up.scale * 100)}%`;
        nextVal = isMax ? "" : `→ ${sign}${Math.round((lv + 1) * up.scale * 100)}%`;
      } else if (up.stat === 'slow') {
        const baseSlow = TOWER_METADATA[type].slowEffect;
        currentVal = `${Math.round(baseSlow * 100)}%`;
        nextVal = isMax ? "" : `→ ${Math.round((baseSlow + (lv + 1) * up.scale) * 100)}%`;
      } else if (up.stat === 'targets') {
        currentVal = `${TOWER_METADATA[type].maxTargets}`;
        nextVal = isMax ? "" : `→ ${TOWER_METADATA[type].maxTargets + (lv+1)}`;
      } else if (up.id === 'def_shield_max') {
        currentVal = `${lv * 10} pts`;
        nextVal = isMax ? "" : `→ ${(lv + 1) * 10} pts`;
      } else if (up.id === 'def_shield_regen') {
        currentVal = `+${(lv * 0.2).toFixed(1)}/s`;
        nextVal = isMax ? "" : `→ +${((lv + 1) * 0.2).toFixed(1)}/s`;
      } else if (up.id === 'def_pct') {
        currentVal = `-${Math.round(lv * 3)}%`;
        nextVal = isMax ? "" : `→ -${Math.round((lv + 1) * 3)}%`;
      } else if (up.id === 'att_crit_mult') {
        currentVal = `${(2.2 + lv * 0.3).toFixed(1)}x`;
        nextVal = isMax ? "" : `→ ${(2.2 + (lv + 1) * 0.3).toFixed(1)}x`;
      } else if (up.id === 'ut_interest') {
        currentVal = `+${Math.round(lv * 5)}% (Max ${lv * 15}₡)`;
        nextVal = isMax ? "" : `→ +${Math.round((lv + 1) * 5)}% (Max ${(lv + 1) * 15}₡)`;
      } else if (up.id === 'ut_credits_kill') {
        currentVal = `+${lv}₡`;
        nextVal = isMax ? "" : `→ +${lv + 1}₡`;
      } else if (up.id === 'ut_refund') {
        currentVal = `${Math.round((0.70 + lv * 0.10) * 100)}%`;
        nextVal = isMax ? "" : `→ ${Math.round((0.70 + (lv + 1) * 0.10) * 100)}%`;
      } else if (up.id === 'att_knockback') {
        currentVal = lv === 0 ? "LOCKED" : `+${Math.round(lv * up.scale * 100)}%`;
        nextVal = isMax ? "" : `→ +${Math.round((lv + 1) * up.scale * 100)}%`;
      } else {
        currentVal = `+${Math.round(lv * up.scale * 100)}%`;
        nextVal = isMax ? "" : `→ +${Math.round((lv + 1) * up.scale * 100)}%`;
      }

      const card = document.createElement("div");
      card.className = "upgrade-item";
      
      // Determine max level display text or infinite indicator (∞)
      const maxLvlText = maxLvl ? `${maxLvl}` : "∞";

      card.innerHTML = `
        <div class="upgrade-title-row">
          <h5>${up.name}</h5>
          <span class="upgrade-level">LVL ${lv} / ${maxLvlText}</span>
        </div>
        <p class="upgrade-desc">${up.desc}</p>
        <div class="upgrade-btn-row">
          <span class="upgrade-effect">Current: <strong>${currentVal}</strong> ${nextVal}</span>
          <button class="cyber-btn success mini purchase-up-btn" data-id="${up.id}" ${isMax || !isAffordable ? 'disabled' : ''}>
            ${displayCost}
          </button>
        </div>
      `;

      // Bind click
      const btn = card.querySelector(".purchase-up-btn");
      btn.addEventListener("click", () => {
        if (isAffordable && !isMax) {
          if (type === 'quantum') {
            this.quantumCrystals -= cost;
          } else {
            this.spendCoins(cost);
          }
          this.permanentUpgrades[up.id] = lv + 1;
          Audio.playCoin();
          
          // Instant shield capacity booster
          if (up.id === 'def_shield_max') {
            const maxShieldVal = (lv + 1) * 10;
            if (this.coreShield === undefined) this.coreShield = 0;
            this.coreShield = Math.min(maxShieldVal, this.coreShield + 10);
          }
          
          // Re-apply upgrades immediately to current placing towers
          this.towers.forEach(t => {
            t.stats = this.getTowerUpgradedStats(t.type);
          });

          this.renderPermanentUpgradesTab(type);
          this.saveGame();
          this.updateUI();
        }
      });

      container.appendChild(card);
    });
  }

  renderSectorsList() {
    const container = document.getElementById("sectors-container");
    container.innerHTML = "";

    SECTORS.forEach(sec => {
      const isLocked = sec.id > this.unlockedSectorMax;
      const isCurrent = sec.id === this.currentSectorId;
      
      const maxCompletedTier = this.completedSectorTiers[sec.id] || 0;
      const selectedTier = this.selectedSectorTiers[sec.id] || 1;
      const tierMult = TIER_MULTIPLIERS[selectedTier] || TIER_MULTIPLIERS[1];
      const isCompleted = maxCompletedTier >= 1;
      
      let statusClass = "locked-tag";
      let statusText = "LOCKED";
      
      if (isCurrent) {
        statusClass = "active-tag";
        statusText = `TIER ${selectedTier} DEPLOYED`;
      } else if (isCompleted) {
        statusClass = "clear-tag";
        statusText = `SECURED (MAX T${maxCompletedTier})`;
      } else if (!isLocked) {
        statusClass = "active-tag";
        statusText = "UNLOCKED";
      }

      const card = document.createElement("div");
      card.className = `sector-card ${isLocked ? 'locked' : ''} ${isCurrent ? 'active-map' : ''} ${isCompleted ? 'completed' : ''}`;
      
      const recordWave = this.sectorHighWaves[sec.id] || 0;

      // Tier Selector HTML
      let tierSelectorHtml = "";
      if (!isLocked) {
        tierSelectorHtml = `
          <div class="tier-selector-row" style="margin-top: 8px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 3px;">
            <span style="font-size: 0.62rem; font-family: var(--font-display); color: var(--text-muted); letter-spacing: 0.5px;">DIFFICULTY TIER:</span>
            <div class="tier-buttons" style="display: flex; gap: 3px; background: var(--bg-input); border: 1px solid hsl(240, 10%, 18%); border-radius: 4px; padding: 2px;">
        `;
        for (let t = 1; t <= 5; t++) {
          const isTierUnlocked = (t === 1 || maxCompletedTier >= t - 1);
          const isSelected = (t === selectedTier);
          tierSelectorHtml += `
            <button class="cyber-btn mini tier-btn ${isSelected ? 'active' : ''}" 
                    data-sector-id="${sec.id}" 
                    data-tier="${t}" 
                    ${!isTierUnlocked ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} 
                    style="flex: 1; padding: 3px 0; font-size: 0.65rem; font-family: var(--font-display);">
              T${t}
            </button>
          `;
        }
        tierSelectorHtml += `
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="sector-header">
          <h4>${sec.name}</h4>
          <span class="sector-status ${statusClass}">${statusText}</span>
        </div>
        <p class="sector-desc">${sec.description}</p>
        ${tierSelectorHtml}
        <div class="sector-meta">
          <ul class="sector-stats-list">
            <li>Multiplier: <strong>${(sec.multiplier * tierMult.credits).toFixed(1)}x Credits</strong></li>
            <li>HP Scale: <strong>${tierMult.hp}x</strong> | Speed: <strong>${(1.0 + (selectedTier - 1) * 0.15).toFixed(2)}x</strong></li>
            <li>Simulation Target: <strong>Wave ${sec.maxWaves}</strong></li>
            <li>Record: <strong>Wave ${recordWave}</strong></li>
          </ul>
          <button class="cyber-btn mini sector-deploy-btn" ${isLocked || isCurrent ? 'disabled' : ''}>
            DEPLOY
          </button>
        </div>
      `;

      if (!isLocked && !isCurrent) {
        card.querySelector(".sector-deploy-btn").addEventListener("click", () => {
          if (confirm(`Deploy core network grid to ${sec.name}? Placed towers on this current sector will be fully dismantled for a 100% credit refund!`)) {
            this.loadSector(sec.id, true);
          }
        });
      }

      // Bind Tier click events
      if (!isLocked) {
        card.querySelectorAll(".tier-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const sectorId = parseInt(btn.dataset.sectorId);
            const tier = parseInt(btn.dataset.tier);
            
            if (this.selectedSectorTiers[sectorId] === tier) return;
            
            if (sectorId === this.currentSectorId && this.waveRunning) {
              if (confirm("Change active sector grid to this difficulty tier? This will reboot the current wave! Placed towers will be preserved.")) {
                this.selectedSectorTiers[sectorId] = tier;
                this.rebootWave();
              }
            } else {
              this.selectedSectorTiers[sectorId] = tier;
              this.renderSectorsList();
              this.saveGame();
              this.updateUI();
            }
          });
        });
      }

      container.appendChild(card);
    });
  }

  renderModulesDeck() {
    const slotsContainer = document.getElementById("modules-deck-slots");
    const inventoryContainer = document.getElementById("modules-inventory-container");
    if (!slotsContainer || !inventoryContainer) return;

    slotsContainer.innerHTML = "";
    inventoryContainer.innerHTML = "";

    const totalSlots = 3;
    
    for (let i = 0; i < totalSlots; i++) {
      let isLocked = false;
      let lockReason = "";
      if (i === 1 && this.unlockedSectorMax < 1 && this.quantumCrystals < 2) {
        isLocked = true;
        lockReason = "Req: Sector 2 OR 2 💠";
      } else if (i === 2 && this.unlockedSectorMax < 2 && this.quantumCrystals < 5) {
        isLocked = true;
        lockReason = "Req: Sector 3 OR 5 💠";
      }

      const slotCard = document.createElement("div");
      slotCard.className = `deck-slot ${isLocked ? 'locked' : ''}`;
      
      if (isLocked) {
        slotCard.innerHTML = `
          <span class="slot-label">SLOT ${i+1}</span>
          <h6 style="color: var(--red); font-size: 0.6rem;">${lockReason}</h6>
        `;
      } else {
        const activeModuleId = this.equippedModules[i];
        if (activeModuleId) {
          const modMeta = MODULES_REGISTRY.find(m => m.id === activeModuleId);
          slotCard.classList.add("active-card");
          slotCard.innerHTML = `
            <span class="slot-label" style="color: var(--accent);">SLOT ${i+1}</span>
            <h6>${modMeta ? modMeta.name.toUpperCase() : "EQUIPPED"}</h6>
            <span style="font-size: 0.55rem; color: var(--text-muted); cursor: pointer; text-decoration: underline; margin-top: 2px;">UNEQUIP</span>
          `;
          slotCard.addEventListener("click", () => {
            this.equippedModules[i] = null;
            this.renderModulesDeck();
            this.updateUI();
            this.saveGame();
            Audio.playCoin();
          });
        } else {
          slotCard.innerHTML = `
            <span class="slot-label">SLOT ${i+1}</span>
            <h6 style="color: var(--text-muted);">EMPTY SLOT</h6>
          `;
        }
      }
      slotsContainer.appendChild(slotCard);
    }

    MODULES_REGISTRY.forEach(mod => {
      const isEquipped = this.equippedModules.includes(mod.id);
      const invCard = document.createElement("div");
      invCard.className = `module-card ${isEquipped ? 'equipped' : ''}`;
      invCard.innerHTML = `
        <h5>${mod.name.toUpperCase()}</h5>
        <p>${mod.desc}</p>
        ${isEquipped ? '<span style="font-size: 0.6rem; color: var(--accent); font-weight: bold; position: absolute; top: 10px; right: 10px;">ACTIVE</span>' : ''}
      `;

      if (!isEquipped) {
        invCard.addEventListener("click", () => {
          let slotIndex = -1;
          for (let i = 0; i < totalSlots; i++) {
            let isLocked = false;
            if (i === 1 && this.unlockedSectorMax < 1 && this.quantumCrystals < 2) isLocked = true;
            else if (i === 2 && this.unlockedSectorMax < 2 && this.quantumCrystals < 5) isLocked = true;

            if (!isLocked && !this.equippedModules[i]) {
              slotIndex = i;
              break;
            }
          }

          if (slotIndex !== -1) {
            this.equippedModules[slotIndex] = mod.id;
            this.renderModulesDeck();
            this.updateUI();
            this.saveGame();
            Audio.playCoin();
          } else {
            this.createFloatingText("NO UNLOCKED EMPTY DECK SLOTS", 400, 250, '#ff0055', 18);
          }
        });
      }
      inventoryContainer.appendChild(invCard);
    });
  }

  renderDossier() {
    const container = document.getElementById("dossier-container");
    if (!container) return;
    container.innerHTML = "";

    const threats = [
      {
        type: 'normal',
        name: "NORMAL CORRUPTED",
        color: '#e0115f',
        desc: "Standard decentralized network infection. Uses basic structural vectors to assault the core.",
        hp: 18,
        speed: 1.35,
        reward: 4
      },
      {
        type: 'fast',
        name: "FAST RUNNER",
        color: '#00f6ff',
        desc: "Highly optimized speed-oriented vector packet. Initiates high-velocity dashes that leave dynamic visual trails.",
        hp: 8,
        speed: 2.4,
        reward: 3
      },
      {
        type: 'flyer',
        name: "AIRBORNE CORRUPTOR",
        color: '#da00ff',
        desc: "Sleek aerodynamic vector packet that bypasses ground paths entirely, flying directly from spawn grid to core gate.",
        hp: 13,
        speed: 1.6,
        reward: 5
      },
      {
        type: 'tank',
        name: "HEAVY TANK",
        color: '#ff9900',
        desc: "Reinforced sub-neural threat structure. Boasts a massive health capacity, subatomic shields, and active self-regeneration cycles.",
        hp: 58,
        speed: 0.7,
        reward: 9
      },
      {
        type: 'boss',
        name: "SECTOR DESTRUCTOR",
        color: '#b026ff',
        desc: "Alpha class grid corruptor appearing at final wave checkpoints. Employs massive physical vector models and active subatomic orbit shields.",
        hp: 153,
        speed: 0.55,
        reward: 40
      }
    ];

    if (!this.stats.enemyKills) {
      this.stats.enemyKills = { normal: 0, fast: 0, flyer: 0, tank: 0, boss: 0 };
    }

    threats.forEach(t => {
      const kills = this.stats.enemyKills[t.type] || 0;
      const card = document.createElement("div");
      card.className = `dossier-card ${t.type}`;
      card.innerHTML = `
        <canvas class="dossier-preview-canvas" id="dossier-preview-${t.type}" width="54" height="54"></canvas>
        <div class="dossier-details">
          <div class="dossier-title-row">
            <h4>${t.name}</h4>
          </div>
          <p class="dossier-desc">${t.desc}</p>
          <div class="dossier-stats">
            <span>Base HP: <strong>${t.hp}</strong></span>
            <span>Speed: <strong>${(t.speed * 60).toFixed(0)}m/s</strong></span>
            <span>Reward: <strong>${t.reward}₡</strong></span>
            <span>Killed: <strong style="color: var(--yellow);">${kills.toLocaleString()}</strong></span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  drawDossierPreviews() {
    const tab = document.getElementById("tab-dossier");
    if (!tab || !tab.classList.contains("active")) return;

    const angle = Date.now() / 1200;

    const shapes = [
      { type: 'normal', color: '#e0115f', draw: (ctx) => {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = angle + (i * Math.PI * 2) / 3;
          ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
        }
        ctx.closePath();
        ctx.fill();
      }},
      { type: 'fast', color: '#00f6ff', draw: (ctx) => {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = angle + (i * Math.PI) / 2;
          ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
        }
        ctx.closePath();
        ctx.fill();
      }},
      { type: 'flyer', color: '#da00ff', draw: (ctx) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 13, Math.sin(angle) * 13);
        ctx.lineTo(Math.cos(angle + Math.PI * 0.7) * 13, Math.sin(angle + Math.PI * 0.7) * 13);
        ctx.lineTo(Math.cos(angle + Math.PI) * 5, Math.sin(angle + Math.PI) * 5);
        ctx.lineTo(Math.cos(angle + Math.PI * 1.3) * 13, Math.sin(angle + Math.PI * 1.3) * 13);
        ctx.closePath();
        ctx.fill();
      }},
      { type: 'tank', color: '#ff9900', draw: (ctx) => {
        ctx.beginPath();
        ctx.rect(-10, -10, 20, 20);
        ctx.fill();
      }},
      { type: 'boss', color: '#b026ff', draw: (ctx) => {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = angle + (i * Math.PI) / 4;
          ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00f6ff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();
      }}
    ];

    shapes.forEach(s => {
      const canvas = document.getElementById(`dossier-preview-${s.type}`);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = s.color;

      if (s.type === 'tank') {
        ctx.rotate(angle);
      }

      s.draw(ctx);
      ctx.restore();
    });
  }

  drawOscilloscope() {
    const canvas = document.getElementById("synth-visualizer");
    if (!canvas || !Audio.analyser) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Get time domain data from analyser
    Audio.analyser.getByteTimeDomainData(Audio.dataArray);

    ctx.fillStyle = '#06050b';
    ctx.fillRect(0, 0, width, height);

    // Draw grid horizontal center line
    ctx.strokeStyle = 'rgba(0, 255, 170, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    const sliceWidth = width * 1.0 / Audio.bufferLength;
    let x = 0;

    for (let i = 0; i < Audio.bufferLength; i++) {
      const v = Audio.dataArray[i] / 128.0;
      const y = v * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = '#39ff14'; // Neon Green
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  updateUI() {
    // Softlock protection check: If player has no towers and cannot afford a basic Pulse Laser (50 credits),
    // automatically grant them enough credits to place one.
    if (this.towers.length === 0 && this.coins < 50) {
      this.coins = 50;
      this.saveGame();
    }

    document.getElementById("coins-val").innerText = Math.round(this.coins);
    const crystalsEl = document.getElementById("crystals-val");
    if (crystalsEl) {
      crystalsEl.innerText = this.quantumCrystals.toLocaleString();
    }
    
    const mapMeta = SECTORS[this.currentSectorId];
    document.getElementById("map-name-val").innerText = mapMeta.name;
    const activeAndRemaining = this.enemies.length + this.enemiesRemainingToSpawn;
    const waveText = this.waveRunning
      ? `${this.currentWave}/${mapMeta.maxWaves} (${activeAndRemaining} Left)`
      : `${this.currentWave}/${mapMeta.maxWaves} (Ready)`;
    document.getElementById("wave-val").innerText = waveText;

    // Base Health Fill percentage
    const hpPct = (this.baseHealth / this.maxBaseHealth) * 100;
    const hpFill = document.getElementById("core-health-fill");
    hpFill.style.width = `${hpPct}%`;
    
    // Core integrity indicator alerts
    if (hpPct < 30) {
      hpFill.style.background = 'linear-gradient(90deg, #ff0000, #ff0055)';
    } else {
      hpFill.style.background = 'linear-gradient(90deg, #00ffaa, #39ff14)';
    }

    // Shield HUD rendering
    const shieldMaxLvl = this.permanentUpgrades['def_shield_max'] || 0;
    const shieldContainerHud = document.getElementById("shield-container-hud");
    if (shieldMaxLvl >= 1) {
      shieldContainerHud.style.display = "block";
      const maxShieldVal = shieldMaxLvl * 10;
      const shieldPct = Math.min(100, Math.max(0, (this.coreShield / maxShieldVal) * 100));
      document.getElementById("core-shield-fill").style.width = `${shieldPct}%`;
      document.getElementById("core-health-val").innerText = `HP: ${this.baseHealth}/${this.maxBaseHealth} (+${Math.round(this.coreShield)} SHIELD)`;
    } else {
      shieldContainerHud.style.display = "none";
      document.getElementById("core-health-val").innerText = `${this.baseHealth}/${this.maxBaseHealth}`;
    }

    // Context Inspector Display
    const inspector = document.getElementById("inspector-panel");
    if (this.selectedPlacedTower) {
      inspector.classList.remove("hidden-panel");
      
      const t = this.selectedPlacedTower;
      document.getElementById("inspect-title").innerText = TOWER_METADATA[t.type].name.toUpperCase();
      document.getElementById("inspect-level").innerText = t.level;
      
      // Calculate display stats
      const rateSec = t.stats.baseRate.toFixed(1);
      const splashTxt = t.type === 'plasma' ? ` (${t.stats.splashRadius}m)` : '';

      document.getElementById("inspect-damage").innerText = Math.round(t.getCurrentDamage()) + (t.type === 'stasis' ? '/s' : '');
      document.getElementById("inspect-rate").innerText = `${rateSec}/s`;
      document.getElementById("inspect-range").innerText = `${Math.round(t.stats.baseRange)}m${splashTxt}`;
      document.getElementById("inspect-total-dmg").innerText = Math.round(t.damageDealt).toLocaleString();

      // Targeting specialties display
      let targetsTxt = "ALL-ROUND";
      let targetsColor = "#00ffff";
      if (t.type === 'plasma' || t.type === 'stasis') {
        targetsTxt = "GROUND";
        targetsColor = t.type === 'plasma' ? "#ff007f" : "#39ff14";
      } else if (t.type === 'tesla') {
        targetsTxt = "AIR ONLY";
        targetsColor = "#ffff00";
      }
      const targetsEl = document.getElementById("inspect-targets");
      if (targetsEl) {
        targetsEl.innerText = targetsTxt;
        targetsEl.style.color = targetsColor;
        targetsEl.style.textShadow = `0 0 4px ${targetsColor}`;
      }
      
      const refund = t.getTotalValue();
      document.getElementById("inspect-refund").innerText = refund;

      const upCost = t.getUpgradeCost();
      const upBtn = document.getElementById("inspect-upgrade-btn");
      document.getElementById("inspect-upgrade-cost").innerText = upCost;
      if (this.coins < upCost) {
        upBtn.setAttribute("disabled", "true");
      } else {
        upBtn.removeAttribute("disabled");
      }

      // Update active targeting priority button highlights
      document.querySelectorAll(".target-priority-btn").forEach(btn => {
        if (btn.dataset.priority === t.targeting) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } else {
      inspector.classList.add("hidden-panel");
    }

    // Disable purchase buttons in tower shop if cannot afford
    document.querySelectorAll(".shop-card").forEach(card => {
      const type = card.dataset.tower;
      const meta = TOWER_METADATA[type];
      
      // Update display pricing stats dynamically
      const activeStats = this.getTowerUpgradedStats(type);
      const constructCost = this.getConstructCost(type);
      document.getElementById(`price-${type}`).innerText = `${constructCost} ₡`;
      
      if (type === 'stasis') {
        document.getElementById(`dps-${type}`).innerText = `${Math.round(activeStats.slowEffect * 100)}% Slow`;
      } else if (type === 'tesla') {
        const dps = ((activeStats.baseDamage * activeStats.baseRate)).toFixed(0);
        document.getElementById(`dps-${type}`).innerText = `${dps}`;
      } else {
        const dps = ((activeStats.baseDamage * activeStats.baseRate)).toFixed(0);
        document.getElementById(`dps-${type}`).innerText = `${dps}`;
      }
      document.getElementById(`range-${type}`).innerText = `${Math.round(activeStats.baseRange)}m`;

      if (this.coins < constructCost) {
        card.classList.add("disabled");
      } else {
        card.classList.remove("disabled");
      }
    });

    // Update global statistics page stats
    document.getElementById("stat-total-kills").innerText = this.stats.totalKills.toLocaleString();
    document.getElementById("stat-total-coins").innerText = this.stats.totalCoinsEarned.toLocaleString();
    document.getElementById("stat-maps-cleared").innerText = this.stats.mapsCleared;
    document.getElementById("stat-total-placed").innerText = this.stats.towersPlaced;
    document.getElementById("stat-total-runs").innerText = this.stats.totalRuns;

    // Update prestige stats
    const pendingCrystals = this.calculateCrystalsPending();
    document.getElementById("prestige-crystals-val").innerText = this.quantumCrystals.toLocaleString();
    document.getElementById("prestige-mult-val").innerText = `+${(this.quantumCrystals * 3).toFixed(0)}% Credits`;
    document.getElementById("prestige-award-val").innerText = pendingCrystals.toLocaleString();
    
    const prestigeBtn = document.getElementById("prestige-btn");
    if (pendingCrystals > 0) {
      prestigeBtn.removeAttribute("disabled");
      prestigeBtn.classList.add("pulse");
    } else {
      prestigeBtn.setAttribute("disabled", "true");
      prestigeBtn.classList.remove("pulse");
    }

    // Refresh active Operator Skills Cooldown tags
    const lightningBtn = document.getElementById("skill-lightning-btn");
    const lightningTag = document.getElementById("lightning-cd-tag");
    if (this.lightningCooldown > 0) {
      lightningBtn.classList.add("active-cooldown");
      lightningTag.innerText = `${Math.ceil(this.lightningCooldown)}s`;
    } else {
      lightningBtn.classList.remove("active-cooldown");
      lightningTag.innerText = "READY";
    }

    const shieldBtn = document.getElementById("skill-shield-btn");
    const shieldTag = document.getElementById("shield-cd-tag");
    if (this.shieldCooldown > 0) {
      shieldBtn.classList.add("active-cooldown");
      shieldTag.innerText = `${Math.ceil(this.shieldCooldown)}s`;
    } else {
      shieldBtn.classList.remove("active-cooldown");
      shieldTag.innerText = "READY";
    }

    // Tachyon Overdrive game speeds
    const hasTachyon = this.equippedModules.includes('tachyon');
    const selectors = document.querySelector(".speed-selectors");
    if (selectors) {
      const currentSpeed = this.speedMultiplier;
      let html = `
        <button class="speed-btn ${currentSpeed === 1 ? 'active' : ''}" data-speed="1">1x</button>
        <button class="speed-btn ${currentSpeed === 2 ? 'active' : ''}" data-speed="2">2x</button>
        <button class="speed-btn ${currentSpeed === 4 ? 'active' : ''}" data-speed="4">4x</button>
      `;
      if (hasTachyon) {
        html += `
          <button class="speed-btn ${currentSpeed === 6 ? 'active' : ''}" data-speed="6" style="color: var(--accent); text-shadow: 0 0 6px var(--accent);">6x</button>
          <button class="speed-btn ${currentSpeed === 8 ? 'active' : ''}" data-speed="8" style="color: var(--accent); text-shadow: 0 0 6px var(--accent);">8x</button>
        `;
      } else {
        if (this.speedMultiplier > 4) {
          this.speedMultiplier = 4;
          html = `
            <button class="speed-btn" data-speed="1">1x</button>
            <button class="speed-btn" data-speed="2">2x</button>
            <button class="speed-btn active" data-speed="4">4x</button>
          `;
        }
      }
      selectors.innerHTML = html;
    }

    // Dynamic refresh of upgrades tab if active and open (without DOM recreation to prevent flickering)
    const upgradesTab = document.getElementById("tab-upgrades");
    if (upgradesTab && upgradesTab.classList.contains("active")) {
      document.querySelectorAll(".purchase-up-btn").forEach(btn => {
        const upId = btn.dataset.id;
        let foundUp = null;
        let foundType = null;
        
        for (const type in UPGRADES_META) {
          const up = UPGRADES_META[type].find(u => u.id === upId);
          if (up) {
            foundUp = up;
            foundType = type;
            break;
          }
        }
        
        if (foundUp) {
          const lv = this.permanentUpgrades[upId] || 0;
          const maxLvl = foundUp.maxLevel || (foundUp.maxVal && foundUp.maxVal > 1 ? foundUp.maxVal : null);
          const isMax = maxLvl && lv >= maxLvl;
          
          let cost = 0;
          let isAffordable = false;
          
          if (foundType === 'quantum') {
            cost = isMax ? 0 : foundUp.baseCosts[lv];
            isAffordable = this.quantumCrystals >= cost;
          } else {
            cost = Math.round(foundUp.baseCost * Math.pow(foundUp.costScale, lv));
            isAffordable = this.coins >= cost;
          }
          
          if (isMax || !isAffordable) {
            btn.setAttribute("disabled", "true");
          } else {
            btn.removeAttribute("disabled");
          }
        }
      });
    }

    this.updateAnalytics();
  }

  updateAnalytics() {
    const activeTab = document.querySelector(".tab-btn.active");
    if (!activeTab || activeTab.dataset.tab !== 'build') return;

    let total = 0;
    const damages = { pulse: 0, plasma: 0, stasis: 0, tesla: 0 };
    
    this.towers.forEach(t => {
      if (damages[t.type] !== undefined) {
        damages[t.type] += t.damageDealt;
      }
    });

    total = damages.pulse + damages.plasma + damages.stasis + damages.tesla;

    const meters = {
      pulse: document.getElementById("meter-pulse"),
      plasma: document.getElementById("meter-plasma"),
      stasis: document.getElementById("meter-stasis"),
      tesla: document.getElementById("meter-tesla")
    };
    
    const vals = {
      pulse: document.getElementById("val-pulse"),
      plasma: document.getElementById("val-plasma"),
      stasis: document.getElementById("val-stasis"),
      tesla: document.getElementById("val-tesla")
    };

    if (total === 0) {
      const types = ['pulse', 'plasma', 'stasis', 'tesla'];
      types.forEach(type => {
        if (meters[type]) meters[type].style.width = '25%';
        if (vals[type]) vals[type].innerText = '25%';
      });
      return;
    }

    const types = ['pulse', 'plasma', 'stasis', 'tesla'];
    types.forEach(type => {
      const pct = (damages[type] / total) * 100;
      if (meters[type]) meters[type].style.width = `${pct}%`;
      if (vals[type]) vals[type].innerText = `${Math.round(pct)}%`;
    });
  }
}

// Helper: retrieve css styling configuration values
function varStyle(varName, fallback) {
  const root = document.querySelector(':root');
  if (root) {
    const val = getComputedStyle(root).getPropertyValue('--' + varName);
    return val ? val.trim() : fallback;
  }
  return fallback;
}

// ==========================================
// 5. ENEMY & COMBAT VEHICLE CLASS
// ==========================================
class Enemy {
  constructor(type, health, maxHealth, speed, color, size, reward, pathCoordinates) {
    this.type = type;
    this.health = health;
    this.maxHealth = maxHealth;
    this.baseSpeed = speed;
    this.color = color;
    this.size = size;
    this.coinReward = reward;
    this.path = pathCoordinates;
    this.isFlying = (type === 'flyer');

    // Movement progress
    this.pathIndex = 0;
    if (this.path.length > 0) {
      this.x = this.path[0].x;
      this.y = this.path[0].y;
    } else {
      this.x = 0;
      this.y = 0;
    }

    this.reachedEnd = false;
    
    // Status effects
    this.slowTimer = 0;
    this.slowMultiplier = 1.0;

    // Advanced capabilities
    this.shield = 0;
    this.maxShield = 0;
    this.regen = 0;
    this.dashCooldown = 0;
    this.dashDuration = 0;
    this.trail = []; // for runner visual trail

    if (this.type === 'boss') {
      this.shield = Math.round(this.maxHealth * 0.35); // 35% HP shield
      this.maxShield = this.shield;
    } else if (this.type === 'tank') {
      this.regen = this.maxHealth * 0.015; // 1.5% HP regen per second
      this.shield = Math.round(this.maxHealth * 0.15); // 15% HP shield
      this.maxShield = this.shield;
    } else if (this.type === 'fast') {
      this.dashCooldown = 1.5 + Math.random() * 3.0; // quick initial dash cooldown
    }
  }

  applySlow(mult, duration) {
    if (mult < this.slowMultiplier || this.slowTimer <= 0) {
      this.slowMultiplier = mult;
    }
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  applyKnockback(amount) {
    const kbLevel = window.Game.permanentUpgrades['att_knockback'] || 0;
    if (kbLevel <= 0) return; // Locked by default

    let finalAmount = amount * (kbLevel * 0.15);
    if (this.type === 'boss') {
      finalAmount *= 0.2;
    } else if (this.type === 'tank') {
      finalAmount *= 0.5;
    }
    this.pathIndex = Math.max(0, this.pathIndex - finalAmount);
    
    if (this.isFlying) {
      const spawn = this.path[0];
      const end = this.path[this.path.length - 1];
      const progress = Math.min(1.0, this.pathIndex / this.path.length);
      if (spawn && end) {
        this.x = spawn.x + (end.x - spawn.x) * progress;
        this.y = spawn.y + (end.y - spawn.y) * progress;
      }
    } else {
      let idx = Math.floor(this.pathIndex);
      if (idx >= this.path.length) idx = this.path.length - 1;
      const pos = this.path[idx];
      if (pos) {
        this.x = pos.x;
        this.y = pos.y;
      }
    }
  }

  update(dt) {
    // 1. Slow logic
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowMultiplier = 1.0;
      }
    }

    // 2. Self Healing (Regen) for Tank units
    if (this.regen > 0 && this.health < this.maxHealth && this.health > 0) {
      this.health = Math.min(this.maxHealth, this.health + this.regen * dt);
      if (Math.random() < 0.08) {
        window.Game.createExplosion(this.x, this.y, '#39ff14', 1);
      }
    }

    // 3. Speed dashes for Fast units
    let speedScale = 1.0;
    if (this.type === 'fast') {
      if (this.dashDuration > 0) {
        this.dashDuration -= dt;
        speedScale = 1.70; // +70% speed boost
        
        // Push trail positions
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 5) this.trail.shift();
      } else {
        this.dashCooldown -= dt;
        if (this.dashCooldown <= 0 && !this.reachedEnd) {
          this.dashDuration = 0.8; // 800ms dash
          this.dashCooldown = 4.5 + Math.random() * 2.5;
          window.Game.createExplosion(this.x, this.y, this.color, 4);
        }
        if (this.trail.length > 0) this.trail.shift();
      }
    }

    // 4. Movement
    const currentSpeed = this.baseSpeed * 60 * this.slowMultiplier * speedScale * dt;
    this.pathIndex += currentSpeed;

    if (this.isFlying) {
      // Interpolate straight line from spawn path point to final core gate
      const spawn = this.path[0];
      const end = this.path[this.path.length - 1];
      const progress = Math.min(1.0, this.pathIndex / this.path.length);
      
      if (spawn && end) {
        this.x = spawn.x + (end.x - spawn.x) * progress;
        this.y = spawn.y + (end.y - spawn.y) * progress;
      }
      
      if (progress >= 1.0) {
        this.reachedEnd = true;
      }
    } else {
      // Ground movement path index steps
      let idx = Math.floor(this.pathIndex);
      if (idx >= this.path.length) {
        idx = this.path.length - 1;
        this.pathIndex = idx;
        this.reachedEnd = true;
      }

      const pos = this.path[idx];
      if (pos) {
        this.x = pos.x;
        this.y = pos.y;
      }
    }
  }

  takeDamage(amount, isCrit = false, dmgDealerTower = null) {
    let damageToHealth = amount;
    
    // Shield absorb
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, amount);
      this.shield -= absorbed;
      damageToHealth -= absorbed;
      
      if (dmgDealerTower) {
        dmgDealerTower.damageDealt += absorbed;
      }
      
      window.Game.createExplosion(this.x, this.y, '#00ffff', 3);
      
      const displayShieldDmg = Math.round(absorbed);
      if (displayShieldDmg > 0) {
        window.Game.createFloatingText(displayShieldDmg, this.x + (Math.random()-0.5)*15, this.y - 12, '#00ffff', isCrit ? 13 : 10);
      }
      
      if (this.shield <= 0) {
        window.Game.createExplosion(this.x, this.y, '#00f6ff', 8);
        window.Game.createFloatingText("SHIELD BROKEN", this.x, this.y - 20, '#00f6ff', 11);
      }
    }

    // Remaining damage to HP
    if (damageToHealth > 0) {
      this.health = Math.max(0, this.health - damageToHealth);
      if (dmgDealerTower) {
        dmgDealerTower.damageDealt += Math.min(this.health + damageToHealth, damageToHealth);
      }
      
      const displayDmg = Math.round(damageToHealth);
      if (displayDmg > 0) {
        window.Game.createFloatingText(displayDmg, this.x + (Math.random()-0.5)*15, this.y - 12, isCrit ? '#ffff00' : '#ffffff', isCrit ? 14 : 11);
      }
    }

    if (this.health <= 0) {
      const extraCreditsLvl = window.Game.permanentUpgrades['ut_credits_kill'] || 0;
      let finalReward = this.coinReward + extraCreditsLvl;
      let displayMsg = `+${finalReward}₡`;
      let isDouble = false;
      if (isCrit && window.Game.equippedModules.includes('harvester') && Math.random() < 0.10) {
        finalReward *= 2;
        displayMsg = `DOUBLE! +${finalReward}₡`;
        isDouble = true;
      }
      window.Game.earnCoins(finalReward);
      window.Game.stats.totalKills++;
      
      if (!window.Game.stats.enemyKills) {
        window.Game.stats.enemyKills = { normal: 0, fast: 0, tank: 0, boss: 0 };
      }
      window.Game.stats.enemyKills[this.type] = (window.Game.stats.enemyKills[this.type] || 0) + 1;

      window.Game.createFloatingText(displayMsg, this.x, this.y - 8, isDouble ? '#ffff00' : '#ffcc00', 14);
      Audio.playCoin();
      window.Game.createExplosion(this.x, this.y, this.color, 12);
    } else {
      Audio.playHit();
    }
  }

  draw(ctx) {
    // Draw trail for runner dashes
    if (this.type === 'fast' && this.trail.length > 1) {
      ctx.save();
      ctx.lineWidth = 2.5;
      for (let i = 0; i < this.trail.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(this.trail[i].x, this.trail[i].y);
        ctx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.08 * (i + 1);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    if (this.isFlying) {
      // Sleek aerodynamic vector delta-wing jet
      ctx.moveTo(this.x, this.y - this.size * 1.3); // nose
      ctx.lineTo(this.x + this.size * 1.2, this.y + this.size * 0.5); // right wing tip
      ctx.lineTo(this.x + this.size * 0.4, this.y + this.size * 0.2); // right body inner
      ctx.lineTo(this.x, this.y + this.size * 0.8); // tail
      ctx.lineTo(this.x - this.size * 0.4, this.y + this.size * 0.2); // left body inner
      ctx.lineTo(this.x - this.size * 1.2, this.y + this.size * 0.5); // left wing tip
      ctx.closePath();
    } else if (this.type === 'fast') {
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x + this.size, this.y);
      ctx.lineTo(this.x, this.y + this.size);
      ctx.lineTo(this.x - this.size, this.y);
    } else if (this.type === 'tank') {
      ctx.rect(this.x - this.size, this.y - this.size, this.size*2, this.size*2);
    } else if (this.type === 'boss') {
      for (let a = 0; a < 8; a++) {
        const angle = a * Math.PI / 4;
        const tx = this.x + Math.cos(angle) * this.size;
        const ty = this.y + Math.sin(angle) * this.size;
        if (a === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
    } else {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw energy shield ring
    if (this.shield > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f6ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Health bar
    if (this.health < this.maxHealth) {
      const barW = this.size * 2;
      const barH = 3;
      const bx = this.x - this.size;
      const by = this.y - this.size - 8;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx, by, barW, barH);

      const healthRatio = this.health / this.maxHealth;
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(bx, by, barW * healthRatio, barH);
    }
  }
}

// ==========================================
// 6. DEFENSE NETWORK TOWER CLASS
// ==========================================
class Tower {
  constructor(type, gridX, gridY, stats) {
    this.type = type;
    this.gridX = gridX;
    this.gridY = gridY;
    this.stats = stats;
    this.level = 1;
    this.targeting = 'first';
    this.damageDealt = 0;
    
    this.lastShot = 0;
    
    // Laser and Chain active indicators
    this.activeBeamTarget = null;
    this.activeChainTargets = [];
  }

  getCurrentDamage() {
    // In-game placed level yields +20% damage per level additively
    let dmg = this.stats.baseDamage * (1 + (this.level - 1) * 0.20);
    if (window.Game.equippedModules.includes('amplifier')) {
      dmg *= 1.15;
    }
    
    // Apply Attack Global Damage increase (+5% dmg per lvl)
    const attDmgLevel = window.Game.permanentUpgrades['att_dmg_mult'] || 0;
    if (attDmgLevel > 0) {
      dmg *= (1 + attDmgLevel * 0.05);
    }
    
    return dmg;
  }

  getUpgradeCost() {
    const meta = TOWER_METADATA[this.type];
    return Math.round(meta.baseCost * 0.7 * this.level);
  }

  getTotalValue() {
    const meta = TOWER_METADATA[this.type];
    let totalInvested = meta.baseCost;
    // Accumulate custom level upgrades spent
    for (let l = 1; l < this.level; l++) {
      totalInvested += Math.round(meta.baseCost * 0.7 * l);
    }
    
    // Scale refund from 70% base up to 100% full refund based on Sim Refund Program (ut_refund)
    const refundLevel = window.Game.permanentUpgrades['ut_refund'] || 0;
    const refundPct = Math.min(1.0, 0.70 + refundLevel * 0.10);
    return Math.round(totalInvested * refundPct);
  }

  update(dt, enemies, projectiles) {
    // Reset continuous active hooks
    this.activeBeamTarget = null;
    this.activeChainTargets = [];

    if (enemies.length === 0) return;

    this.lastShot += dt;
    const pos = window.Game.gridToCanvas(this.gridX, this.gridY);
    const range = this.stats.baseRange;

    // Filter targets inside range and respect anti-air/anti-ground targeting constraints
    let isFallbackActive = false;
    let targets = enemies.filter(e => {
      // Specialty Locks
      if (this.type === 'plasma' && e.isFlying) return false;
      if (this.type === 'stasis' && e.isFlying) return false;
      if (this.type === 'tesla' && !e.isFlying) return false;

      const dx = e.x - pos.x;
      const dy = e.y - pos.y;
      return Math.sqrt(dx*dx + dy*dy) <= range;
    });

    if (targets.length === 0) {
      // Fallback matching if primary targets are absent
      if (this.type === 'plasma' || this.type === 'stasis' || this.type === 'tesla') {
        targets = enemies.filter(e => {
          // Fallback specialty conditions (inverted)
          if (this.type === 'plasma' && !e.isFlying) return false;
          if (this.type === 'stasis' && !e.isFlying) return false;
          if (this.type === 'tesla' && e.isFlying) return false;

          const dx = e.x - pos.x;
          const dy = e.y - pos.y;
          return Math.sqrt(dx*dx + dy*dy) <= range;
        });
        if (targets.length > 0) {
          isFallbackActive = true;
        }
      }
    }

    if (targets.length === 0) return;

    // Sort targets based on customizable targeting priority
    if (this.targeting === 'last') {
      targets.sort((a, b) => a.pathIndex - b.pathIndex);
    } else if (this.targeting === 'strongest') {
      targets.sort((a, b) => b.health - a.health);
    } else if (this.targeting === 'weakest') {
      targets.sort((a, b) => a.health - b.health);
    } else {
      // Default: 'first'
      targets.sort((a, b) => b.pathIndex - a.pathIndex);
    }

    const primaryTarget = targets[0];

    // Fire weapons based on tower specs
    switch (this.type) {
      case 'pulse': {
        const fireInterval = 1.0 / this.stats.baseRate;
        if (this.lastShot >= fireInterval) {
          this.lastShot = 0;
          
          // Determine Critical Hit & Critical Decimation
          const isCrit = Math.random() < 0.15; // 15% base critical hit chance
          const attCritLevel = window.Game.permanentUpgrades['att_crit_mult'] || 0;
          const critFactor = 2.2 + attCritLevel * 0.30;
          const dmg = this.getCurrentDamage() * (isCrit ? critFactor : 1.0);
          
          projectiles.push(new Projectile(
            pos.x, pos.y - 8,
            primaryTarget,
            dmg,
            this.stats.color,
            380,
            isCrit,
            this
          ));

          // Level 3+ Multi-Shot Feature
          if (this.level >= 3) {
            const secondaryTarget = targets[1] || primaryTarget;
            projectiles.push(new Projectile(
              pos.x + 8, pos.y - 4, // Visual offset for double-shot
              secondaryTarget,
              dmg * 0.8, // 80% damage for secondary shot
              this.stats.color,
              380,
              isCrit,
              this
            ));
          }
          
          Audio.playShoot('pulse');
        }
        break;
      }
      case 'plasma': {
        const fireInterval = 1.0 / this.stats.baseRate;
        if (this.lastShot >= fireInterval) {
          this.lastShot = 0;
          const dmg = isFallbackActive ? this.getCurrentDamage() * 0.3 : this.getCurrentDamage();
          projectiles.push(new Projectile(
            pos.x, pos.y - 8,
            primaryTarget,
            dmg,
            this.stats.color,
            240,
            false,
            this,
            !isFallbackActive, // isPlasma shell
            isFallbackActive ? 0 : this.stats.splashRadius
          ));
          Audio.playShoot('plasma');
        }
        break;
      }
      case 'stasis': {
        // Continuous tracking coolant beam
        this.activeBeamTarget = primaryTarget;
        
        // Tick cooling slow
        const slowFactor = isFallbackActive ? 0.10 : this.stats.slowEffect;
        primaryTarget.applySlow(1.0 - slowFactor, 0.25);
        
        // Damage over time ticks
        const dmg = isFallbackActive ? this.getCurrentDamage() * 0.3 : this.getCurrentDamage();
        primaryTarget.takeDamage(dmg * dt, false, this);
        
        // Trigger soft clicking sound periodically
        if (this.lastShot >= 0.15) {
          this.lastShot = 0;
          Audio.playShoot('stasis');
        }
        break;
      }
      case 'tesla': {
        const fireInterval = 1.0 / this.stats.baseRate;
        if (this.lastShot >= fireInterval) {
          this.lastShot = 0;
          
          // Chain targets
          const maxChains = isFallbackActive ? 1 : this.stats.maxTargets;
          const chainList = targets.slice(0, maxChains);
          this.activeChainTargets = chainList;

          const dmg = isFallbackActive ? this.getCurrentDamage() * 0.3 : this.getCurrentDamage();
          chainList.forEach(tgt => {
            tgt.takeDamage(dmg, false, this);
          });
          
          Audio.playShoot('tesla');
        }
        break;
      }
    }
  }

  draw(ctx) {
    const pos = window.Game.gridToCanvas(this.gridX, this.gridY);
    
    // Procedural Vector Tower models
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.stats.color;
    
    // Draw Base
    ctx.fillStyle = '#181424';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(pos.x - 18, pos.y - 12, 36, 26);
    ctx.fill();
    ctx.stroke();

    // Draw core colored power node
    ctx.fillStyle = this.stats.color;
    ctx.beginPath();
    if (this.type === 'pulse') {
      ctx.arc(pos.x, pos.y - 6, 6, 0, Math.PI * 2);
    } else if (this.type === 'plasma') {
      ctx.rect(pos.x - 6, pos.y - 12, 12, 12);
    } else if (this.type === 'stasis') {
      ctx.moveTo(pos.x - 6, pos.y);
      ctx.lineTo(pos.x + 6, pos.y);
      ctx.lineTo(pos.x, pos.y - 14);
      ctx.closePath();
    } else if (this.type === 'tesla') {
      // Ball atop a spindle
      ctx.fillStyle = '#261b36';
      ctx.fillRect(pos.x - 3, pos.y - 12, 6, 12);
      ctx.fillStyle = this.stats.color;
      ctx.arc(pos.x, pos.y - 12, 5, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    
    // Level Badge Tag
    if (this.level > 1) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`+${this.level-1}`, pos.x + 14, pos.y + 12);
    }
  }
}

// ==========================================
// 7. WEAPON PROJECTILE CLASS
// ==========================================
class Projectile {
  constructor(startX, startY, target, damage, color, speed, isCrit, towerDealer, isPlasma = false, splashRad = 0) {
    this.x = startX;
    this.y = startY;
    this.target = target;
    this.damage = damage;
    this.color = color;
    this.speed = speed;
    this.isCrit = isCrit;
    this.tower = towerDealer;

    this.isPlasma = isPlasma;
    this.splashRadius = splashRad;
    this.destroyed = false;
    
    // Trailing coordinates
    this.trail = [];
  }

  update(dt, enemies, triggerSplashFx) {
    if (this.destroyed) return;

    // Cache trail
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > 5) this.trail.shift();

    // Check if target died
    if (this.target.health <= 0) {
      // Find new closest replacement (respecting anti-air/ground constraint for plasma shells)
      const active = enemies.filter(e => e.health > 0 && (!this.isPlasma || !e.isFlying));
      if (active.length > 0) {
        active.sort((a, b) => {
          const da = Math.hypot(a.x - this.x, a.y - this.y);
          const db = Math.hypot(b.x - this.x, b.y - this.y);
          return da - db;
        });
        this.target = active[0];
      } else {
        this.destroyed = true;
        return;
      }
    }

    // Move toward target
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    const step = this.speed * dt;
    if (dist <= step) {
      this.explode(enemies, triggerSplashFx);
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
  }

  explode(enemies, triggerSplashFx) {
    this.destroyed = true;

    if (this.isPlasma) {
      // Splash damage radius
      triggerSplashFx({x: this.x, y: this.y}, '#ff00aa');
      Audio.playExplode();

      enemies.forEach(e => {
        if (e.isFlying) return; // Plasma splash ignores airborne units!
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d <= this.splashRadius) {
          // Linear damage falloff from impact center
          const falloff = 1 - (d / this.splashRadius) * 0.35;
          e.takeDamage(this.damage * falloff, false, this.tower);
          e.applyKnockback(28 * falloff);
        }
      });
    } else {
      // Single target damage
      this.target.takeDamage(this.damage, this.isCrit, this.tower);
      this.target.applyKnockback(12);
    }
  }

  draw(ctx) {
    // Draw projectile trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = this.isPlasma ? 5 : 2.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Draw active nucleus
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.isPlasma ? 5 : 3, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }
}

// ==========================================
// 8. VISUAL FX PARTICLE CLASS
// ==========================================
class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.maxLife = life;
    this.life = life;
    this.size = size;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

// ==========================================
// 9. SYSTEM ENGINE LAUNCH
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new GameEngine();
  window.Game.init();
});
