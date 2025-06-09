from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, listings, escrows, profile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(escrows.router)
app.include_router(profile.router)

@app.get("/")
def home():
    return {"msg": "PeerProof API up & running!"}
