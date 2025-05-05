from pydantic import BaseModel
from typing import List, Optional

class PromptRequest(BaseModel):
    prompt: str
    task_id: int

class EvaluationResponse(BaseModel):
    score: float
    clarity: float
    specificity: float
    goal_alignment: float
    feedback: str
    improved_prompt: str
    passed: bool 