from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, listings, escrows, profile
from app.solana_wallet import verify_phantom_signature
from app.solana_pay import generate_solana_pay_url, verify_transaction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(escrows.router)
app.include_router(profile.router)

@app.get("/")
def home():
    return {"msg": "PeerProof API up & running!"}

@app.post("/generate-pay-url/{listing_id}")
def get_pay_url(listing_id: str, buyer_wallet: str):
    if listing_id not in LISTINGS:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing = LISTINGS[listing_id]
    url = generate_solana_pay_url(listing.seller_wallet, listing.price, listing_id)
    return {"pay_url": url}

@app.post("/verify-payment/{listing_id}")
async def verify_payment(listing_id: str):
    if listing_id not in LISTINGS:
        raise HTTPException(status_code=404, detail="Listing not found")
    seller_wallet = LISTINGS[listing_id].seller_wallet
    valid = await verify_transaction(reference_id=listing_id, seller_wallet=seller_wallet)
    return {"verified": valid}
