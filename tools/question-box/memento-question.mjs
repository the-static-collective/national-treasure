#!/usr/bin/env node
// Explicit local read-only Question Box frontier for an already locally
// inspected redacted MEMENTO held-question seed. No sender/receiver authority.
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fromMementoHeldSeed} from './from-memento.mjs';
const argv=process.argv.slice(2);
if(argv.length!==2&&argv.length!==4){
 console.error('Usage: node tools/question-box/memento-question.mjs --input SEED.json [--output QUESTION.json]');
 process.exitCode=2;
}else{
 try{
  if(argv[0]!=='--input'||argv.length===4&&argv[2]!=='--output')throw Error('INVALID_ARGUMENTS');
  const bytes=await readFile(resolve(argv[1]));
  if(bytes.length>8192)throw Error('QUESTION_SEED_LIMIT');
  const seed=JSON.parse(bytes.toString('utf8'));
  const result=fromMementoHeldSeed(seed);
  const output=JSON.stringify(result,null,2)+'\n';
  if(argv.length===4)await writeFile(resolve(argv[3]),output,{flag:'wx',mode:0o600});
  else process.stdout.write(output);
 }catch(e){console.error('REFUSED: '+e.message);process.exitCode=1;}
}