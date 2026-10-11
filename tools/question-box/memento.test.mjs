import assert from 'node:assert/strict';
import {fromMementoHeldSeed,MEMENTO_HOLD_NONCLAIMS} from './from-memento.mjs';

const id='a'.repeat(64);
const specimen={
 schema:'memento.held-question-seed/v0',
 crossing_id:'relatte-crossing-v0:'+id,
 hold_receipt_id:'relatte-receipt-v0:'+'b'.repeat(64),
 relation_kind:'madd-clown',
 typing_basis:'fallback',
 source_object_recoverable:false,
 historical_relation_established:false,
 private_source_included:false,
 observed_event:'LOCAL_HOLD_ENCOUNTER',
 provenance_class:'speculation',
 support_confidence:'unsupported',
 non_claims:[...MEMENTO_HOLD_NONCLAIMS]
};
const clone=()=>structuredClone(specimen);
const result=fromMementoHeldSeed(specimen);
assert.equal(result.schema,'national-treasure.memento-question-handoff/v0');
assert.equal(result.receipt_verification,'NOT_PERFORMED_BY_QUESTION_BOX');
assert.equal(result.original_source_recovery,'NOT_ESTABLISHED');
assert.equal(result.authority,'none');
assert.equal(result.admission,'none');
assert.equal(result.question_receipt.schema,'national-treasure.question-receipt/v0');
assert.equal(result.question_receipt.aperture.id,'source-object');
assert.equal(result.question_receipt.evidence.provenance_class,'speculation');
assert.equal(result.question_receipt.evidence.support_confidence,'unsupported');
assert.equal(result.question_receipt.evidence.source_locator,'');
assert.ok(result.question_receipt.question.endsWith('?'));
assert.equal(Object.hasOwn(result.question_receipt,'answer'),false);
assert.equal(Object.hasOwn(result.question_receipt,'conclusion'),false);
assert.equal(JSON.stringify(result).includes('private/sources/'),false);
for(const mutation of [
 x=>x.original_source='private/sources/story.md',
 x=>x.source_object_recoverable=true,
 x=>x.historical_relation_established=true,
 x=>x.private_source_included=true,
 x=>x.provenance_class='observed',
 x=>x.support_confidence='established',
 x=>x.typing_basis='structural',
 x=>x.non_claims=[],
 x=>x.hold_receipt_id='not-a-receipt',
 x=>x.observed_event='ADMIT',
 x=>x.relation_kind='secret-ancestry',
 x=>delete x.crossing_id
]){
 const x=clone();mutation(x);assert.throws(()=>fromMementoHeldSeed(x));
}
// A grounded named relation still cannot make the **source object** recoverable.
const declared=clone();declared.relation_kind='callback';declared.typing_basis='declared_hint';
const res=fromMementoHeldSeed(declared);
assert.equal(res.question_receipt.aperture.id,'source-object');
assert.equal(res.question_receipt.evidence.provenance_class,'speculation');
process.stdout.write('national-treasure: MEMENTO held-question boundaries passed\n');