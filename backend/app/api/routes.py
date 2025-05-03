from fastapi import APIRouter, HTTPException
from app.models.schemas import PromptRequest, EvaluationResponse
from app.services.evaluator import evaluate_prompt

router = APIRouter()

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_prompt_endpoint(request: PromptRequest):
    try:
        evaluation = await evaluate_prompt(request.prompt, request.task_id)
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 