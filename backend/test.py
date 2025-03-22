import base64
import os
import json
from google import genai
from google.genai import types

with open("output.json", "r", encoding="utf-8") as json_file:
    pyq = json_file.read()

def generate():
    prmopt = f"""You are an expert in generating JEE Main-level question papers. Generate a JSON object containing a JEE Main question paper with:

    Physics: 20 Multiple-Choice Questions (MCQs) and 5 Numerical Value Questions (NVQs)
    Chemistry: 20 MCQs and 5 NVQs
    Mathematics: 20 MCQs and 5 NVQs
    Guidelines:

    Difficulty & Topics: Ensure questions follow the typical JEE Main difficulty level and cover a variety of topics from the syllabus.
    Correct Answers: Provide the correct answer for each question.
    For MCQs, include a list of four options and specify the correct answer index.
    For NVQs, provide the correct numerical answer (integer or float).
    Format: Structure the JSON output exactly as follows:
    {pyq}
    """
    client = genai.Client(
        api_key="",
    )

    model = "gemini-2.0-flash-thinking-exp-01-21"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""give me a jee question paper Physics: 20 Multiple-Choice Questions (MCQs) and 5 Numerical Value Questions (NVQs)
Chemistry: 20 MCQs and 5 NVQs
Mathematics: 20 MCQs and 5 NVQs"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.7,
        top_p=0.95,
        top_k=64,
        max_output_tokens=65536,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text=prmopt),
        ],
    )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )

    print(response.text)
    cleaned_text = response.text.replace("```json","").replace("```","").strip()

    with open("jee_question_paper.json", "w",encoding="utf-8") as f:
        f.write(cleaned_text)



if __name__ == "__main__":
    generate()