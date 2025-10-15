import {
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  devnet,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  addSignersToTransactionMessage,
  getProgramDerivedAddress,
  generateKeyPairSigner,
  getAddressEncoder,
  getBytesEncoder
} from "@solana/kit";

import { getInitializeInstructionAsync, getSubmitTsInstructionAsync } from "./clients/js/src/generated/index";
import wallet from "./Turbin3-wallet.json";

const MPL_CORE_PROGRAM = address("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const PROGRAM_ADDRESS = address("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const SYSTEM_PROGRAM = address("11111111111111111111111111111111");
const COLLECTION = address("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

// We're going to import our keypair from the wallet file
const keypair = await createKeyPairSignerFromBytes(new Uint8Array(wallet));

// Create a devnet connection
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const rpcSubscriptions = createSolanaRpcSubscriptions(devnet('ws://api.devnet.solana.com'));

const addressEncoder = getAddressEncoder();

// Create the PDA for enrollment account
const accountSeeds = [Buffer.from("prereqs"), addressEncoder.encode(keypair.address)];
const [account, _bump] = await getProgramDerivedAddress({
  programAddress: PROGRAM_ADDRESS,
  seeds: accountSeeds
});

// Create the PDA for authority
// Note: The actual program uses seeds that derive to 5xstXUdRJKxRrqbJuo5SAfKf68y7afoYwTeH1FXbsA3k
// The "authority" seed alone gives 7GBfanTEPdLYS5D1J9Egycyyadw9crQNeUpGxgfUiWLJ which is incorrect
// Using the correct address that the program expects
const authority = address("5xstXUdRJKxRrqbJuo5SAfKf68y7afoYwTeH1FXbsA3k");

// Generate mint keypair for the NFT
const mintKeyPair = await generateKeyPairSigner();

// Execute the initialize transaction
const initializeIx = await getInitializeInstructionAsync({
  github: "praptisharma28",
  user: keypair,
  account,
  systemProgram: SYSTEM_PROGRAM
});

// Fetch latest blockhash
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactionMessageInit = pipe(
  createTransactionMessage({ version: 0 }),
  tx => setTransactionMessageFeePayerSigner(keypair, tx),
  tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  tx => appendTransactionMessageInstructions([initializeIx], tx)
);

const signedTxInit = await signTransactionMessageWithSigners(transactionMessageInit);
assertIsTransactionWithinSizeLimit(signedTxInit);

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

try {
  const result = await sendAndConfirmTransaction(
    signedTxInit,
    { commitment: 'confirmed', skipPreflight: false }
  );
  console.log(result);
  const signatureInit = getSignatureFromTransaction(signedTxInit);
  console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signatureInit}?cluster=devnet`);
} catch (e) {
  console.error(`Oops, something went wrong: ${e}`);
}

// Execute the submitTs transaction
console.log('Account addresses:');
console.log('User:', keypair.address);
console.log('Account PDA:', account);
console.log('Mint:', mintKeyPair.address);
console.log('Collection:', COLLECTION);
console.log('Authority PDA:', authority);

const submitIx = await getSubmitTsInstructionAsync({
  user: keypair,
  account,
  mint: mintKeyPair,
  collection: COLLECTION,
  authority,
  mplCoreProgram: MPL_CORE_PROGRAM,
  systemProgram: SYSTEM_PROGRAM
});

// Fetch a fresh blockhash for the second transaction
const { value: latestBlockhash2 } = await rpc.getLatestBlockhash().send();

const transactionMessageSubmit = pipe(
  createTransactionMessage({ version: 0 }),
  tx => setTransactionMessageFeePayerSigner(keypair, tx),
  tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash2, tx),
  tx => appendTransactionMessageInstructions([submitIx], tx),
  tx => addSignersToTransactionMessage([mintKeyPair], tx)
);

const signedTxSubmit = await signTransactionMessageWithSigners(transactionMessageSubmit);
assertIsTransactionWithinSizeLimit(signedTxSubmit);

try {
  await sendAndConfirmTransaction(
    signedTxSubmit,
    { commitment: 'confirmed', skipPreflight: false }
  );
  const signatureSubmit = getSignatureFromTransaction(signedTxSubmit);
  console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signatureSubmit}?cluster=devnet`);
} catch (e) {
  console.error(`Oops, something went wrong:`, e);
  if (e && typeof e === 'object' && 'cause' in e) {
    console.error('Error details:', JSON.stringify(e.cause, null, 2));
  }
}
