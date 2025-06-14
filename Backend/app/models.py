from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    wallet_address: str
    display_name: Optional[str] = "User"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Listing(BaseModel):
    title: str
    description: str
    price: float
    image_url: Optional[str]
    seller_wallet: str
    status: str = "open"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Escrow(BaseModel):
    listing_id: str
    buyer_wallet: str
    seller_wallet: str
    status: str = "pending"
    tx_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    amount: Optional[float] = None 

class Badge(BaseModel):
    user_wallet: str
    type: str  # "buyer" or "seller"
    metadata: dict
    minted_at: datetime = Field(default_factory=datetime.utcnow)
