from fastapi import APIRouter
from app.database import db
from app.models import User

router = APIRouter()

@router.post("/auth/login")
async def login(user: User):
    existing = await db.users.find_one({"wallet_address": user.wallet_address})
    if not existing:
        await db.users.insert_one(user.dict())
    return {"msg": "Login successful", "user": user}
