from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import db
from app.models import Escrow, Badge
from uuid import uuid4

router = APIRouter()

# Create a Pydantic model for the request body
class BuyListingRequest(BaseModel):
    buyer_wallet: str

@router.post("/buy/{listing_id}")
async def buy_listing(listing_id: str, request: BuyListingRequest):
    print(f"Buy request: listing_id={listing_id}, buyer={request.buyer_wallet}")
    try:
        buyer_wallet = request.buyer_wallet
        
        listing = await db.listings.find_one({"id": listing_id})
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        if listing["status"] != "open":
            raise HTTPException(status_code=400, detail="Already sold")

        escrow = Escrow(
            listing_id=listing_id,
            buyer_wallet=buyer_wallet,
            seller_wallet=listing["seller_wallet"]
        )
        escrow_doc = escrow.dict()
        escrow_doc["id"] = str(uuid4())
        
        await db.escrows.insert_one(escrow_doc)
        await db.listings.update_one({"id": listing_id}, {"$set": {"status": "escrow"}})
        
        # Return only the fields frontend needs
        return {
            "id": escrow_doc["id"],
            "listing_id": escrow_doc["listing_id"],
            "buyer_wallet": escrow_doc["buyer_wallet"],
            "seller_wallet": escrow_doc["seller_wallet"],
            "status": escrow_doc["status"],
            "created_at": escrow_doc["created_at"]
        }
    except Exception as e:
        print(f"Error in buy_listing: {e}")  # Add logging
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Also update the confirm delivery endpoint to use body data
class ConfirmDeliveryRequest(BaseModel):
    confirmer_wallet: str

@router.post("/confirm/{escrow_id}")
async def confirm_delivery(escrow_id: str, request: ConfirmDeliveryRequest):
    try:
        escrow = await db.escrows.find_one({"id": escrow_id})
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow not found")

        await db.escrows.update_one({"id": escrow_id}, {"$set": {"status": "completed"}})
        await db.listings.update_one({"id": escrow["listing_id"]}, {"$set": {"status": "sold"}})

        buyer_badge = Badge(user_wallet=escrow["buyer_wallet"], type="buyer", metadata={"listing_id": escrow["listing_id"]})
        seller_badge = Badge(user_wallet=escrow["seller_wallet"], type="seller", metadata={"listing_id": escrow["listing_id"]})

        await db.badges.insert_many([buyer_badge.dict(), seller_badge.dict()])
        return {"msg": "Confirmed & NFT Badges minted"}
    except Exception as e:
        print(f"Error in confirm_delivery: {e}")  # Add logging
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")