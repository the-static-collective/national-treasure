// NATIONAL TREASURE × MEMENTO 002
// A deliberately narrow, non-attesting adapter for REDACTED MEMENTO HOLD-derived
// question seeds. No access to private MEMENTO sources or signing keys.
import {buildQuestionFrontier} from './engine.mjs';
const SEED_KEYS=[
 'schema','crossing_id','hold_receipt_id','relation_kind','typing_basis',
 'source_object_recoverable','historical_relation_established','private_source_included',
 'observed_event','provenance_class','support_confidence','non_claims'
];
const RELATION_TYPES=new Set(['resonance','contrast','callback','same-symbol-different-road','decoder-shift','absence','madd-clown']);
const SOURCES=new Set(['fallback','structural','declared_hint']);
const NONCLAIMS=[
 'HOLD receipt witnesses a local receiving disposition, not historical ancestry.',
 'MEMENTO original source objects remain private and have not been independently inspected here.',
 'A shuffled adjacency is a question candidate, not an admitted relation.'
];
const hex64=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
export function validateMementoQuestionSeed(seed){
 if(!seed||typeof seed!=='object'||Array.isArray(seed)||
  Object.keys(seed).length!==SEED_KEYS.length||SEED_KEYS.some(k=>!Object.hasOwn(seed,k)))
  throw Error('QUESTION_SEED_UNEXPECTED_FIELDS');
 if(seed.schema!=='memento.held-question-seed/v0'||
    !/^relatte-crossing-v0:[a-f0-9]{64}$/.test(seed.crossing_id)||
    !/^relatte-receipt-v0:[a-f0-9]{64}$/.test(seed.hold_receipt_id)||
    !RELATION_TYPES.has(seed.relation_kind)||!SOURCES.has(seed.typing_basis)||
    seed.source_object_recoverable!==false||seed.historical_relation_established!==false||
    seed.private_source_included!==false||seed.observed_event!=='LOCAL_HOLD_ENCOUNTER'||
    seed.provenance_class!=='speculation'||seed.support_confidence!=='unsupported'||
    !Array.isArray(seed.non_claims)||JSON.stringify(seed.non_claims)!==JSON.stringify(NONCLAIMS))
  throw Error('QUESTION_SEED_AUTHORITY_BOUNDARY');
 if(seed.typing_basis==='fallback'&&seed.relation_kind!=='madd-clown'||
    seed.typing_basis==='structural'&&seed.relation_kind==='madd-clown')
  throw Error('QUESTION_SEED_FALSE_EVIDENCE');
 return true;
}
export function fromMementoHeldSeed(seed){
 validateMementoQuestionSeed(seed);
 // Crucial: receipt is a verifiable occurrence coordinate, NOT the original source.
 // Do not populate source_locator from crossing/receipt, or Question Box will skip
 // the missing original-source aperture and accidentally promote evidence.
 const clue='A later MEMENTO Crazy Slots arrangement placed two redacted source slots adjacent ('+
   seed.relation_kind+'; '+seed.typing_basis+').';
 const question_receipt=buildQuestionFrontier({
  clue,claim:'',
  provenance_class:'speculation',support_confidence:'unsupported',
  source_locator:'',source_families:[],chronology:'',
  counterevidence:'',falsifier:'',competing_explanations:[]
 });
 if(question_receipt.aperture.id!=='source-object'||Object.hasOwn(question_receipt,'answer')||
    Object.hasOwn(question_receipt,'conclusion'))throw Error('QUESTION_BOX_PREMATURE_ANSWER');
 return {
  schema:'national-treasure.memento-question-handoff/v0',
  crossing_id:seed.crossing_id,
  hold_receipt_id:seed.hold_receipt_id,
  receipt_verification:'NOT_PERFORMED_BY_QUESTION_BOX',
  original_source_recovery:'NOT_ESTABLISHED',
  authority:'none',
  admission:'none',
  question_receipt
 };
}
export {NONCLAIMS as MEMENTO_HOLD_NONCLAIMS};
