from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import Escrow, Badge
from uuid import uuid4

router = APIRouter()

@router.post("/buy/{listing_id}")
async def buy_listing(listing_id: str, buyer_wallet: str):
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

    return escrow_doc

@router.post("/confirm/{escrow_id}")
async def confirm_delivery(escrow_id: str):
    escrow = await db.escrows.find_one({"id": escrow_id})
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    await db.escrows.update_one({"id": escrow_id}, {"$set": {"status": "completed"}})
    await db.listings.update_one({"id": escrow["listing_id"]}, {"$set": {"status": "sold"}})

    buyer_badge = Badge(user_wallet=escrow["buyer_wallet"], type="buyer", metadata={"listing_id": escrow["listing_id"]})
    seller_badge = Badge(user_wallet=escrow["seller_wallet"], type="seller", metadata={"listing_id": escrow["listing_id"]})

    await db.badges.insert_many([buyer_badge.dict(), seller_badge.dict()])
    return {"msg": "Confirmed & NFT Badges minted"}
