import base64
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from .env file
load_dotenv()

# Initialize the Gemini API client
client = genai.Client(
    api_key=os.getenv("API_KEY"),  # Read API key from .env
)

model = "gemini-3.1-pro-preview"


def generate_subject_questions_JEE(subject, mcq_count, nvq_count):
    # Load the appropriate JSON structure based on the subject
    if subject == "Physics":
        with open("jee_input_physics.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    elif subject == "Chemistry":
        with open("jee_input_chemistry.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    elif subject == "Mathematics":
        with open("jee_input_maths.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    else:
        raise ValueError(f"Invalid subject: {subject}")

    prompt = f"""
        You are an expert in JEE Main-level question paper generation. Generate a JSON object with:
        
        - {subject}: {mcq_count} Multiple-Choice Questions (MCQs) and {nvq_count} Numerical Value Questions (NVQs)
        
        Guidelines:
        - Ensure questions follow the JEE Main difficulty level and cover various syllabus topics.
        - Provide correct answers for each question.
        - MCQs must have four options with the correct answer index.
        - NVQs must have correct numerical answers (integer or float).
        - Output must match this JSON structure: {pyq}
        - Do not generate more or less than {mcq_count + nvq_count} questions.

        Note: Don't just give same questions from the example, generate new ones based on the guidelines and can use the internet for reference.
    """

    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=prompt)]),
    ]

    config = types.GenerateContentConfig(
        temperature=0.5,
        top_p=0.95,
        top_k=64,
        max_output_tokens=65536,
        response_mime_type="text/plain",
    )

    temp_questions = []  # Store previously generated questions

    while True:
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=config,
        )

        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()

        try:
            new_questions = json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"Error decoding JSON for {subject}, retrying...")
            continue

        print(f"Questions generated for {subject}")

        # Merge previous valid questions with newly generated ones
        temp_questions.extend(new_questions)

        # Remove duplicates (optional, if necessary)
        temp_questions = list({json.dumps(q): q for q in temp_questions}.values())

        # Validate the number of questions
        required_count = mcq_count + nvq_count

        if len(temp_questions) == required_count:
            return temp_questions
        elif len(temp_questions) > required_count:
            return temp_questions[:required_count]
        else:
            print(f"Incorrect question count for {subject}, retrying...")
            print(len(required_count))


def generate_jee_paper():
    physics_questions = generate_subject_questions_JEE("Physics", 20, 5)
    chemistry_questions = generate_subject_questions_JEE("Chemistry", 20, 5)
    mathematics_questions = generate_subject_questions_JEE("Mathematics", 20, 5)
    question_paper = physics_questions + chemistry_questions + mathematics_questions
    return question_paper


def generate_subject_questions_NEET(subject, mcq_count):
    temp_questions = []  # Temporary storage for previously generated questions

    # Load the appropriate JSON structure based on the subject
    if subject == "Physics":
        with open("neet_physics.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    elif subject == "Chemistry":
        with open("neet_chemistry.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    elif subject == "Biology":
        with open("neet_biology.json", "r", encoding="utf-8") as json_file:
            pyq = json_file.read()
    else:
        raise ValueError(f"Invalid subject: {subject}")

    while True:
        prompt = f"""
            You are an expert in NEET-level question paper generation. Generate a JSON object with:
            - {subject}: {mcq_count} Multiple-Choice Questions (MCQs)
            
            Guidelines:
            - Ensure questions follow the NEET difficulty level and cover various syllabus topics.
            - Provide correct answers for each question.
            - MCQs must have four options with the correct answer index.
            - Output must match this JSON structure: {pyq}
            - Do not generate more or less than {mcq_count} questions.
        """

        contents = [
            types.Content(role="user", parts=[types.Part.from_text(text=prompt)])
        ]

        config = types.GenerateContentConfig(
            temperature=0.5,
            top_p=0.95,
            top_k=64,
            max_output_tokens=65536,
            response_mime_type="text/plain",
        )

        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=config,
        )

        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()

        try:
            new_questions = json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"Error decoding JSON for {subject}, retrying...")
            continue

        print(f"Questions generated for {subject}")

        # Add the new questions to the temporary storage
        temp_questions.extend(new_questions)

        # Ensure we only return the required number of questions
        if len(temp_questions) >= mcq_count:
            return temp_questions[:mcq_count]

        print(f"Incorrect question count for {subject}, retrying...")
        print(len(temp_questions))


def generate_neet_paper():
    physics_questions = generate_subject_questions_NEET("Physics", 50)
    chemistry_questions = generate_subject_questions_NEET("Chemistry", 50)
    biology_questions = generate_subject_questions_NEET("Biology", 100)

    question_paper = physics_questions + chemistry_questions + biology_questions
    return question_paper


NIMCET_SYLLABUS_2026 = {
    "Mathematics": """Set Theory and Logic: Concepts of Sets- Unions, Intersection, Difference, Symmetric difference, Cartesian Product, Cardinality, Functions and Relations, Venn Diagrams, Truth tables, Connectives, Tautology and Contradictions.
Probability and Statistics: Basic concepts of probability theory, Averages, Dependent and independent events, Bayes' Theorem, Mean, Median, Mode, Mean deviation, Standard deviation, variance, Moments, and Frequency distributions.
Algebra: Fundamental operations in algebra, Quadratic equations with real coefficients, Relation between roots & coefficients, Symmetric functions of roots and their sums, indices, logarithms, exponentials, arithmetic, geometric, harmonic progressions, finite sums of powers of natural numbers. Matrices & determinants, simultaneous linear equations, Permutations & Combinations, and Binomial Theorem.
Coordinate Geometry: Rectangular Cartesian coordinates, distance formulae, equation of a line (various forms), and intersection of lines, pair of straight lines, equations of a circle, parabola, ellipse, and hyperbola, Section formula, Tangents and normal to circles and conics.
Calculus: Functions on real numbers, limits of functions, left and right limits, limits at infinity, continuous functions, applications of the intermediate value theorem, differentiation, applications of differentiation, tangents, normals, simple examples of maxima and minima, applications of Rolle’s theorem, Mean Value Theorem, Integration of functions- by parts, by substitution, by partial fraction, integration of odd & even functions, periodic, definite integrals, area computations.
Trigonometry: Trigonometric functions, identities, principal value of inverse trigonometric functions, properties of triangles, solution of triangles, heights and distances, trigonometric equations and their general solutions.""",
    "Logical Reasoning": """Verbal Reasoning, Non-verbal Reasoning, Deductive Reasoning, Inductive Reasoning -Topics Include blood relations, coding-decoding, direction test, seating arrangement, puzzles, inputoutput, syllogism, alphanumeric series, mirror images, statements and conclusions/arguments.
Problem solving, Critical thinking, Data Interpretation, Numerical Reasoning, Data Sufficiency, Data Visualization.""",
    "Computer": """Computer Basics: Organization of a computer, Central Processing Unit (CPU), structure of instructions in CPU, input/output devices, computer memory, and back-up devices.
Data Representation: Representation of characters, integers, and fractions, binary and hexadecimal representations, binary arithmetic: addition, subtraction, multiplication, division, simple arithmetic, and two’s complement arithmetic, floating point representation of numbers, Boolean algebra.
Computer Hardware: Input Devices: Keyboard, mouse, scanner, etc. Output Devices: Monitor, printer, speakers, etc. Storage Devices: Hard drives, SSDs, USB drives, etc. Memory: RAM, ROM, cache, etc.
Computer Software: Operating Systems: Windows, macOS, Linux, Android, etc. System Software: Utility programs, device drivers. Application Software: Basic concepts & tools.
Internet and Email: Web Browsing - Understanding how the internet works and how to navigate it. Email - Sending, receiving, and managing emails. Online Security -Basic awareness of online threats and safety measures.""",
    "English": """Comprehension of written text, usage of words (vocabulary), Grasp of Grammatical Patterns (usage of sentence forms, sounds, and word formation processes), meaning of words and phrases, technical writing, and overall accuracy and fluency in expressions of English required for technical education."""
}

def generate_subject_questions_NIMCET(
    subject, mcq_count, years=["2024", "2023", "2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008"]
):
    # Load all available PYQs from different years
    all_pyqs = []

    for year in years:
        try:
            if subject == "Mathematics":
                file_path = f"nimcet/{year}/input_math.json"
            elif subject == "Logical Reasoning":
                file_path = f"nimcet/{year}/input_lr.json"
            elif subject == "Computer":
                file_path = f"nimcet/{year}/input_computer.json"
            elif subject == "English":
                file_path = f"nimcet/{year}/input_english.json"
            else:
                raise ValueError(f"Invalid subject: {subject}")

            with open(file_path, "r", encoding="utf-8") as json_file:
                year_pyq = json.load(json_file)
                all_pyqs.append({"year": year, "questions": year_pyq})
        except FileNotFoundError:
            print(f"Warning: PYQs not found for year {year}")
            continue
        except KeyError:
            print(f"Warning: Subject {subject} not found in {year} PYQs")
            continue

    if not all_pyqs:
        raise ValueError(
            f"No valid PYQs found for subject {subject} in specified years {years}"
        )

    if subject == "Mathematics":
        with open("nimcet/2024/input_math.json", "r", encoding="utf-8") as json_file:
            output_format = json_file.read()
    elif subject == "Logical Reasoning":
        with open("nimcet/2024/input_lr.json", "r", encoding="utf-8") as json_file:
            output_format = json_file.read()
    elif subject == "Computer":
        with open(
            "nimcet/2024/input_computer.json", "r", encoding="utf-8"
        ) as json_file:
            output_format = json_file.read()
    elif subject == "English":
        with open("nimcet/2024/input_english.json", "r", encoding="utf-8") as json_file:
            output_format = json_file.read()
    else:
        raise ValueError(f"Invalid subject: {subject}")

    # Get the structure from the most recent year
    latest_structure = all_pyqs[0]["questions"]
    
    current_syllabus = NIMCET_SYLLABUS_2026.get(subject, "")

    prompt = f"""
        You are an expert in NIMCET-level question paper generation.
        
        REVISED SYLLABUS FOR {subject.upper()} (Effective 2026):
        {current_syllabus}
        
        Below are previous year questions (PYQs) from {', '.join(years)} to help you understand the style, format, depth, and complexity:
        
        {json.dumps(all_pyqs, indent=2)}
        
        Generate a NEW question paper with:
        - {subject}: {mcq_count} Brand New Multiple-Choice Questions (MCQs)
        
        Guidelines:
        - STRICTLY base your questions ONLY on the REVISED SYLLABUS provided above.
        - Analyze the PYQs to see exactly how questions were asked and mimic their difficulty level and tricky logic.
        - DO NOT directly repair, repeat, or trivially rephrase the PYQs. Make completely NEW, original, and thought-provoking questions.
        - Provide correct answers for each question.
        - MCQs must have four logically sound options with the correct answer index.
        - Output format must strictly match this structure (JSON):
        {output_format}
        - Do not generate more or less than {mcq_count} questions.
    """

    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=prompt)]),
    ]

    config = types.GenerateContentConfig(
        temperature=0.75,
        top_p=0.95,
        top_k=64,
        max_output_tokens=65536,
        response_mime_type="text/plain",
    )

    temp_questions = []  # Store previously generated questions

    while True:
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=config,
        )

        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()

        try:
            new_questions = json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"Error decoding JSON for {subject}, retrying...")
            continue

        print(f"Questions generated for {subject}")

        # Merge previous valid questions with newly generated ones
        temp_questions.extend(new_questions)

        # Remove duplicates (optional, if necessary)
        temp_questions = list({json.dumps(q): q for q in temp_questions}.values())

        # Validate the number of questions
        if len(temp_questions) >= mcq_count:
            return temp_questions[:mcq_count]
        else:
            print(f"Incorrect question count for {subject}, retrying...")
            print(len(temp_questions))


def generate_nimcet_paper():
    math_questions = generate_subject_questions_NIMCET("Mathematics", 50)
    logical_questions = generate_subject_questions_NIMCET("Logical Reasoning", 40)
    computer_questions = generate_subject_questions_NIMCET("Computer", 20)
    english_questions = generate_subject_questions_NIMCET("English", 10)

    question_paper = (
        math_questions + logical_questions + computer_questions + english_questions
    )
    return question_paper


def generate_paper(exam_name):
    print(f"Generating {exam_name} question paper...")
    if exam_name == "JEE":
        print("Generating JEE question paper...")
        return generate_jee_paper()
    elif exam_name == "NIMCET":
        print("genreationg nimcet")
        return generate_nimcet_paper()
    else:
        return generate_neet_paper()
