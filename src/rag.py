# 2025-01-08 version.

import requests
from rank_bm25 import BM25Okapi
from nltk.tokenize import word_tokenize
import nltk
import re
import google.generativeai as genai

# NLTK 데이터 다운로드
nltk.download('punkt')
nltk.download('punkt_tab')

# Supabase 설정
SUPABASE_URL = "https://pqqaslokhbmcnhqymfdb.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcWFzbG9raGJtY25ocXltZmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMjUwNjcsImV4cCI6MjA1MTgwMTA2N30.htMfw6GvvuyJ-oD0sEeLMj_yG3YIEMFwtI1XoE4ZhQg"

# Gemini API 설정
# GEMINI_API_URL = "https://api.projectgemini.cloud/v1/generate"  # 예시 URL
GEMINI_API_KEY = "AIzaSyD21doT3y5MEMLlEjR9Wg7-PzP1IS27AEY"  # Gemini API 키
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

genai.configure(api_key="AIzaSyD21doT3y5MEMLlEjR9Wg7-PzP1IS27AEY")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how AI works")

# 텍스트 전처리 함수
def preprocess_text(text):
    text = re.sub(r'[^\w\s]', '', text)  # 특수 문자 제거
    text = text.lower().strip()  # 소문자 변환 및 공백 제거
    return text

# 사용자 질문에서 연도를 추출하는 함수
def extract_year(user_input):
    year_match = re.search(r'\b(19|20)\d{2}\b', user_input)
    return int(year_match.group(0)) if year_match else None

# 사용자 질문을 기반으로 테이블 추출
def extract_context(user_question):
    print("==============================")
    print(f"사용자의 질문: {user_question}")
    print("==============================")

    keywords = user_question.lower()
    if "popular" in keywords and "course" in keywords:
        return ["courses", "user_course_info", "users"]
    elif "progress" in keywords or "students" in keywords:
        return ["user_course_info", "users", "courses"]
    elif "chapter" in keywords and "examples" in keywords:
        return ["course_detail", "lecture", "courses"]
    elif "exam scores" in keywords or "review" in keywords:
        return ["user_course_quiz_info", "users", "course_detail", "courses"]
    elif "create a course" in keywords:
        return ["courses", "course_detail"]
    elif "total courses" in keywords:
        return ["courses"]
    elif "course" in keywords and "student" in keywords:
        return ["user_course_info", "users", "courses"]
    else:
        return ["users", "courses", "user_course_info", "course_detail", "user_course_quiz_info", "lecture"]

# Supabase 데이터 추출
def fetch_data_from_tables(tables):
    headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {}
    for table in tables:
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data[table] = response.json()
        else:
            print(f"[ERROR] {table} 테이블에서 데이터를 가져오지 못했습니다. 상태 코드: {response.status_code}")
    # print(f"[DEBUG] 가져온 데이터: {data}")
    return data

#============================================================= 관련 데이터베이스로의 접근 =============================================================

# 프롬프트 템플릿 정의
PROMPT_TEMPLATE = """
    당신은 LMS 서비스를 관리하는 관리자입니다. 사용자의 질문에 정확한 답변을 해야할 의무가 있습니다.

    사용자의 질문:
    {question}

    주어진 context를 기반으로 사용자의 질문에 답변해주세요:
    {context}

    ===================================================================
    테이블에 대해 간략하게 소개하자면 다음과 같습니다.
    1. users : user_id는 사용자를 식별하기 위한 속성입니다. user_id의 개수가 전체 사용자 수입니다.
               user_name은 사용자의 이름을 의미합니다.
               email은 사용자의 이메일을 의미합니다.
               created_at은 사용자의 서비스 가입일자를 의미합니다.
               is_admin은 사용자가 admin이라면 True, admin이 아니라면 False입니다.
    2. courses : course_id 는 코스를 식별하기 위한 속성입니다. course_id의 개수가 전체 코스의 수입니다.
                 course_name은 코스의 이름을 의미합니다.
                 data_of_update는 코스가 생성된 날짜를 의미합니다.
                 course_description은 코스의 간략한 소개를 의미합니다.
                 color는 해당 코스가 사용자의 UI에 보여지는 색상을 의미합니다.
    3. course_detail : chapter_id는 챕터를 식별하기 위한 속성입니다. chapter_id의 개수가 전체 chapter(course_detail)의 수입니다.
                       course_id는 courses의 course_id를 foreign key로 가져온 것입니다.
                       chapter_name은 챕터의 이름을 의미합니다.
                       quiz_cnt는 해당 챕터가 가지고 있는 퀴즈의 개수를 의미합니다.
    4. lecture : lecture_id는 강의를 식별하기 위한 속성입니다. lecture_id의 개수가 전체 lecture의 수입니다.
                 chapter_id는 course_detail의 chapter_id를 foreign key로 가져온 것입니다.
                 lecture_name은 강의의 이름을 의미합니다.
                 lecture_document는 강의의 내용을 의미합니다.
    5. user_course_info : 해당 테이블은 user가 어떤 course를 수강하고 있는지에 대한 테이블입니다.
                          해당 테이블에 튜플이 존재한다는 것은 user_id에 해당하는 사용자가 course_id에 해당하는 코스를 수강하고 있다는 것을 의미합니다.
                          user_id는 users의 user_id를 foreign key로 가져온 것입니다.
                          course_id는 courses의 course_id를 foreign key로 가져온 것입니다.
                          status_of_learning은 현재 학습자의 course 학습 상태를 의미합니다. "In Progress"는 학습진행 중, "Done"은 학습완료를 의미합니다.
                          student_enrollment_date는 사용자가 course를 수강한 날짜를 의미합니다.
    6. user_course_quiz_info : 해당 테이블은 user가 수강하고 있는 course에 존재하는 chapter들에 대한 세부 정보를 제공하는 테이블입니다.
                               각 chapter마다 존재하는 전체 quiz 개수 중에서 사용자가 몇 개의 quiz를 맞혔는지에 대한 정보가 포함되어 있습니다.
                               user_id는 users의 user_id를 foreign key로 가져온 것입니다.
                               course_id는 courses의 course_id를 foreign key로 가져온 것입니다.
                               chapter_id는 course_detail의 chapter_id를 foreign key로 가져온 것입니다.
                               correct_answer_cnt는 사용자가 course_detail의 quiz 개수 중 몇 개를 맞혔는지에 대한 정보를 의미합니다.
    ===================================================================
    답변 시 다음 사항을 고려하여 답변을 생성해주세요.

    - 테이블의 id에 해당하는 부분은 답변을 제공할 때 함께 제공하지 마세요.
    - 답변을 할 때에는 필요한 내용에 대해서 간결하고 정확한 답변을 친절하게 존댓말로 제공하세요.
    - 데이터가 적더라도 존재하는 데이터만으로 정확한 답변을 제공하세요. 데이터가 적다는 답변은 굳이 생성하지 않아도 됩니다.
    - 답변을 제공하기 힘든 경우에는 이상한 정보를 제공하지 말고, 모른다고 답변해주세요.
    - 리스트 형태로 답변을 제공하는 경우에는 사용자가 깔끔하게 볼 수 있도록 

    1. {question}의 내용이 연도가 포함되고, 해당 연도에 유행했던 것이나 트렌디했던 것이 무엇이냐는 질문일 경우, timestamp 타입을 가지는 속성을 확인하세요.
       {question}에 존재하는 연도와 timestamp의 연도가 일치하는 데이터들 중 가장 많이 차지하는 데이터가 해당 연도의 유행했던 것입니다.
    2. correct_answer_cnt가 (quiz_cnt * 0.8)보다 작을 경우에는 해당 chapter에 대한 학습이 미흡하게 이루어졌다는 것을 의미합니다.
       따라서, 사용자의 질문에 각 chapter별 사용자의 퀴즈 점수에 대한 내용이 있을 경우,
       '맞힌 개수/전체 문제 개수' 형태로 표기하고, 미흡한 챕터에 대한 피드백 혹은 리뷰를 함께 제공하세요.
       그리고, 만약 correct_answer_cnt가 존재하지 않는다면 아직 퀴즈를 응시하지 않은 것이므로, '미응시'라고 표기하세요.
    3. 추가적인 예시나 피드백을 원하는 질문을 받았을 경우, 문서의 내용에 자세한 내용이나 예시가 없을 경우에도 알아서 적절한 예시나 피드백을 제공해주세요.
    4. LMS 서비스와 관련이 있지 않은 질문이라고 판단될 경우에는 "해당 LMS 서비스와 무관한 질문입니다." 라는 답변을 생성해주세요.
       ex) 오늘 점심으로 무엇을 먹을까? => "해당 LMS 서비스와 무관한 질문입니다."
    5. 리스트 형태로 답변을 제공하는 경우에는 다음과 같은 형식으로 답변을 제공하세요.
       ex) 질문이 "Course에는 어떤 것이 있나요?" 일 경우, 답변으로
           1. FE-Course: (course에 대한 설명)\n
           2. BE-Course: (course에 대한 설명)\n
           3. AI-Course: (course에 대한 설명)\n
        와 같이 사용자가 보기 편하도록 숫자와 \n으로 구분해서 답변을 제공하세요. 
"""

# 프롬프트 생성 함수
def create_prompt(user_input, relevant_data):
    if not relevant_data:
        return f"죄송합니다. '{user_input}'와 관련된 데이터를 찾을 수 없습니다."

    # 관련 데이터를 포맷팅
    relevant_docs_content = "\n".join(
        [f"- 테이블: {table}, 데이터: {row}" for table, row, _ in relevant_data]
    )

    # 프롬프트 생성
    prompt = PROMPT_TEMPLATE.format(
        question=user_input,
        context=relevant_docs_content,
    )

    return prompt.strip()

# Gemini API 호출 함수
def call_gemini_api(prompt):
    headers = {
        # "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "contents": [{
        "parts":[{"text": prompt}]
        }]
    }

    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    else:
        print(f"[ERROR] Gemini API 호출 실패. 상태 코드: {response.status_code}")
        print(f"응답 내용: {response.text}")
        return "죄송합니다. 답변 생성 중 오류가 발생했습니다."

# BM25를 사용한 데이터 유사도 계산
def find_relevant_data(user_input, data):
    tokenized_user_input = word_tokenize(preprocess_text(user_input))
    year = extract_year(user_input)
    relevant_data = []

    for table, rows in data.items():
        documents = [preprocess_text(" ".join([str(value) for value in row.values()])) for row in rows]
        tokenized_documents = [word_tokenize(doc) for doc in documents]

        bm25 = BM25Okapi(tokenized_documents)
        scores = bm25.get_scores(tokenized_user_input)

        for i, score in enumerate(scores):
            if year:
                timestamp_field = next((field for field in rows[i] if isinstance(rows[i][field], str) and "T" in rows[i][field]), None)
                if timestamp_field and str(year) in rows[i][timestamp_field]:
                    relevant_data.append((table, rows[i], score))
            else:
                relevant_data.append((table, rows[i], score))

    return sorted(relevant_data, key=lambda x: x[2], reverse=True)


# 답변 생성 함수
def generate_response_with_gemini(user_question):
    # 프롬프트 생성
    tables = extract_context(user_question)
    data = fetch_data_from_tables(tables)
    relevant_data = find_relevant_data(user_question, data)

    prompt = create_prompt(user_question, relevant_data)

    # Gemini API 호출
    response = call_gemini_api(prompt)

    return response
