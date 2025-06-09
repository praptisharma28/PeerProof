# 🧾 PeerProof

> **A Trustless, Escrow-Powered Peer-to-Peer Marketplace**
> Built on **Solana**, backed by **MongoDB Atlas**, and secured through **wallet-based identity** & **on-chain NFT reputation badges**.

Live Frontend: [peer-proof.vercel.app](https://peer-proof.vercel.app)

---

## 🔥 Features

* ✅ Wallet-based login via Phantom (no signup)
* 🔐 Escrow-based P2P transactions
* 🛡 On-chain reputation NFTs for trustless trading
* 💬 Fast, modern UI for buyers/sellers
* 🪙 Solana Pay flow (signature-based)
* 📦 MongoDB Atlas for scalable data backend

---

## 🖼 Demo Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/3cc4434b-52a2-4555-a118-cb3ebf82d0da" width="600"/>
  <img src="https://github.com/user-attachments/assets/e0a4bf2b-1576-4213-92ab-a58c7369e027" width="600"/>
  <img src="https://github.com/user-attachments/assets/cc16088d-bc31-4728-9a16-8d236490aaad" width="600"/>
  <img src="https://github.com/user-attachments/assets/5aa5e6f4-64a4-46b7-8465-b8f6a31b991f" width="600"/>
  <img src="https://github.com/user-attachments/assets/38e8a066-1a32-43b1-99d6-13cb45331b24" width="600"/>
</p>

---

## 🧠 How It Works

1. Users log in with Phantom wallet (Solana)
2. They create listings for secondhand items
3. Buyers send funds to escrow (Solana Pay)
4. Sellers mark as delivered, buyer confirms
5. Escrow is released, NFT badges minted for both

---

## 🧱 Tech Stack

| Layer       | Technology                    |
| ----------- | ----------------------------- |
| Frontend    | Next.js (Deployed via Vercel) |
| Backend     | FastAPI (Python)              |
| DB          | MongoDB Atlas                 |
| Wallet Auth | Phantom Wallet                |
| Payments    | Solana Pay                    |
| Infra       | Dockerized backend            |

---

## 🧪 Local Development

### 🔧 Prerequisites

* Python 3.10+
* Docker & Docker Compose (optional)
* MongoDB Atlas URI

### 🔑 Setup `.env`

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://name:name@123@name.70mjbna.mongodb.net/?retryWrites=true&w=majority&appName=name
```

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
---

## 🚀 Running with Docker

### 1. Build the Docker Image

```bash
docker build -t peerproof-backend .
```

### 2. Run the Container

```bash
docker run -d -p 8000:8000 --env-file .env peerproof-backend
```

Now open your browser at:
👉 `http://localhost:8000/docs`

## 💜 Built with Love by

**[Prapti](https://github.com/praptisharma) & [Gamandeep](https://github.com/gamandeepsingh) for Web3 community!**

> For Solana, for the people — and for trustless commerce.
