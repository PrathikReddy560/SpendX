# Chat Model
# AI conversation history storage

import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, func, Enum, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class ChatRole(str, enum.Enum):
    """Chat message role."""
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(Base):
    """AI chat message history."""
    
    __tablename__ = "chat_messages"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
        comment="Groups messages in a conversation",
    )
    role: Mapped[ChatRole] = mapped_column(
        Enum(ChatRole),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    
    # Relationships
    user = relationship("User", back_populates="chat_messages")
    
    # Indexes for efficient querying
    __table_args__ = (
        Index("ix_chat_user_conversation", "user_id", "conversation_id"),
    )
    
    def __repr__(self) -> str:
        return f"<ChatMessage {self.role.value}: {self.content[:50]}...>"
