import { createHash } from 'crypto';

function computeDiscriminator(name: string): number[] {
  const preimage = `global:${name}`;
  const hash = createHash('sha256').update(preimage).digest();
  return Array.from(hash.slice(0, 8));
}

console.log('submit_ts:', computeDiscriminator('submit_ts'));
console.log('submitTs:', computeDiscriminator('submitTs'));
console.log('submitts:', computeDiscriminator('submitts'));
console.log('complete:', computeDiscriminator('complete'));
