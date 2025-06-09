from nacl.signing import VerifyKey
import base58

def verify_phantom_signature(wallet_address: str, message: str, signature: str):
    try:
        public_key_bytes = base58.b58decode(wallet_address)
        signature_bytes = base58.b58decode(signature)
        verify_key = VerifyKey(public_key_bytes)
        verify_key.verify(message.encode(), signature_bytes)
        return True
    except Exception as e:
        print("Signature verification failed:", e)
        return False
