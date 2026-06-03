from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@dataclass(frozen=True)
class TokenConfig:
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_seconds: int = 300
    refresh_token_expire_seconds: int = 3600


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _build_token(
    *,
    subject: str,
    token_type: str,
    expires_in_seconds: int,
    config: TokenConfig,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + timedelta(seconds=expires_in_seconds),
    }
    return jwt.encode(payload, config.secret_key, algorithm=config.algorithm)


def create_access_token(subject: str, config: TokenConfig) -> str:
    return _build_token(
        subject=subject,
        token_type="access",
        expires_in_seconds=config.access_token_expire_seconds,
        config=config,
    )


def create_refresh_token(subject: str, config: TokenConfig) -> str:
    return _build_token(
        subject=subject,
        token_type="refresh",
        expires_in_seconds=config.refresh_token_expire_seconds,
        config=config,
    )


def decode_token(token: str, config: TokenConfig) -> dict[str, Any]:
    return jwt.decode(token, config.secret_key, algorithms=[config.algorithm])