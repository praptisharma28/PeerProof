from fastapi import APIRouter
from app.database import db

router = APIRouter()

@router.get("/profile/{wallet}")
async def get_profile(wallet: str):
    badges = await db.badges.find({"user_wallet": wallet}).to_list(100)
    return {
        "wallet": wallet,
        "completed_trades": len(badges),
        "badges": badges
    }
