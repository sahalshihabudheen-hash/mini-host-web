// Generates the Mini Host build library: original voxel builds written as Sponge v2 .schem
// files, plus the index.json the app searches. Run: node tools/make-schematics.mjs
import { gzipSync } from 'node:zlib';
import { mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'schematics');
const DATA_VERSION = 3953;
const AIR = 'minecraft:air';

/* ---------- builder ----------
   set(x,y,z,null) clears to air. Coordinates are absolute; anything outside the
   box is dropped, so builds can be written without clipping maths.            */
function B(w, h, l) {
  const pal = new Map([[AIR, 0]]);
  const g = new Int32Array(w * h * l);
  const id = (b) => { if (!pal.has(b)) pal.set(b, pal.size); return pal.get(b); };
  const b = {
    w, h, l, pal, g,
    set(x, y, z, blk) {
      x |= 0; y |= 0; z |= 0;
      if (x < 0 || y < 0 || z < 0 || x >= w || y >= h || z >= l) return;
      g[(y * l + z) * w + x] = blk == null ? 0 : id(blk);
    },
    fill(x1, y1, z1, x2, y2, z2, blk) { for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) for (let x = x1; x <= x2; x++) b.set(x, y, z, blk); },
    walls(x1, y1, z1, x2, y2, z2, blk) { for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) for (let x = x1; x <= x2; x++) if (x === x1 || x === x2 || z === z1 || z === z2) b.set(x, y, z, blk); },
    hollow(x1, y1, z1, x2, y2, z2, blk) { b.walls(x1, y1, z1, x2, y2, z2, blk); b.fill(x1 + 1, y1, z1 + 1, x2 - 1, y2, z2 - 1, null); },
    rect(x1, z1, x2, z2, y, blk) { b.fill(x1, y, z1, x2, y, z2, blk); },
    pillar(x, z, y1, y2, blk) { b.fill(x, y1, z, x, y2, z, blk); },
    // gabled roof along x, ridge column zr; 'F' in the stair id is swapped per slope
    roof(z1, z2, y, zr, stair, ridge) {
      for (let z = z1; z <= z2; z++) {
        const d = Math.abs(z - zr), top = y - d;
        for (let x = 0; x < w; x++) b.set(x, top, z, top < y ? stair.replace('F', z < zr ? 'south' : 'north') : ridge);
      }
    },
    window(x, y, z, pane, trim) { b.set(x, y, z, pane); b.set(x, y + 1, z, pane); if (trim) { b.set(x, y - 1, z, trim); b.set(x, y + 2, z, trim); } },
    post(x, z, y, blk) { b.pillar(x, z, y, y + 2, blk); },
  };
  return b;
}

const S = {
  oak: 'minecraft:oak_planks', dark: 'minecraft:dark_oak_planks', spruce: 'minecraft:spruce_planks', birch: 'minecraft:birch_planks',
  cobble: 'minecraft:cobblestone', mossy: 'minecraft:mossy_cobblestone', stone: 'minecraft:stone_bricks', cracked: 'minecraft:cracked_stone_bricks',
  andesite: 'minecraft:polished_andesite', deep: 'minecraft:deepslate_tiles', glass: 'minecraft:glass', lantern: 'minecraft:soul_lantern',
  lamp: 'minecraft:sea_lantern', log: 'minecraft:oak_log[axis=y]', slog: 'minecraft:spruce_log[axis=y]', leaf: 'minecraft:oak_leaves',
  dirt: 'minecraft:dirt', grass: 'minecraft:grass_block[snowy=false]', path: 'minecraft:dirt_path', gravel: 'minecraft:gravel',
  sand: 'minecraft:sand', water: 'minecraft:water', fence: 'minecraft:oak_fence', sfence: 'minecraft:spruce_fence', wall: 'minecraft:cobblestone_wall',
  torch: 'minecraft:torch', woolW: 'minecraft:white_wool', woolR: 'minecraft:red_wool', obsidian: 'minecraft:obsidian',
  nether: 'minecraft:nether_bricks', basalt: 'minecraft:polished_basalt', black: 'minecraft:blackstone', magma: 'minecraft:magma_block',
  hay: 'minecraft:hay_block', barrel: 'minecraft:barrel[facing=north]', chest: 'minecraft:chest[facing=south]', comp: 'minecraft:composter',
  pot: 'minecraft:flower_pot', rose: 'minecraft:poppy', daisy: 'minecraft:dandelion', lilac: 'minecraft:lilac[half=lower]',
  book: 'minecraft:bookshelf', slabO: 'minecraft:oak_slab[type=bottom]', slabS: 'minecraft:smooth_stone_slab[type=bottom]',
  stairO: 'minecraft:oak_stairs[facing=F,half=bottom,shape=straight]', stairS: 'minecraft:stone_brick_stairs[facing=F,half=bottom,shape=straight]',
  stairC: 'minecraft:cobblestone_stairs[facing=F,half=bottom,shape=straight]', stairD: 'minecraft:dark_oak_stairs[facing=F,half=bottom,shape=straight]',
  trap: 'minecraft:oak_trapdoor[half=bottom]', table: 'minecraft:crafting_table', grind: 'minecraft:grindstone',
  anvil: 'minecraft:anvil[facing=south]', cauldron: 'minecraft:cauldron[level=0]', furnace: 'minecraft:furnace[facing=south]',
  rod: 'minecraft:lightning_rod', rail: 'minecraft:rail[shape=north_south]', iron: 'minecraft:iron_bars', bed: 'minecraft:red_bed[facing=north]',
};
const st = (id, f) => id.replace('F', f);

/* ---------- builds ---------- */
const tavern = B(15, 12, 13);
{
  const b = tavern;
  b.rect(1, 1, 13, 11, 0, S.cobble);
  b.hollow(1, 1, 1, 13, 4, 11, S.stone);
  b.rect(2, 2, 12, 10, 1, S.oak);
  for (let x = 1; x <= 13; x += 3) { b.pillar(x, 1, 1, 4, S.dark); b.pillar(x, 11, 1, 4, S.dark); }
  b.rect(1, 1, 13, 11, 5, S.dark);
  b.hollow(2, 6, 2, 12, 8, 10, S.oak);
  b.rect(3, 3, 11, 9, 6, S.birch);
  for (const [x, z] of [[1, 4], [1, 8], [13, 4], [13, 8], [4, 1], [10, 1], [4, 11], [10, 11]]) b.window(x, 2, z, S.glass, S.andesite);
  for (const [x, z] of [[2, 2], [12, 2], [2, 10], [12, 10]]) b.window(x, 7, z, S.glass, S.dark);
  b.walls(6, 1, 0, 8, 4, 0, S.dark); b.fill(6, 1, 0, 8, 3, 0, null); b.set(7, 4, 0, S.lantern);
  b.fill(6, 1, 1, 8, 2, 1, null);
  for (let z = 0; z <= 12; z++) { b.set(0, 9, z, st(S.stairO, 'east')); b.set(14, 9, z, st(S.stairO, 'west')); }
  b.roof(1, 11, 9, 6, S.stairD, S.trap);
  b.walls(6, 9, 6, 8, 11, 6, S.cracked); b.fill(7, 10, 7, 7, 11, 7, S.gravel);
  b.set(3, 2, 5, S.table); b.set(4, 2, 5, S.barrel); b.set(5, 2, 5, S.furnace);
  b.fill(9, 2, 4, 11, 2, 4, S.oak); b.set(10, 3, 4, S.lantern);
  b.fill(3, 7, 5, 5, 7, 7, S.dark); b.set(4, 8, 6, S.lamp);
  b.set(2, 7, 3, S.book); b.set(2, 7, 4, S.book);
  b.set(7, 2, 9, S.bed); b.set(7, 7, 3, S.chest);
}

const tower = B(11, 20, 11);
{
  const b = tower;
  b.rect(2, 2, 8, 8, 0, S.cobble);
  for (let y = 1; y <= 12; y++) { b.walls(2, y, 2, 8, y, 8, y % 4 === 0 ? S.mossy : S.cobble); b.fill(3, y, 3, 7, y, 7, null); }
  b.rect(1, 1, 9, 9, 13, S.spruce);
  for (let x = 1; x <= 9; x++) for (let z = 1; z <= 9; z++) if ((x === 1 || x === 9 || z === 1 || z === 9) && (x + z) % 2 === 0) b.set(x, 14, z, st(S.stairS, z < 5 ? 'south' : 'north'));
  for (let y = 2; y <= 11; y += 3) { b.set(5, y, 2, S.torch); b.set(5, y, 8, S.torch); }
  b.walls(3, 15, 3, 7, 17, 7, S.stone); b.fill(4, 15, 4, 6, 17, 6, null);
  b.rect(4, 4, 6, 6, 18, S.spruce);
  for (const [x, z] of [[3, 3], [7, 3], [3, 7], [7, 7]]) b.pillar(x, z, 15, 18, S.slog);
  b.fill(3, 19, 3, 7, 19, 7, st(S.stairD, 'south')); b.set(5, 19, 5, S.lamp);
  for (const [x, z] of [[2, 5], [8, 5], [5, 2], [5, 8]]) b.set(x, 18, z, S.lantern);
  b.walls(4, 1, 1, 6, 4, 2, S.mossy); b.fill(5, 1, 1, 5, 3, 2, null);
  b.set(5, 1, 5, S.barrel); b.set(4, 1, 4, S.table); b.set(6, 1, 6, S.book);
}

const farm = B(19, 7, 19);
{
  const b = farm;
  b.rect(0, 0, 18, 18, 0, S.grass);
  for (let x = 0; x <= 18; x++) for (let z = 0; z <= 18; z++) if (x === 0 || x === 18 || z === 0 || z === 18) b.set(x, 1, z, S.fence);
  b.fill(9, 1, 3, 9, 1, 15, S.water);
  for (let z = 2; z <= 16; z += 2) {
    b.fill(4, 1, z, 8, 1, z, 'minecraft:farmland[moisture=7]');
    b.fill(10, 1, z, 14, 1, z, 'minecraft:farmland[moisture=7]');
    for (let x = 4; x <= 8; x++) b.set(x, 2, z, 'minecraft:wheat[age=7]');
    for (let x = 10; x <= 14; x++) b.set(x, 2, z, (x + z) % 5 === 0 ? 'minecraft:carrots[age=7]' : 'minecraft:potatoes[age=7]');
  }
  for (const z of [5, 9, 13]) b.set(9, 2, z, S.hay);
  b.hollow(15, 1, 16, 18, 3, 18, S.slog); b.rect(16, 17, 17, 17, 1, S.oak);
  b.rect(15, 16, 18, 18, 4, st(S.stairC, 'north'));
  b.fill(16, 1, 15, 17, 2, 15, null);
  b.set(17, 2, 18, S.barrel); b.set(16, 2, 18, S.comp);
  for (const [x, z] of [[2, 2], [2, 16]]) { b.pillar(x, z, 2, 3, S.slog); b.set(x, 4, z, S.lantern); }
}

const gate = B(17, 12, 9);
{
  const b = gate;
  b.rect(0, 0, 16, 8, 0, S.black);
  b.rect(2, 2, 14, 6, 1, S.nether);
  for (const x of [3, 13]) { b.fill(x, 2, 3, x, 8, 5, S.obsidian); }
  b.fill(4, 9, 3, 12, 9, 5, S.obsidian);
  b.fill(4, 2, 4, 12, 8, 4, null);
  b.fill(5, 8, 4, 11, 8, 4, S.magma);
  for (const x of [5, 11]) { b.pillar(x, 1, 2, 5, S.basalt); b.pillar(x, 7, 2, 5, S.basalt); }
  for (const [x, z] of [[1, 1], [15, 1], [1, 7], [15, 7]]) { b.pillar(x, z, 2, 4, S.black); b.set(x, 5, z, S.lantern); }
  b.walls(0, 1, 0, 1, 3, 8, S.black); b.walls(15, 1, 0, 16, 3, 8, S.black);
  b.fill(0, 2, 3, 1, 3, 5, null); b.fill(15, 2, 3, 16, 3, 5, null);
  b.set(8, 10, 4, S.lamp);
  for (const x of [6, 10]) b.set(x, 9, 3, S.basalt);
}

const spawn = B(21, 10, 21);
{
  const b = spawn;
  b.rect(2, 2, 18, 18, 0, S.grass);
  b.rect(3, 3, 17, 17, 1, S.dirt); b.rect(4, 4, 16, 16, 2, S.dirt);
  b.rect(2, 2, 18, 18, 1, S.grass);
  b.rect(10, 3, 10, 17, 2, S.path); b.rect(3, 10, 17, 10, 2, S.path);
  for (const [x, z] of [[4, 4], [16, 4], [4, 16], [16, 16]]) { b.pillar(x, z, 3, 4, S.stone); b.set(x, 5, z, S.lantern); }
  b.rect(6, 6, 8, 8, 3, S.gravel);
  b.set(7, 4, 6, S.rose); b.set(7, 4, 8, S.daisy);
  b.pillar(14, 6, 3, 5, S.log);
  b.fill(12, 6, 4, 16, 7, 8, S.leaf); b.fill(13, 8, 5, 15, 8, 7, S.leaf);
  b.rect(4, 13, 6, 15, 3, S.spruce); b.set(5, 4, 14, S.lilac);
  b.fill(9, 3, 14, 10, 3, 14, st(S.stairO, 'north'));
  b.set(11, 3, 15, S.table); b.set(12, 3, 15, S.furnace);
  for (let x = 2; x <= 18; x++) for (let z = 2; z <= 18; z++) if ((x === 2 || x === 18 || z === 2 || z === 18) && (x + z) % 2 === 0) b.set(x, 4, z, S.wall);
}

const dock = B(27, 9, 11);
{
  const b = dock;
  b.rect(0, 0, 26, 10, 0, S.sand);
  b.rect(0, 5, 12, 9, 3, S.spruce);
  for (let x = 1; x <= 11; x += 2) { b.pillar(x, 6, 0, 2, S.slog); b.pillar(x, 2, 0, 2, S.slog); }
  b.rect(13, 2, 24, 4, 3, S.spruce);
  b.fill(13, 4, 2, 24, 4, 2, S.sfence); b.fill(13, 4, 4, 24, 4, 4, S.sfence);
  for (let x = 14; x <= 24; x += 5) b.set(x, 5, 3, S.lantern);
  b.hollow(18, 4, 3, 22, 6, 4, S.slog); b.rect(19, 3, 21, 5, 4, S.oak);
  b.rect(18, 2, 22, 6, 6, st(S.stairD, 'south'));
  b.fill(20, 4, 2, 20, 5, 5, null);
  b.set(14, 4, 3, S.barrel); b.set(15, 4, 3, S.chest); b.set(16, 5, 3, S.barrel);
  b.rect(25, 5, 26, 6, 4, S.stone);
  b.pillar(25, 8, 1, 4, S.slog); b.set(25, 5, 8, S.lantern);
  b.fill(1, 1, 7, 3, 1, 9, S.water);
}

const light = B(11, 26, 11);
{
  const b = light;
  b.rect(1, 1, 9, 9, 0, S.stone);
  for (let y = 1; y <= 17; y++) {
    const m = 2 + Math.floor(y / 6), x2 = 8 - Math.floor(y / 6);
    b.walls(m, y, m, x2, y, x2, y % 3 === 0 ? S.woolR : S.woolW);
    b.fill(m + 1, y, m + 1, x2 - 1, y, x2 - 1, null);
  }
  b.fill(4, 1, 5, 6, 4, 5, null);
  for (let y = 3; y <= 15; y += 2) b.set(5, y, 5, S.slabS);
  for (let y = 6; y <= 15; y += 3) { b.set(5, y, 2, null); b.set(5, y, 8, null); }
  b.rect(2, 2, 8, 8, 18, S.andesite);
  b.walls(3, 19, 3, 7, 21, 7, S.glass); b.fill(4, 19, 4, 6, 21, 6, null);
  b.set(5, 20, 5, S.lamp);
  b.rect(2, 2, 8, 8, 22, S.andesite);
  for (let x = 2; x <= 8; x++) for (let z = 2; z <= 8; z++) if ((x === 2 || x === 8 || z === 2 || z === 8) && (x + z) % 2 === 0) b.set(x, 23, z, st(S.stairS, 'south'));
  b.rect(4, 4, 6, 6, 24, st(S.stairC, 'south'));
  b.set(5, 25, 5, S.rod);
  for (const [x, z] of [[3, 5], [7, 5], [5, 3], [5, 7]]) b.set(x, 21, z, S.lantern);
}

const cottage = B(13, 10, 11);
{
  const b = cottage;
  b.rect(1, 1, 11, 9, 0, S.cobble);
  b.hollow(2, 1, 2, 10, 3, 8, S.oak);
  b.rect(3, 3, 9, 7, 1, S.birch);
  b.walls(5, 1, 1, 8, 4, 2, S.slog); b.fill(6, 1, 1, 7, 3, 2, null);
  b.window(3, 2, 2, S.glass, S.cobble); b.window(9, 2, 5, S.glass, S.cobble);
  b.set(2, 2, 5, S.glass); b.set(2, 3, 5, S.glass);
  b.rect(2, 2, 10, 8, 4, S.spruce);
  b.roof(1, 9, 6, 5, S.stairO, S.slabO);
  b.walls(3, 5, 3, 4, 7, 4, S.mossy);
  b.set(6, 2, 3, S.table); b.set(8, 2, 6, S.chest); b.set(4, 2, 7, S.furnace); b.set(8, 2, 8, S.bed);
  b.set(6, 5, 5, S.lamp);
  b.rect(10, 9, 12, 10, 1, S.grass); b.set(10, 2, 9, S.rose); b.set(12, 2, 10, S.daisy);
  for (let x = 0; x <= 12; x += 3) b.set(x, 2, 0, S.fence);
  b.rect(4, 6, 6, 8, 1, 'minecraft:farmland[moisture=7]');
  for (let x = 4; x <= 6; x++) for (let z = 6; z <= 8; z++) b.set(x, 2, z, 'minecraft:wheat[age=7]');
}

const bridge = B(27, 11, 9);
{
  const b = bridge;
  b.fill(0, 0, 26, 2, 8, S.water);
  b.rect(0, 0, 3, 8, 1, S.stone); b.rect(23, 0, 26, 8, 1, S.stone);
  for (let x = 3; x <= 23; x++) {
    const y = 4 - Math.floor(Math.abs(x - 13) / 4);
    b.fill(x, y, 2, x, y, 6, S.stone);
    b.set(x, y + 1, 2, S.wall); b.set(x, y + 1, 6, S.wall);
    if (x % 5 === 3) { b.pillar(x, 1, 1, y, S.cracked); b.pillar(x, 7, 1, y, S.cracked); b.set(x, y + 2, 4, S.lantern); }
  }
  for (const x of [6, 20]) b.fill(x, 1, 3, x + 1, 3, 5, null);
  b.pillar(13, 1, 1, 3, S.stone); b.pillar(13, 7, 1, 3, S.stone);
  b.rect(12, 1, 14, 7, 4, S.cracked); b.set(13, 5, 4, S.lamp);
  b.fill(12, 5, 3, 14, 5, 5, null);
}

const gazebo = B(11, 9, 11);
{
  const b = gazebo;
  b.rect(1, 1, 9, 9, 0, S.andesite);
  b.rect(2, 2, 8, 8, 1, S.dark);
  for (const [x, z] of [[2, 2], [8, 2], [2, 8], [8, 8]]) b.pillar(x, z, 2, 4, S.dark);
  for (const [x, z] of [[5, 2], [2, 5], [8, 5], [5, 8]]) b.set(x, 5, z, S.sfence);
  b.set(4, 2, 5, st(S.stairO, 'west')); b.set(6, 2, 5, st(S.stairO, 'east')); b.set(5, 2, 4, S.table);
  b.roof(1, 9, 7, 5, S.stairD, S.trap);
  b.fill(4, 6, 4, 6, 7, 6, null); b.set(5, 7, 5, S.lamp);
  for (const [x, z] of [[3, 3], [7, 3], [3, 7], [7, 7]]) b.set(x, 6, z, S.lantern);
  b.set(1, 1, 5, S.pot); b.set(9, 1, 5, S.pot); b.set(1, 2, 5, S.lilac); b.set(9, 2, 5, S.rose);
  for (let x = 4; x <= 6; x++) b.set(x, 1, 10, st(S.stairS, 'north'));
}

const mine = B(15, 11, 13);
{
  const b = mine;
  b.rect(0, 0, 14, 12, 0, S.grass); b.rect(0, 0, 14, 12, 1, S.dirt);
  b.rect(0, 0, 14, 12, 1, S.grass);
  b.rect(4, 6, 10, 6, 2, S.path);
  b.walls(5, 2, 0, 9, 6, 12, S.slog);
  b.fill(6, 2, 1, 8, 5, 11, null);
  b.fill(6, 2, -1, 8, 6, 0, null);
  b.rect(5, 2, 9, 12, 6, S.spruce);
  for (const z of [2, 5, 8, 11]) { b.set(6, 4, z, S.torch); b.set(6, 3, z, S.sfence); }
  b.set(7, 3, 3, S.chest); b.set(7, 3, 9, S.barrel);
  b.fill(7, 2, 4, 7, 2, 10, S.rail);
  b.set(7, 4, 7, S.lantern);
  b.pillar(4, 1, 2, 4, S.mossy); b.pillar(10, 1, 2, 4, S.mossy);
  b.set(4, 5, 1, S.grind); b.set(10, 5, 1, S.anvil);
  b.rect(11, 6, 13, 8, 2, S.gravel); b.set(12, 3, 7, S.cauldron);
  b.pillar(2, 8, 2, 3, S.log); b.fill(1, 4, 7, 3, 5, 9, S.leaf);
  b.fill(6, 2, 0, 8, 2, 0, null);
}

/* ---------- Sponge v2 writer ---------- */
const be = {
  str(s) { const p = Buffer.from(s, 'utf8'); const h = Buffer.alloc(2); h.writeUInt16BE(p.length); return Buffer.concat([h, p]); },
  i(v) { const b = Buffer.alloc(4); b.writeInt32BE(v); return b; },
  s(v) { const b = Buffer.alloc(2); b.writeInt16BE(v); return b; },
  tag(type, name, payload) { return Buffer.concat([Buffer.from([type]), be.str(name), payload]); },
  byte(v) { return Buffer.from([v]); },
  bytes(a) { return Buffer.concat([be.i(a.length), Buffer.from(a)]); },
  comp(parts) { return Buffer.concat([...parts, Buffer.from([0])]); },
  ints(a) { const h = Buffer.alloc(4); h.writeInt32BE(a.length); return Buffer.concat([Buffer.from([3]), h, ...a.map(be.i)]); },
  emptyList: () => Buffer.from([10, 0, 0, 0, 0]),
};
const varint = (n) => { const o = []; do { let b = n & 0x7f; n >>>= 7; if (n) b |= 0x80; o.push(b); } while (n); return o; };

function emit(b, file, meta) {
  const { w, h, l, pal, g } = b;
  const data = [];
  let blocks = 0;
  for (let i = 0; i < w * h * l; i++) { data.push(...varint(g[i])); if (g[i]) blocks++; }
  const root = be.comp([
    be.tag(3, 'Version', be.i(2)),
    be.tag(3, 'DataVersion', be.i(DATA_VERSION)),
    be.tag(2, 'Width', be.s(w)),
    be.tag(2, 'Height', be.s(h)),
    be.tag(2, 'Length', be.s(l)),
    be.tag(10, 'Metadata', be.comp([
      be.tag(8, 'Name', be.str(meta.title)),
      be.tag(8, 'Description', be.str(meta.desc)),
      be.tag(8, 'Creator', be.str('Mini Host')),
      be.tag(8, 'WeVersion', be.str('7.3')),
      be.tag(9, 'Size', be.ints([w, h, l])),
      be.tag(9, 'Origin', be.ints([0, 0, 0])),
    ])),
    be.tag(10, 'Palette', be.comp([...pal].map(([k, v]) => be.tag(3, k, be.i(v))))),
    be.tag(7, 'BlockData', be.bytes(data)),
    be.tag(9, 'BlockEntities', be.emptyList()),
    be.tag(9, 'Entities', be.emptyList()),
  ]);
  mkdirSync(join(OUT, 'files'), { recursive: true });
  const out = join(OUT, 'files', file);
  const z = gzipSync(Buffer.concat([Buffer.from([10]), be.str(''), root]));
  writeFileSync(out, z);
  return { bytes: z.length, blocks };
}

/* ---------- self check: read the file back with the same rules the app uses ---------- */
function check(file) {
  const raw = gunzipSync(readFileSync(join(OUT, 'files', file)));
  const p = { i: 0, b: raw };
  const u8 = () => raw[p.i++], u16 = () => { const v = raw.readUInt16BE(p.i); p.i += 2; return v; };
  const i32 = () => { const v = raw.readInt32BE(p.i); p.i += 4; return v; };
  const s16 = () => { const v = raw.readInt16BE(p.i); p.i += 2; return v; };
  const utf = () => { const n = u16(); const v = raw.toString('utf8', p.i, p.i + n); p.i += n; return v; };
  const read = (t) => {
    if (t === 1) return u8(); if (t === 2) return s16(); if (t === 3) return i32();
    if (t === 8) return utf();
    if (t === 7) { const n = i32(); const v = raw.subarray(p.i, p.i + n); p.i += n; return v; }
    if (t === 9) { const et = u8(), n = i32(); for (let k = 0; k < n; k++) read(et); return 'list'; }
    if (t === 10) { const m = {}; for (;;) { const bt = u8(); if (!bt) break; m[utf()] = read(bt); } return m; }
    if (t === 11) { const n = i32(); p.i += 4 * n; return 'ints'; }
    throw new Error('unknown tag ' + t);
  };
  if (u8() !== 10) throw new Error('no root');
  utf();
  const r = read(10);
  const total = r.Width * r.Height * r.Length;
  let n = 0, p2 = 0, air = 0;
  while (p2 < r.BlockData.length) { let v = 0, sh = 0; for (;;) { const by = r.BlockData[p2++]; v |= (by & 0x7f) << sh; sh += 7; if (!(by & 0x80)) break; } n++; if (!v) air++; }
  if (r.Version !== 2) throw new Error('version ' + r.Version);
  if (n !== total) throw new Error('block count ' + n + ' != ' + total);
  const vals = Object.values(r.Palette).sort((a, c) => a - c);
  if (vals.some((v, k) => v !== k)) throw new Error('palette not contiguous');
  return { dims: `${r.Width}x${r.Height}x${r.Length}`, pal: Object.keys(r.Palette).length, filled: n - air };
}

const CAT = [
  ['tavern', 'The Crossed Lantern Tavern', 'Two floors: taproom below, guest loft above, chimney smoking.', ['building', 'interior', 'survival'], tavern],
  ['watchtower', 'Ruin Watchtower', 'Mossy stone shaft with a timber hoarding and a lit beacon room.', ['building', 'defense', 'pvp'], tower],
  ['cropfield', 'Irrigated Crop Field', 'Water down the middle, three crops, tool shed and hay store.', ['farm', 'functional', 'survival'], farm],
  ['nethergate', 'Nether Gate Hub', 'Obsidian arch, magma walkway, soul-lit basalt pillars.', ['nether', 'travel', 'hub'], gate],
  ['spawnisland', 'Floating Spawn Island', 'Grass platform with paths, benches, a tree and four lamp posts.', ['spawn', 'lobby', 'float'], spawn],
  ['harbourdock', "Fisherman's Dock", 'Spruce pier, lamp posts, a tackle shack and crate storage.', ['decor', 'village', 'water'], dock],
  ['lighthouse', 'Cape Lighthouse', 'Banded wool tower with a glass lamp room and inside steps.', ['build', 'tower', 'coast'], light],
  ['cottage', 'Cobblestone Cottage', 'One-room starter home with a wheat strip and a fenced lane.', ['house', 'starter', 'survival'], cottage],
  ['stonebridge', 'Arched Stone Bridge', 'Decked arch with lamp standards over a nine-wide channel.', ['decor', 'path', 'water'], bridge],
  ['gazebo', 'Garden Gazebo', 'Shaded pavilion with benches, hanging lamps and potted blooms.', ['decor', 'garden', 'small'], gazebo],
  ['minemouth', 'Old Mine Entrance', 'Timbered portal with rails, torches and tool lockers.', ['decor', 'adventure', 'ruins'], mine],
];

mkdirSync(OUT, { recursive: true });
const index = [];
for (const [id, title, desc, tags, b] of CAT) {
  const r = emit(b, id + '.schem', { title, desc });
  const c = check(id + '.schem');
  if (`${b.w}x${b.h}x${b.l}` !== c.dims) throw new Error(id + ' dims mismatch');
  index.push({ id, file: id + '.schem', title, desc, tags, size: c.dims, blocks: c.filled, palette: c.pal, bytes: r.bytes, mc: '1.20+', author: 'Mini Host', license: 'Made for Mini Host - free to use in your worlds' });
  console.log(id.padEnd(13), c.dims.padEnd(10), String(c.filled).padStart(6), 'blocks', (r.bytes / 1024).toFixed(1) + ' KB');
}
writeFileSync(join(OUT, 'index.json'), JSON.stringify({ updated: new Date().toISOString(), note: 'All builds are original Mini Host content.', library: index }, null, 1));
console.log('wrote', index.length, 'builds + index.json');
void statSync;
