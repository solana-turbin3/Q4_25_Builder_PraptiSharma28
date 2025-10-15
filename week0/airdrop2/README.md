# Turbin3 Prerequisites - Rust Edition

This project is a Solana wallet toolkit built in Rust as part of the Turbin3 Builders Cohort prerequisites. It demonstrates fundamental Solana blockchain operations including keypair generation, token transfers, and on-chain program interaction.

## ⚠️ Important Notes - Assignment Inaccuracies Found & Fixed

As mentioned by the instructor, the assignment contains intentional inaccuracies that needed to be debugged:

1. **RPC URL (Line 17)**: The provided RPC URL was rate-limited/non-functional. Changed from `https://turbine-solanad-4cde.devnet.rpcpool.com/...` to `https://api.devnet.solana.com`

2. **Authority PDA Derivation (Line 200-201)**: The assignment suggested deriving authority with `@seeds("authority")`, but the actual on-chain program expects a different authority address: `5xstXUdRJKxRrqbJuo5SAfKf68y7afoYwTeH1FXbsA3k`

3. **Wallet for submit_rs (Line 180)**: Uses `turbin3-wallet.json` (your main Turbin3 wallet) instead of `dev-wallet.json` because the PDA was created with this wallet during TypeScript prerequisites.

## What This Project Does

This Rust library provides a complete set of tools for interacting with the Solana blockchain on devnet:

1. **Keypair Generation** - Creates new Solana wallets with public/private key pairs
2. **Wallet Format Conversion** - Converts between Base58 (Phantom wallet) and JSON byte array formats
3. **Devnet Airdrop** - Requests test SOL tokens from Solana devnet
4. **SOL Transfers** - Sends SOL tokens between wallets with signature verification
5. **Wallet Cleanup** - Empties devnet wallet by calculating exact fees
6. **On-chain Program Interaction** - Submits completion proof to Turbin3 enrollment program and mints an NFT

## Key Concepts

### What is Solana?
Solana is a high-performance blockchain platform. This project interacts with Solana's **devnet** (development network) where you can test transactions with fake SOL tokens.

### Important Terms:
- **Keypair**: A public key (your wallet address) + private key (proves ownership)
- **Lamports**: Smallest unit of SOL (1 SOL = 1 billion lamports)
- **PDA (Program Derived Address)**: A special address derived from seeds, used by programs to sign transactions
- **RPC**: Remote Procedure Call - how we communicate with the Solana network
- **Instruction Discriminator**: A unique 8-byte identifier for program instructions

## Setup & Installation

### Prerequisites
- Rust installed (`rustup`)
- Cargo installed

### Install Dependencies
```bash
cargo build
```

## How to Use

### 1. Generate a New Wallet
```bash
cargo test keygen -- --show-output
```
This creates a new keypair and prints the private key as a JSON array. Save this array to `dev-wallet.json` in the project root.

### 2. Convert Wallet Formats

**Base58 to Wallet File (for importing from Phantom):**
```bash
cargo test base58_to_wallet -- --nocapture
```

**Wallet File to Base58 (for exporting to Phantom):**
```bash
cargo test wallet_to_base58 -- --nocapture
```

### 3. Request Devnet Tokens
```bash
cargo test claim_airdrop -- --show-output
```
This requests 2 SOL from the devnet faucet.

### 4. Transfer SOL to Turbin3 Wallet
**Important:** Update line 98 in `src/lib.rs` with your actual Turbin3 public key before running.

```bash
cargo test transfer_sol -- --show-output
```
This transfers 0.001 SOL to your Turbin3 wallet.

### 5. Empty Your Devnet Wallet
**Important:** Update line 133 in `src/lib.rs` with your actual Turbin3 public key before running.

```bash
cargo test empty_devnet_wallet -- --show-output
```
This calculates the exact transaction fee and transfers your entire remaining balance.

### 6. Submit Turbin3 Completion Proof
```bash
cargo test submit_rs -- --show-output
```
This interacts with the Turbin3 enrollment program on-chain to:
- Create a PDA (Program Derived Address) from your wallet
- Mint an NFT as proof of completion
- Submit your completion to the program

## How It Works

### Keypair Generation (src/lib.rs:22-28)
Uses Solana SDK to generate a cryptographically secure Ed25519 keypair. The private key is 64 bytes that must be kept secret.

### Airdrop (src/lib.rs:61-78)
Connects to Solana devnet RPC and requests tokens using `request_airdrop()`. The transaction signature can be viewed on Solana Explorer.

### Transfers (src/lib.rs:81-125)
1. Loads keypair from file
2. Verifies signature capability
3. Fetches recent blockhash (required for all transactions)
4. Creates transfer instruction
5. Signs and sends transaction

### Wallet Emptying (src/lib.rs:128-177)
1. Gets current balance
2. Creates a mock transaction to calculate fees
3. Transfers `balance - fee` to leave exactly 0 lamports

### On-chain Program Interaction (src/lib.rs:180-250)
1. Derives PDA from seeds `["prereqs", your_pubkey]`
2. Derives authority PDA from seed `["authority"]`
3. Creates instruction with discriminator `[77, 124, 82, 163, 21, 133, 181, 206]`
4. Passes 7 accounts to the program (user, PDA, mint, collection, authority, mpl_core, system)
5. Signs with both signer and mint keypairs
6. Submits transaction to mint NFT proof

## Program Details

- **Turbin3 Program ID**: `TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM`
- **Collection Address**: `5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2`
- **Metaplex Core Program**: `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`
- **Network**: Solana Devnet

## Project Structure

```
airdrop2/
├── Cargo.toml          # Dependencies and project config
├── src/
│   └── lib.rs          # All functionality (8 test functions)
├── dev-wallet.json     # Your wallet (create this!)
└── README.md           # This file
```

## Important Notes

- Never share your private key (dev-wallet.json)
- This is for devnet only - devnet SOL has no real value
- You must replace `<your Turbin3 public key>` placeholders before running transfer functions
- The submit_rs function requires that you've already completed the TypeScript prerequisites (PDA must exist)

## Resources

- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Turbin3 Program IDL](https://explorer.solana.com/address/TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM/anchor-program?cluster=devnet)
- [Solana Rust SDK Docs](https://docs.rs/solana-sdk/)

## License

This is educational code for the Turbin3 Builders Cohort prerequisites.
