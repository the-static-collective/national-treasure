export const PROJECTION = 'witness-sigil/v0.1';
export const RECIPE_SCHEMA = 'witness-sigil.recipe/v0.1';

const CANONICAL_SHA256 = /^[0-9a-f]{64}$/;
const QUADRANTS = ['NW', 'NE', 'SW', 'SE'];
const LOCAL_SLOTS = ['NW', 'NE', 'SW', 'SE'];
const QUADRANT_ORIGINS = {
  NW: [0, 0],
  NE: [112, 0],
  SW: [0, 112],
  SE: [112, 112],
};
const LOCAL_CENTERS = {
  NW: [28, 28],
  NE: [84, 28],
  SW: [28, 84],
  SE: [84, 84],
};

export function assertCanonicalDigest(digest) {
  if (typeof digest !== 'string' || !CANONICAL_SHA256.test(digest)) {
    throw new TypeError('expected canonical lowercase SHA-256 digest (64 hex characters)');
  }
}

function primitiveForNibble(nibble) {
  return `P${nibble.toUpperCase()}`;
}

function primitiveMarkup(primitive) {
  switch (primitive) {
    case 'P0': return '<circle class="dot" cx="0" cy="0" r="4"/>';
    case 'P1': return '<path class="line" d="M-14 0H14"/>';
    case 'P2': return '<circle class="line" cx="0" cy="0" r="13"/>';
    case 'P3': return '<path class="line" d="M9-10A13 13 0 1 0 11 7"/>';
    case 'P4': return '<path class="line" d="M0-14L13 11H-13Z"/>';
    case 'P5': return '<rect class="line" x="-12" y="-12" width="24" height="24"/>';
    case 'P6': return '<path class="line" d="M-11-11L11 11M11-11L-11 11"/>';
    case 'P7': return '<path class="line" d="M-7-13V13M7-13V13"/>';
    case 'P8': return '<circle class="line" cx="0" cy="0" r="13"/><circle class="dot" cx="0" cy="0" r="3.5"/>';
    case 'P9': return '<path class="line" d="M-15 0H-5M5 0H15M-4-6L4 6"/>';
    case 'PA': return '<path class="line" d="M10-8A13 13 0 1 0 11 7M8-12L11-7L15-9"/>';
    case 'PB': return '<circle class="line" cx="0" cy="0" r="3"/><circle class="line" cx="0" cy="-11" r="3"/><circle class="line" cx="9.5" cy="-5.5" r="3"/><circle class="line" cx="9.5" cy="5.5" r="3"/><circle class="line" cx="0" cy="11" r="3"/><circle class="line" cx="-9.5" cy="5.5" r="3"/><circle class="line" cx="-9.5" cy="-5.5" r="3"/>';
    case 'PC': return '<circle class="line" cx="0" cy="0" r="14"/><circle class="line" cx="0" cy="0" r="9"/><circle class="line" cx="0" cy="0" r="4"/>';
    case 'PD': return '<path class="line dash" d="M0-15V15"/><path class="line" d="M-13 9L-7-9L-2 9M13 9L7-9L2 9"/>';
    case 'PE': return '<path class="line" d="M0 14V1M0 1L-12-12M0 1L12-12"/>';
    case 'PF': return '<path class="line" d="M-12-12L0 1M12-12L0 1M0 1V14"/>';
    default: throw new Error(`unknown primitive: ${primitive}`);
  }
}

function slotCenter(slot) {
  const [qx, qy] = QUADRANT_ORIGINS[slot.quadrant];
  const [lx, ly] = LOCAL_CENTERS[slot.localSlot];
  return [qx + lx, qy + ly];
}

function renderSvg(recipe) {
  const glyphs = recipe.slots.map((slot) => {
    const [x, y] = slotCenter(slot);
    return `  <g data-slot="${slot.index}" data-primitive="${slot.primitive}" data-nibble="${slot.nibble}" transform="translate(${x} ${y}) rotate(${slot.rotationDegrees})">${primitiveMarkup(slot.primitive)}</g>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-labelledby="title desc">
  <title id="title">Witness Sigil ${recipe.digestPrefix}</title>
  <desc id="desc">witness-sigil/v0.1 geometric recognition cue, not authentication; verify the full canonical digest separately.</desc>
  <style>.line{fill:none;stroke:#111;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.dot{fill:#111}.dash{stroke-dasharray:2 3}.label{fill:#111;font:6px ui-monospace,monospace}</style>
${glyphs}
  <text class="label" x="8" y="239">witness-sigil/v0.1</text>
  <text class="label" x="8" y="250">${recipe.digestPrefix}</text>
</svg>
`;
}

export function renderWitnessSigil(digest) {
  assertCanonicalDigest(digest);

  const slots = [...digest.slice(0, 16)].map((nibble, index) => ({
    index,
    quadrant: QUADRANTS[Math.floor(index / 4)],
    localSlot: LOCAL_SLOTS[index % 4],
    nibble,
    primitive: primitiveForNibble(nibble),
    rotationDegrees: (Number.parseInt(digest[16 + index], 16) & 0x3) * 90,
  }));

  const recipe = {
    schema: RECIPE_SCHEMA,
    projection: PROJECTION,
    digestAlgorithm: 'sha256',
    digest,
    digestPrefix: digest.slice(0, 12),
    payload: digest.slice(0, 16),
    rotationPayload: digest.slice(16, 32),
    slots,
  };

  return {
    recipe,
    recipeText: `${JSON.stringify(recipe, null, 2)}\n`,
    svgText: renderSvg(recipe),
  };
}
