# Add this to your existing routes file or create a new purchases.py file
from fastapi import APIRouter, HTTPException
from app.database import db
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

@router.get("/purchases/{wallet_address}")
async def get_user_purchases(wallet_address: str):
    """Get all purchases for a specific user"""
    try:
        # Find all escrows where this wallet is the buyer
        escrows_cursor = db.escrows.find({"buyer_wallet": wallet_address})
        escrows = await escrows_cursor.to_list(100)
        
        purchases = []
        
        for escrow in escrows:
            # Get the corresponding listing details
            listing = await db.listings.find_one({"id": escrow["listing_id"]})
            
            if listing:
                purchase = {
                    "id": escrow.get("id", str(escrow.get("_id", ""))),
                    "title": listing.get("title", "Unknown Item"),
                    "price": listing.get("price", 0),
                    "status": escrow.get("status", "pending"),
                    "date": escrow.get("created_at", ""),
                    "escrow_id": escrow.get("id", str(escrow.get("_id", ""))),
                    "image_url": listing.get("image_url", ""),
                    "listing_id": listing.get("id", ""),
                    "seller_wallet": listing.get("seller_wallet", ""),
                    "description": listing.get("description", "")
                }
                purchases.append(purchase)
        
        # Sort by date (newest first)
        purchases.sort(key=lambda x: x["date"], reverse=True)
        
        return purchases
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching purchases: {str(e)}")

@router.get("/escrow/{escrow_id}")
async def get_escrow_details(escrow_id: str):
    """Get detailed escrow information"""
    try:
        escrow = await db.escrows.find_one({"id": escrow_id})
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow not found")
        
        # Get the corresponding listing
        listing = await db.listings.find_one({"id": escrow["listing_id"]})
        
        result = serialize_doc(escrow)
        if listing:
            result["listing"] = serialize_doc(listing)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching escrow details: {str(e)}")