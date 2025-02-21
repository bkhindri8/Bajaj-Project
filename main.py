from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],  # Change this to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define the input data model
class DataInput(BaseModel):
    data: List[str]

@app.post("/bfhl")
def process_data(input_data: DataInput):
    try:
        # Separate alphabets and numbers
        alphabets = sorted([x for x in input_data.data if x.isalpha()])
        numbers = sorted([x for x in input_data.data if x.isdigit()], key=int)
        highest_alphabet = max(alphabets) if alphabets else None

        # Prepare response
        response = {
            "alphabets": alphabets,
            "numbers": numbers,
            "highest_alphabet": highest_alphabet,
        }
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint for testing
@app.get("/")
def root():
    return {"message": "BFHL API is running!"}

# Handle OPTIONS requests for CORS
@app.options("/bfhl")
async def options_handler(request: Request):
    return {}
