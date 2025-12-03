import os
import requests
from typing import Dict, Any, Tuple

RASA_URL = os.getenv("RASA_URL", "http://localhost:5005/model/parse")

def parse_message(text: str) -> Tuple[str, Dict[str, Any]]:
    try:
        resp = requests.post(RASA_URL, json={"text": text}, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        intent_name = data.get("intent", {}).get("name", "fallback")
        entities_list = data.get("entities", [])

        entities: Dict[str, Any] = {}
        for e in entities_list:
            ent_type = e.get("entity")
            ent_value = e.get("value")
            if ent_type and ent_value:
                entities[ent_type] = ent_value

        return intent_name, entities

    except Exception as e:
        print("Error calling Rasa:", e)
        return "fallback", {}
