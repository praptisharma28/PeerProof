from fastapi import APIRouter, HTTPException
from app.database import db
from typing import List, Dict, Any
import traceback

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

@router.get("/profile/{wallet}")
async def get_profile(wallet: str):
    try:
        print(f"Fetching profile for wallet: {wallet}")
        
        # Check if badges collection exists and get badges
        badges = []
        try:
            cursor = db.badges.find({"user_wallet": wallet})
            badges = await cursor.to_list(100)
            badges = [serialize_doc(badge) for badge in badges]
            print(f"Found {len(badges)} badges for wallet {wallet}")
        except Exception as badge_error:
            print(f"Error fetching badges: {badge_error}")
            # Continue with empty badges list
            badges = []
        
        # Get completed escrows for this user (both as buyer and seller)
        completed_escrows = []
        try:
            # As buyer
            buyer_cursor = db.escrows.find({
                "buyer_wallet": wallet,
                "status": "completed"
            })
            buyer_escrows = await buyer_cursor.to_list(100)
            
            # As seller
            seller_cursor = db.escrows.find({
                "seller_wallet": wallet,
                "status": "completed"
            })
            seller_escrows = await seller_cursor.to_list(100)
            
            completed_escrows = buyer_escrows + seller_escrows
            completed_escrows = [serialize_doc(escrow) for escrow in completed_escrows]
            print(f"Found {len(completed_escrows)} completed escrows for wallet {wallet}")
            
        except Exception as escrow_error:
            print(f"Error fetching escrows: {escrow_error}")
            completed_escrows = []
        
        # Get user's listings
        user_listings = []
        try:
            listings_cursor = db.listings.find({"seller_wallet": wallet})
            user_listings = await listings_cursor.to_list(100)
            user_listings = [serialize_doc(listing) for listing in user_listings]
            print(f"Found {len(user_listings)} listings for wallet {wallet}")
        except Exception as listings_error:
            print(f"Error fetching listings: {listings_error}")
            user_listings = []
        
        # Calculate stats
        total_trades = len(completed_escrows)
        buyer_trades = len([e for e in completed_escrows if e.get("buyer_wallet") == wallet])
        seller_trades = len([e for e in completed_escrows if e.get("seller_wallet") == wallet])
        
        profile_data = {
            "wallet": wallet,
            "completed_trades": total_trades,
            "buyer_trades": buyer_trades,
            "seller_trades": seller_trades,
            "total_listings": len(user_listings),
            "badges": badges,
            "recent_activity": completed_escrows[:10],  # Last 10 completed trades
            "active_listings": [l for l in user_listings if l.get("status") == "open"]
        }
        
        print(f"Returning profile data: {profile_data}")
        return profile_data
        
    except Exception as e:
        print(f"Error in get_profile: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch profile: {str(e)}"
        )

@router.post("/profile/{wallet}/init")
async def initialize_profile(wallet: str):
    """Initialize profile data for a wallet - useful for testing"""
    try:
        # Check if badges collection exists, create if not
        collections = await db.list_collection_names()
        if 'badges' not in collections:
            await db.create_collection('badges')
            print("Created badges collection")
        
        return {
            "message": f"Profile initialized for {wallet}",
            "collections": await db.list_collection_names()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))