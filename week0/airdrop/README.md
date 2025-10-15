# Turbin3 Enrollment Prerequisites - TypeScript

This project contains all the scripts needed to complete the Turbin3 enrollment prerequisites using TypeScript.

## Project Structure

```
airdrop/
├── keygen.ts              # Generate a new Solana keypair
├── airdrop.ts            # Request devnet SOL airdrop
├── transfer.ts           # Transfer SOL to Turbin3 wallet
├── enroll.ts             # Enrollment script (initialize + submitTs)
├── dev-wallet.json       # Generated dev wallet (gitignored)
├── Turbin3-wallet.json   # Your Turbin3 wallet (REPLACE THIS!)
├── TS_Client_Logic.md    # Answer to the TypeScript question
├── programs/
│   └── Turbin3_prereq.json  # IDL for the enrollment program
├── scripts/
│   └── generate-client.ts   # Client code generator
└── clients/
    └── js/src/generated/    # Auto-generated client code
```

## Setup Complete ✓

All dependencies have been installed and scripts have been created.

## Important: Next Steps

### 1. Replace Your Turbin3 Wallet

**CRITICAL:** The file `Turbin3-wallet.json` currently contains a placeholder wallet. You MUST replace it with your actual Turbin3 wallet private key array that you used in your application.

Open `Turbin3-wallet.json` and replace the contents with your actual wallet bytes (format: `[1,2,3,...,64]`)

### 2. Update Your GitHub Username

In `enroll.ts` on line 60, replace `"your_github_username"` with your actual GitHub username that you used in your Turbin3 application.

```typescript
const initializeIx = await getInitializeInstructionAsync({
  github: "your_github_username",  // <- CHANGE THIS
  user: keypair,
  account,
  systemProgram: SYSTEM_PROGRAM
});
```

### 3. Verify Turbin3 Wallet Address in transfer.ts

In `transfer.ts` on line 27, make sure the Turbin3 wallet address matches the one you used in your application. The current address is:
```
E7xuUu76d3aza4PKAw1t6RnMJho4HFoRAKeUAjJhPbUt
```

If this is not your wallet address, change it to your actual Turbin3 wallet address.

## Running the Scripts

### What Has Been Completed:

1. ✓ Generated a development wallet: `12rTQS7JfCxLuo378QgjQWfJ8zBr6qi9hwUcC1kLBtwz`
2. ✓ Airdropped 2 devnet SOL to dev wallet
3. ✓ Transferred all SOL from dev wallet to Turbin3 wallet
4. ✓ Generated client code from IDL using Codama

### What You Need to Run:

Once you've updated the Turbin3-wallet.json and your GitHub username:

```bash
# Run the enrollment script (initialize instruction)
yarn enroll
```

**Note:** The enroll.ts script contains both the `initialize` and `submitTs` transactions. According to the instructions, you may want to run them separately. You can comment out one of them while testing:

- Comment out lines 90-125 to run only `initialize`
- Comment out lines 58-88 to run only `submitTs` (after initialize succeeds)

## Understanding the Code

### Key Concepts Learned:

1. **Keypair Generation**: Using Web Crypto API to generate Ed25519 keypairs
2. **Airdrops**: Using Solana's airdrop factory on devnet
3. **Transfers**: Creating and signing transfer instructions
4. **Fee Calculation**: Computing exact fees to empty an account
5. **PDAs (Program Derived Addresses)**: Creating deterministic addresses for program accounts
6. **IDL Client Generation**: Using Codama to generate TypeScript clients from Anchor IDLs
7. **Transaction Building**: Using the pipe pattern to build complex transactions
8. **Multiple Signers**: Adding additional signers (mint keypair) to transactions

### Important Files:

- **IDL**: `programs/Turbin3_prereq.json` - Defines the on-chain program interface
- **Generated Client**: `clients/js/src/generated/` - Auto-generated code from IDL
- **Enrollment Logic**: `enroll.ts` - Main enrollment script with PDAs and instructions

## Troubleshooting

### Common Issues:

1. **"Insufficient balance" error**: Make sure you've run the airdrop and transfer scripts first, and that your Turbin3 wallet has devnet SOL.

2. **"Account already exists" error when running initialize**: The initialize instruction can only be run once per wallet. If you get this error, comment out the initialize section and run only submitTs.

3. **Import errors**: Make sure you've run `yarn generate-client` to create the client code from the IDL.

4. **Transaction fails with missing account**: The assignment hints that there's a missing account in one of the instructions. The authority PDA has been added to the enroll.ts script (line 50-54).

## Assignment Completion

Once you successfully run both transactions (initialize and submitTs):

1. You will receive transaction signatures
2. Check them on Solana Explorer (devnet)
3. You should receive an NFT proving your completion
4. The TS_Client_Logic.md file contains your written answer about TypeScript

## Security Notes

- All `*wallet.json` files are gitignored
- Never commit your private keys to git
- These are devnet wallets with no real value, but practice good security habits

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Codama Documentation](https://github.com/codama-idl/codama)

Good luck with your enrollment! 🚀
