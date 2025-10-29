# 🧱 BlockDare — On-Chain Challenge Tracker

**BlockDare** is a decentralized application (dApp) that lets users create, track, and complete personal or public challenges directly on the blockchain — ensuring transparency, immutability, and fair play.  

Built with **Solidity**, **Ethereum**, and a focus on simplicity for beginner developers.

---
<img width="1911" height="1010" alt="Screenshot 2025-10-29 140931" src="https://github.com/user-attachments/assets/cc7bde5f-d0b6-4d7c-a823-137074e696a7" />

## ✨ Features

- 🔒 **Immutable Records:** All challenges are stored permanently on-chain.  
- 🧑‍🤝‍🧑 **Fair & Transparent:** Every challenge is tied to its creator’s wallet.  
- ✅ **Completion Tracking:** Only the creator can mark a challenge as completed.  
- 📜 **Event Logging:** Creation and completion events are emitted for off-chain tracking.  
- 💡 **Beginner-Friendly:** Clean Solidity code with helpful comments.

---

## 🧠 How It Works

1. **Create a Challenge**  
   Submit a short title and description.  
   The contract records your challenge with a timestamp and creator address.

2. **View Challenges**  
   Anyone can view all challenges on-chain or query by ID.

3. **Complete a Challenge**  
   Only the challenge creator can mark it as completed.

---

## 🧩 Smart Contract

**Language:** Solidity `^0.8.0`  
**License:** MIT  
**File:** `BlockDare.sol`

### Key Functions

| Function | Description |
|-----------|--------------|
| `createChallenge(string _title, string _description)` | Create a new challenge and store it permanently. |
| `completeChallenge(uint256 _id)` | Mark a challenge as completed (only creator can call). |
| `getChallenge(uint256 _id)` | Fetch challenge details by ID. |
| `getTotalChallenges()` | Returns total number of challenges created. |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm  
- [Hardhat](https://hardhat.org/) or [Remix IDE](https://remix.ethereum.org/)  
- MetaMask or any Web3 wallet  

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blockdare.git

# Enter the project directory
cd blockdare

# Install dependencies (if using Hardhat)
npm install

