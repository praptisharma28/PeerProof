from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import Listing
from uuid import uuid4

router = APIRouter()

@router.post("/listings")
async def create_listing(listing: Listing):
    listing_id = str(uuid4())
    doc = listing.dict()
    doc["id"] = listing_id
    await db.listings.insert_one(doc)
    return doc

@router.get("/listings")
async def get_all_listings():
    listings = await db.listings.find().to_list(100)
    return listings

@router.get("/listings/{wallet_address}")
async def get_my_listings(wallet_address: str):
    listings = await db.listings.find({"seller_wallet": wallet_address}).to_list(100)
    return listings
