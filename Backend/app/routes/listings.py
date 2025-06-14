from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import Listing
from uuid import uuid4
from bson import ObjectId
from typing import List, Dict, Any

router = APIRouter()

def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    
    # Convert ObjectId to string
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    
    # Handle any nested ObjectIds if they exist
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, list):
            doc[key] = [str(item) if isinstance(item, ObjectId) else item for item in value]
    
    return doc

@router.post("/listings")
async def create_listing(listing: Listing):
    listing_id = str(uuid4())
    doc = listing.dict()
    doc["id"] = listing_id
    
    # Insert and get the result
    result = await db.listings.insert_one(doc)
    
    # Fetch the inserted document and serialize it
    inserted_doc = await db.listings.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted_doc)

@router.get("/listings")
async def get_all_listings():
    cursor = db.listings.find()
    listings = await cursor.to_list(100)
    
    # Serialize all documents
    return [serialize_doc(doc) for doc in listings]

@router.get("/listings/{wallet_address}")
async def get_my_listings(wallet_address: str):
    cursor = db.listings.find({"seller_wallet": wallet_address})
    listings = await cursor.to_list(100)
    
    # Serialize all documents
    return [serialize_doc(doc) for doc in listings]