from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from app.database import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS = {}
LISTINGS = {}
ESCROWS = {}
NFT_BADGES = {}

class User(BaseModel):
    wallet_address: str
    display_name: Optional[str] = "User"
    created_at: datetime = datetime.utcnow()

class Listing(BaseModel):
    id: str
    seller_wallet: str
    title: str
    description: str
    price: float
    image_url: Optional[str]
    status: str = "open"
    created_at: datetime = datetime.utcnow()

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    image_url: Optional[str]
    seller_wallet: str

class Escrow(BaseModel):
    id: str
    listing_id: str
    buyer_wallet: str
    seller_wallet: str
    status: str = "pending"
    tx_hash: Optional[str] = None
    created_at: datetime = datetime.utcnow()

class Badge(BaseModel):
    id: str
    user_wallet: str
    type: str
    metadata: dict
    minted_at: datetime = datetime.utcnow()

@app.get("/")
async def root():
    collections = await db.list_collection_names()
    return {"msg": "Connected to MongoDB!", "collections": collections}
 
@app.post("/auth/login")
async def login(user: User):
    existing = await db.users.find_one({"wallet_address": user.wallet_address})
    if not existing:
        await db.users.insert_one(user.dict())
    return {"msg": "Login successful", "user": user}

@app.get("/listings", response_model=List[Listing])
def get_listings():
    return list(LISTINGS.values())

@app.get("/listings/{listing_id}", response_model=Listing)
def get_listing(listing_id: str):
    if listing_id not in LISTINGS:
        raise HTTPException(status_code=404, detail="Listing not found")
    return LISTINGS[listing_id]

@app.post("/listings", response_model=Listing)
def create_listing(listing: ListingCreate):
    listing_id = str(uuid4())
    new_listing = Listing(id=listing_id, **listing.dict())
    LISTINGS[listing_id] = new_listing
    return new_listing

@app.get("/my-listings/{wallet_address}", response_model=List[Listing])
def get_my_listings(wallet_address: str):
    return [l for l in LISTINGS.values() if l.seller_wallet == wallet_address]

@app.post("/buy/{listing_id}", response_model=Escrow)
def buy_listing(listing_id: str, buyer_wallet: str):
    if listing_id not in LISTINGS:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing = LISTINGS[listing_id]
    if listing.status != "open":
        raise HTTPException(status_code=400, detail="Item already sold")
    escrow_id = str(uuid4())
    new_escrow = Escrow(
        id=escrow_id,
        listing_id=listing_id,
        buyer_wallet=buyer_wallet,
        seller_wallet=listing.seller_wallet
    )
    ESCROWS[escrow_id] = new_escrow
    listing.status = "escrow"
    return new_escrow

@app.get("/my-purchases/{wallet_address}", response_model=List[Escrow])
def get_my_purchases(wallet_address: str):
    return [e for e in ESCROWS.values() if e.buyer_wallet == wallet_address]

@app.get("/escrow/{escrow_id}", response_model=Escrow)
def get_escrow(escrow_id: str):
    if escrow_id not in ESCROWS:
        raise HTTPException(status_code=404, detail="Escrow not found")
    return ESCROWS[escrow_id]

@app.post("/confirm/{escrow_id}")
def confirm_delivery(escrow_id: str, confirmer_wallet: str):
    if escrow_id not in ESCROWS:
        raise HTTPException(status_code=404, detail="Escrow not found")
    escrow = ESCROWS[escrow_id]
    escrow.s
