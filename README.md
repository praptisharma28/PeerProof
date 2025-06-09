## 🚀 PeerProof

> **A trust-first peer-to-peer marketplace for secondhand goods, powered by Solana.**
> Build reputation, trade securely, and mint your success — one deal at a time.

<p align="center">
  <img src="https://github.com/user-attachments/assets/3cc4434b-52a2-4555-a118-cb3ebf82d0da" alt="Screenshot 1" width="800"/>
  <img src="https://github.com/user-attachments/assets/e0a4bf2b-1576-4213-92ab-a58c7369e027" alt="Screenshot 2" width="800"/>
  <img src="https://github.com/user-attachments/assets/cc16088d-bc31-4728-9a16-8d236490aaad" alt="Screenshot 3" width="800"/>
  <img src="https://github.com/user-attachments/assets/5aa5e6f4-64a4-46b7-8465-b8f6a31b991f" alt="Screenshot 4" width="800"/>
  <img src="https://github.com/user-attachments/assets/38e8a066-1a32-43b1-99d6-13cb45331b24" alt="Screenshot 5" width="800"/>
</p

🌐 **Live Demo:** [peer-proof.vercel.app](https://peer-proof.vercel.app/) (currently mockdata used)
📦 **Backend:** FastAPI + MongoDB Atlas
💸 **Payments:** Solana Pay + Phantom Wallet
🔒 **Trust Layer:** On-chain NFT badges for successful buyers/sellers

---

## 🔍 Features

* 🛍 **List and browse secondhand items** (fashion, books, gadgets, etc.)
* 🔐 **Login via Phantom wallet** with message signature verification
* ⚖️ **Auto-escrow** when buyer initiates a purchase
* 💸 **Pay securely** with Solana Pay QR codes
* 🪪 **On-chain reputation badges** after successful trades
* 📄 **Track history** of purchases, sales, and trust scores

---

## 🧠 How It Works

| Step| Action                                               |
| --- | ---------------------------------------------------- |
| 1️⃣  | User logs in using Phantom Wallet (message signing)  |
| 2️⃣  | Seller lists an item with image, price, description  |
| 3️⃣  | Buyer clicks "Buy", triggers escrow + Solana Pay QR  |
| 4️⃣  | Backend verifies payment, confirms delivery          |
| 5️⃣  | NFT badges minted for both parties as proof-of-trust |

---

## 🏗 Tech Stack

| Layer    | Tools                                     |
| -------- | ----------------------------------------- |
| Frontend | React, TailwindCSS, Vercel                |
| Backend  | FastAPI, MongoDB Atlas, PyNaCl, Pydantic  |
| Wallet   | Phantom, Solana Web3.js                   |
| Payments | Solana Pay                                |
| Infra    | REST API, JWT-ready, Cross-Origin enabled |

---

## 🛠 Setup Guide (Backend)

### 1. Clone this repo

```bash
git clone https://github.com/praptisharma28/peerproof-backend.git
cd peerproof-backend
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add `.env` file

```env
MONGO_URI=mongodb+srv://name:name@123@name.70mjbna.mongodb.net/?retryWrites=true&w=majority&appName=name
```

### 5. Run server

```bash
uvicorn app.main:app --reload
```

Now the backend is running on `http://localhost:8000`.

---

## 🧬 Future Plans

* NFT badge minting on-chain (via Metaplex or Candy Machine)
* Telegram integration for ultra-fast trade flow
* AI image classification (prevent scam/unsafe goods)

---

## 👨‍💻 Built With

Made with ❤️ by [Prapti Sharma](https://github.com/praptisharma) and [Gamandeep Singh](https://github.com/gamandeepsingh) for Web3 community!
