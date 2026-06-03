from __future__ import annotations

from dataclasses import dataclass
import os

import jwt
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

from app.security import (
    TokenConfig,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


@dataclass(frozen=True)
class UserRecord:
    username: str
    hashed_password: str


class LoginRequest(BaseModel):
    username: str = Field(..., examples=["admin"])
    password: str = Field(..., examples=["admin123"])


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 300


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 300


token_config = TokenConfig(
    secret_key=os.getenv(
        "JWT_SECRET_KEY",
        "change-me-in-production-with-32-plus-bytes",
    )
)
admin_user = UserRecord(username="admin", hashed_password=hash_password("admin123"))

app = FastAPI(
    title="JWT Demo API",
    version="0.1.0",
    description="Simple FastAPI application that issues and refreshes JWT tokens.",
)


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/token", response_model=TokenResponse, tags=["auth"])
def login(payload: LoginRequest) -> TokenResponse:
    if payload.username != admin_user.username or not verify_password(
        payload.password, admin_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return TokenResponse(
        access_token=create_access_token(admin_user.username, token_config),
        refresh_token=create_refresh_token(admin_user.username, token_config),
        expires_in=token_config.access_token_expire_seconds,
    )


@app.post("/auth/refresh", response_model=AccessTokenResponse, tags=["auth"])
def refresh_token(payload: RefreshRequest) -> AccessTokenResponse:
    try:
        claims = decode_token(payload.refresh_token, token_config)
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from exc

    if claims.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not a refresh token",
        )

    subject = claims.get("sub")
    if subject != admin_user.username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token subject is not recognized",
        )

    return AccessTokenResponse(
        access_token=create_access_token(subject, token_config),
        expires_in=token_config.access_token_expire_seconds,
    )