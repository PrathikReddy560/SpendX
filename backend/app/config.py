# SpendX Backend Configuration
# Pydantic settings for environment variable management

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/spendx",
        description="PostgreSQL connection string"
    )
    
    # JWT Authentication
    secret_key: str = Field(
        default="dev-secret-key-change-in-production",
        min_length=32,
        description="Secret key for JWT encoding"
    )
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    refresh_token_expire_days: int = Field(default=7)
    
    # Google Gemini AI
    gemini_api_key: str = Field(
        default="",
        description="Google Gemini API key"
    )
    
    # CORS
    cors_origins: str = Field(
        default="http://localhost:8081,http://localhost:19006",
        description="Comma-separated list of allowed origins"
    )
    
    # Environment
    environment: str = Field(default="development")
    debug: bool = Field(default=True)
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Export for easy import
settings = get_settings()
