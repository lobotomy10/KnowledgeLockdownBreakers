from typing import Dict, List
from .models import PersonaConfig, Message
import os
from datetime import datetime
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

class PersonaManager:
    def __init__(self):
        self.personas: Dict[str, PersonaConfig] = {}
        self._initialize_default_personas()

    def _initialize_default_personas(self):
        self.add_persona(PersonaConfig(
            name="戦略家",
            role="戦略アドバイザー",
            position="賛成派",
            speaking_style="論理的で分析的な話し方",
            icon="💡"
        ))
        self.add_persona(PersonaConfig(
            name="バランサー",
            role="中立的評価者",
            position="中立派",
            speaking_style="客観的でバランスの取れた話し方",
            icon="⚖️"
        ))
        self.add_persona(PersonaConfig(
            name="リスク管理者",
            role="リスク分析官",
            position="懐疑派",
            speaking_style="慎重で詳細な検証を重視する話し方",
            icon="🔍"
        ))

    def add_persona(self, persona: PersonaConfig) -> None:
        self.personas[persona.name] = persona

    def remove_persona(self, name: str) -> None:
        if name in self.personas:
            del self.personas[name]

    def get_persona(self, name: str) -> PersonaConfig:
        return self.personas.get(name)

    def get_all_personas(self) -> List[PersonaConfig]:
        return list(self.personas.values())

    async def generate_response(self, persona_name: str, strategy_document: str, previous_messages: List[Message]) -> str:
        persona = self.get_persona(persona_name)
        if not persona:
            raise ValueError(f"Persona {persona_name} not found")

        context = f"""
あなたは{persona.name}（{persona.role}）として、{persona.position}の立場から意見を述べてください。
{persona.speaking_style}で発言してください。

戦略文書:
{strategy_document}

これまでの議論:
"""
        for msg in previous_messages[-3:]:  # 直近3つのメッセージのみ参照
            context += f"{msg.persona_name}: {msg.content}\n"

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": context},
                    {"role": "user", "content": "この戦略について、あなたの立場からの意見を150文字以内で述べてください。"}
                ],
                max_tokens=200,
                temperature=0.7,
                stream=True
            )
            
            full_response = ""
            async for chunk in response:
                if chunk and chunk.choices and chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
            
            return full_response[:150]  # 150文字制限を確実に守る
            
        except Exception as e:
            return f"申し訳ありません。応答の生成中にエラーが発生しました。: {str(e)}"
