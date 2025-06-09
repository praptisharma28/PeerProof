from urllib.parse import urlencode
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from solders.signature import Signature
from datetime import datetime, timedelta

def generate_solana_pay_url(seller_wallet: str, amount: float, escrow_id: str):
    base = f"solana:{seller_wallet}"
    params = {
        "amount": amount,
        "reference": escrow_id,
        "label": "PeerProof",
        "message": "Payment for secondhand item",
    }
    return f"{base}?{urlencode(params)}"

async def verify_transaction(reference_id: str, seller_wallet: str):
    client = AsyncClient("https://api.mainnet-beta.solana.com")

    now = datetime.utcnow()
    time_range = int((now - timedelta(minutes=5)).timestamp())

    sigs = await client.get_signatures_for_address(Pubkey.from_string(seller_wallet), limit=20)
    for sig in sigs.value:
        tx = await client.get_transaction(Signature.from_string(sig.signature), max_supported_transaction_version=0)
        if tx and reference_id in str(tx.value):
            return True
    return False
