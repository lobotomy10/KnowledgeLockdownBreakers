from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import psycopg
from .models import PersonaConfig, Message, StrategyDocument, Discussion
from .personas import PersonaManager

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

persona_manager = PersonaManager()
current_discussion: Discussion | None = None

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/personas")
async def get_personas():
    return {"personas": persona_manager.get_all_personas()}

@app.post("/personas")
async def add_persona(persona: PersonaConfig):
    persona_manager.add_persona(persona)
    return {"status": "success", "persona": persona}

@app.delete("/personas/{name}")
async def remove_persona(name: str):
    try:
        persona_manager.remove_persona(name)
        return {"status": "success"}
    except KeyError:
        raise HTTPException(status_code=404, detail="Persona not found")

@app.post("/discussion/start")
async def start_discussion(document: StrategyDocument):
    global current_discussion
    current_discussion = Discussion(strategy_document=document)
    
    # Generate first response automatically
    personas = sorted(persona_manager.get_all_personas(), key=lambda p: p.name)
    next_persona = personas[0]
    
    response = await persona_manager.generate_response(
        next_persona.name,
        current_discussion.strategy_document.content,
        []
    )
    
    message = Message(
        persona_name=next_persona.name,
        content=response,
        timestamp=datetime.now().isoformat()
    )
    current_discussion.messages.append(message)
    
    return {"status": "success", "discussion": current_discussion}

@app.post("/discussion/next")
async def next_message():
    if not current_discussion or not current_discussion.is_active:
        raise HTTPException(status_code=400, detail="No active discussion")

    personas = sorted(persona_manager.get_all_personas(), key=lambda p: p.name)
    
    next_persona_index = len(current_discussion.messages) % len(personas)
    next_persona = personas[next_persona_index]

    response = await persona_manager.generate_response(
        next_persona.name,
        current_discussion.strategy_document.content,
        current_discussion.messages
    )

    message = Message(
        persona_name=next_persona.name,
        content=response,
        timestamp=datetime.now().isoformat()
    )
    current_discussion.messages.append(message)
    
    return {"message": message}

@app.post("/discussion/stop")
async def stop_discussion():
    global current_discussion
    if current_discussion:
        current_discussion.is_active = False
    return {"status": "success", "message_count": len(current_discussion.messages) if current_discussion else 0}
