# backend/nlp.py
from typing import Dict, Any, List, Tuple, Optional
from sqlalchemy.orm import Session

from models import Order


def get_quick_replies(intent: str) -> List[str]:
    """
    Suggestions to show in the UI depending on last intent.
    """
    if intent == "greet":
        return ["Ask about shirts", "Check order status", "Return / exchange policy"]
    if intent == "product_info":
        return ["What sizes are available?", "Do you have black shirts?", "What is the material?"]
    if intent == "order_status":
        return ["My order status", "I want to update my address"]
    if intent == "returns":
        return ["How do I return a shirt?", "What is your refund policy?"]
    return ["Ask about shirts", "Check order status", "Return / exchange policy"]


def handle_intent(
    intent: str,
    entities: Dict[str, Any],
    db: Session,
) -> Tuple[str, Dict[str, Any]]:
    """
    Hybrid:
    - Small talk / abusive / goodbye → static responses
    - Business intents → custom logic + DB
    Returns (reply_text, payload_dict).
    """
    payload: Dict[str, Any] = {}

    # --- Chat / small-talk intents handled entirely here ---
    if intent == "greet":
        text = "Hi! 👋 I'm your shirt support assistant. I can help with product info, order status, and returns. What would you like to do?"
        return text, payload

    if intent == "abusive":
        text = "I'm here to help. Let's keep the conversation respectful. How can I assist you with your order or shirts?"
        return text, payload

    if intent == "goodbye":
        text = "Thanks for chatting with us! If you need anything else, just open the chat again. 😊"
        return text, payload

    # --- Business intents below ---

    if intent == "product_info":
        text = (
            "We sell men's and women's shirts in sizes XS–XXL. "
            "Most shirts are 100% cotton or cotton blends. "
            "What would you like to know: size, colour, or material?"
        )
        return text, payload

    if intent == "returns":
        text = (
            "Our return policy: you can return or exchange shirts within 30 days "
            "of delivery, as long as tags are intact and the shirt is unworn. "
            "Would you like steps for starting a return?"
        )
        return text, payload

    if intent == "order_status":
        order_number: Optional[str] = entities.get("order_number")
        if not order_number:
            text = "Sure! Please provide your order number (e.g., ORD12345) so I can check the status."
            return text, payload

        # Look up order in DB
        order = db.query(Order).filter(Order.order_number == order_number).first()
        if not order:
            text = f"I couldn't find order **{order_number}**. Can you check the number and try again?"
            return text, payload

        text = f"Order **{order.order_number}** is currently **{order.status}**."
        if order.estimated_delivery:
            text += f" Estimated delivery date is {order.estimated_delivery}."

        payload["order"] = {
            "order_number": order.order_number,
            "status": order.status,
            "estimated_delivery": str(order.estimated_delivery)
            if order.estimated_delivery
            else None,
        }
        return text, payload

    # --- Fallback ---
    text = (
        "I'm not sure I understood that. I can help with product information, "
        "order status, and returns. Could you rephrase or pick one of the suggestions?"
    )
    return text, payload
