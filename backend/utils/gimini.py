import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
GIMINI_API_KEY = os.getenv("GIMINI_API_KEY")
MODEL = "gemini-2.0-flash"

client = None
if GIMINI_API_KEY:
    client = genai.Client(api_key=GIMINI_API_KEY)


def generate_email_from_prompt(prompt: str) -> dict:
    """
    Returns:
        dict: {"subject": str, "body": str}
    """
    if client is None:
        raise RuntimeError("GIMINI_API_KEY is not set.")

    system_prompt = (
        "You are a helpful assistant that outputs ONLY valid JSON with two keys: subject and body. "
        "The body must be a richly formatted HTML string suitable for Quill editor and that displays well in Gmail. "
        "Output ONLY the JSON object, no extra text.\n\n"
        "dont add any url by own"
        f"Create an email for this prompt:\n\n{prompt}\n\n"
        "Respond exactly as JSON with keys: subject, body"
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=(system_prompt,),
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0)  # disables 'thinking' mode
        ),
    )

    text = response.text.strip()

    # Attempt to clean code block markers if present
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    # Parse JSON safely
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        # fallback: return plain
        parsed = {"subject": "Generated Email", "body": text}

    subject = parsed.get("subject", "Generated Email")
    body = parsed.get("body", text)

    return {"subject": subject, "body": body}
