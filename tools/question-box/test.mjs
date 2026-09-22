import assert from 'node:assert/strict';
import { buildQuestionFrontier } from './engine.mjs';

function test(name, fn) {
  try {
    fn();
    process.stdout.write(`ok - ${name}\n`);
  } catch (error) {
    process.stderr.write(`not ok - ${name}\n`);
    throw error;
  }
}

test('missing source is the first aperture', () => {
  const receipt = buildQuestionFrontier({ clue: 'a recurring symbol' });
  assert.equal(receipt.aperture.id, 'source-object');
});

test('chronology becomes first after a source is recoverable', () => {
  const receipt = buildQuestionFrontier({
    clue: 'a recurring symbol',
    source_locator: 'archive/item/17',
  });
  assert.equal(receipt.aperture.id, 'chronology');
});

test('evidence labels are preserved rather than promoted', () => {
  const receipt = buildQuestionFrontier({
    clue: 'possible relation',
    provenance_class: 'speculation',
    support_confidence: 'unsupported',
  });
  assert.equal(receipt.evidence.provenance_class, 'speculation');
  assert.equal(receipt.evidence.support_confidence, 'unsupported');
});

test('a saturated record asks for a discriminator', () => {
  const receipt = buildQuestionFrontier({
    clue: 'two source traditions use the same unusual ordering',
    source_locator: 'case/primary-a',
    source_families: ['archive-a', 'archive-b'],
    chronology: 'A predates B by 14 years',
    counterevidence: 'the ordering also appears in an unrelated catalog',
    falsifier: 'an earlier common template would dissolve the proposed relation',
    competing_explanations: ['transmission', 'independent recurrence'],
  });
  assert.equal(receipt.aperture.id, 'discriminator');
});

test('receipt terminal object is a question, not an answer field', () => {
  const receipt = buildQuestionFrontier({ clue: 'strange alignment' });
  assert.equal(typeof receipt.question, 'string');
  assert.ok(receipt.question.endsWith('?'));
  assert.equal(Object.hasOwn(receipt, 'answer'), false);
  assert.equal(Object.hasOwn(receipt, 'conclusion'), false);
});

process.stdout.write('question-box: all tests passed\n');
