import requests
from rank_bm25 import BM25Okapi
from nltk.tokenize import word_tokenize
import nltk
import re
import google.generativeai as genai
import markdown2

MAX_HISTORY_LENGTH = 3

nltk.download('punkt')
nltk.download('punkt_tab')

SUPABASE_URL = "https://pqqaslokhbmcnhqymfdb.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcWFzbG9raGJtY25ocXltZmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMjUwNjcsImV4cCI6MjA1MTgwMTA2N30.htMfw6GvvuyJ-oD0sEeLMj_yG3YIEMFwtI1XoE4ZhQg"

GEMINI_API_KEY = "AIzaSyD21doT3y5MEMLlEjR9Wg7-PzP1IS27AEY"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

genai.configure(api_key="AIzaSyD21doT3y5MEMLlEjR9Wg7-PzP1IS27AEY")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how AI works")

history = []

def preprocess_text(text):
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower().strip()
    return text

def extract_year(user_input):
    year_match = re.search(r'\b(19|20)\d{2}\b', user_input)
    return int(year_match.group(0)) if year_match else None

def extract_context(user_question):
    print("==============================")
    print(f"사용자의 질문: {user_question}")
    print("==============================")

    keywords = user_question.lower()
    if "rate" in keywords:
        return ["users", "courses", "user_course_info", "chapter", "user_course_quiz_info", "lecture", "course_chapter"]
    elif "popular" in keywords and "course" in keywords:
        return ["courses", "user_course_info", "users"]
    elif "progress" in keywords or "students" in keywords:
        return ["user_course_info", "users", "courses"]
    elif "chapter" in keywords and "examples" in keywords:
        return ["chapter", "lecture", "courses", "course_chapter"]
    elif "exam scores" in keywords or "review" in keywords:
        return ["user_course_quiz_info", "users", "chapter", "courses", "course_chapter"]
    elif "create a course" in keywords:
        return ["courses", "chapter", "course_chapter"]
    elif "total courses" in keywords:
        return ["courses"]
    elif "course" in keywords and "student" in keywords:
        return ["user_course_info", "users", "courses"]
    else:
        return ["users", "courses", "user_course_info", "chapter", "user_course_quiz_info", "lecture", "course_chapter"]

def fetch_data_from_tables(tables, selected_columns=None):
    headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {}
    for table in tables:
        query_params = ""
        if selected_columns and table in selected_columns:
            query_params = f"?select={','.join(selected_columns[table])}"
        url = f"{SUPABASE_URL}/rest/v1/{table}{query_params}"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data[table] = response.json()
        else:
            print(f"[ERROR] {table} 테이블에서 데이터를 가져오지 못했습니다. 상태 코드: {response.status_code}")
    return data


PROMPT_TEMPLATE = """
    당신은 LMS 서비스를 관리하는 도우미이며, 당신의 이름은 HOTDOGGY입니다. 사용자의 질문에 정확한 답변을 해야할 의무가 있습니다.
    다만 매 답변을 생성할 때마다 자기소개를 할 필요는 없습니다.

    사용자의 질문:
    {question}

    주어진 context를 기반으로 사용자의 질문에 답변해주세요:
    {context}

    사용자가 이전에 했던 질문과 생성된 답변:
    {history_context}

    ===================================================================
    테이블에 대해 간략하게 소개하자면 다음과 같습니다.
    1. users : user_id는 사용자를 식별하기 위한 속성입니다. user_id의 개수가 전체 사용자 수입니다.
               user_name은 사용자의 이름을 의미합니다.
               email은 사용자의 이메일을 의미합니다.
               created_at은 사용자의 서비스 가입일자를 의미합니다.
               is_admin은 사용자가 admin이라면 True, admin이 아니라면 False입니다.
               contact는 사용자의 전화번호를 의미합니다.
               date_of_birth는 사용자의 생년월일을 의미합니다. (YYYY-MM-DD)
               age는 사용자의 나이를 의미합니다.
    2. courses : course_id 는 코스를 식별하기 위한 속성입니다. course_id의 개수가 전체 코스의 수입니다.
                 course_name은 코스의 이름을 의미합니다.
                 data_of_update는 코스가 생성된 날짜를 의미합니다.
                 course_description은 코스의 간략한 소개를 의미합니다.
                 color는 해당 코스가 사용자의 UI에 보여지는 색상을 의미합니다.
    3. chapter : chapter_id는 챕터를 식별하기 위한 속성입니다. chapter_id의 개수가 전체 chapter의 수입니다.
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
                          student_enrollment_date는 사용자가 course를 수강을 시작한 날짜를 의미합니다.
    6. user_course_quiz_info : 해당 테이블은 user가 수강하고 있는 course에 존재하는 chapter들에 대한 세부 정보를 제공하는 테이블입니다.
                               각 chapter마다 존재하는 전체 quiz 개수 중에서 사용자가 몇 개의 quiz를 맞혔는지에 대한 정보가 포함되어 있습니다.
                               user_id는 users의 user_id를 foreign key로 가져온 것입니다.
                               course_id는 courses의 course_id를 foreign key로 가져온 것입니다.
                               chapter_id는 course_detail의 chapter_id를 foreign key로 가져온 것입니다.
                               correct_answer_cnt는 사용자가 course_detail의 quiz 개수 중 몇 개를 맞혔는지에 대한 정보를 의미합니다.
    7. course_chapter : 해당 테이블은 courses 테이블과 chapter 테이블의 ManyToMany 관계를 위해 생성된 테이블입니다.
                        course_id는 courses의 course_id를 foreign key로 가져온 것입니다.
                        chapter_id는 chapter의 chapter_id를 foreign key로 가져온 것입니다.
    ===================================================================
    답변 시 다음 사항을 고려하여 답변을 생성해주세요.

    - {question}이 "A 코스는 어때?", "std2도 알려줘."와 같이 정확히 무엇을 원하는지 모르겠는 질문이 들어왔을 경우, {history_context}를 살펴보세요.
      {history_context}에 존재하는 질문들 중 {question}과 비슷한 맥락의 질문이 있다면 비슷한 맥락의 질문이 생성하였던 답변 형식으로 답변하면 됩니다.
      {history_context}를 참조할 때 가장 최근에 push된 질문들부터 가장 오래 전에 push된 질문들 순서로 탐색하세요. (즉, 인덱스가 큰 것부터 작은 것으로 탐색하세요.)
      ex) history_context에 'FE-course를 수강하는 학생은 누가 있어?'라는 질문과 'FE-course 퀴즈 현황에 대해 알려줘.'라는 질문이 존재한다고 가정하자.
          'FE-course를 수강하는 학생은 누가 있어?'라는 질문이 'FE-course 퀴즈 현황에 대해 알려줘.'라는 질문보다 오래된 질문이어서 list 인덱스의 앞쪽에 있다고 하자.
          이럴 경우 사용자의 질문으로 'BE-course도 알려줘.'라고 들어온다면 BE-course를 수강하는 학생에 대한 정보가 아닌, 
          가장 최근에 push된 질문이라 뒤쪽 인덱스에 위치한 BE-course 퀴즈 현황에 대한 정보를 사용자에게 답변을 제공해야 합니다.
    - 테이블의 id 속성은 답변 시 제공하지 마세요.
    - id 속성 대신 name 속성으로 답변을 제공하세요.
      ex) user_id가 답변에 포함된 경우, user_id 대신 user_name으로 답변을 제공하세요.
    - 답변을 할 때에는 필요한 내용에 대해서만 간결하고 정확하게 답변하세요. 답변 시에는 존댓말로 제공하세요.
    - 데이터가 적더라도 존재하는 데이터만으로 정확한 답변을 제공하세요. 데이터가 적다는 답변은 굳이 생성하지 않아도 됩니다.
    - 답변을 제공하기 힘든 경우에는 이상한 정보를 제공하지 말고, 모른다고 답변해주세요.
    - 질문으로 사용자의 퀴즈 정보, 이수하고 있는 코스 정보 등 사용자에 대한 구체적인 내용이 포함되지 않는다면 굳이 사용자의 정보에 대해서는 답변을 생성하지 않아도 됩니다.
      ex) 'FE-course에 대해 설명해줘' => FE-course에 포함된 챕터와 description에 대한 간단한 소개만 제공.
          'FE-course에 대해 설명해주고, 해당 강의를 듣는 사용자들의 정보도 알려줘' => FE-course에 대한 소개와 사용자들의 정보도 함께 제공. (단, id는 제공하지 않아도 됩니다.)
    - nick_name과 nickname은 같은 의미입니다. 즉, 속성명에 _가 포함되어 있더라도 크게 신경쓰지 마세요.
    
    1. {question}의 내용이 연도가 포함되고, 해당 연도에 유행했던 것이나 트렌디했던 것이 무엇이냐는 질문일 경우, timestamp 타입을 가지는 속성을 확인하세요.
       {question}에 존재하는 연도와 timestamp의 연도가 일치하는 데이터들 중 가장 많이 차지하는 데이터가 해당 연도의 유행했던 것입니다.
    2. correct_answer_cnt가 (quiz_cnt * 0.8)보다 작을 경우에는 해당 chapter에 대한 학습이 미흡하게 이루어졌다는 것을 의미합니다.
       따라서, 사용자의 질문에 각 chapter별 사용자의 퀴즈 점수에 대한 내용이 있을 경우,
       '맞힌 개수/전체 문제 개수' 형태로 표기하고, 미흡한 챕터에 대한 피드백 혹은 리뷰를 함께 제공하세요.
       그리고, 만약 correct_answer_cnt가 존재하지 않는다면 아직 퀴즈를 응시하지 않은 것이므로, '미응시'라고 표기하세요.
    3. 추가적인 예시나 피드백을 원하는 질문을 받았을 경우, 문서의 내용에 자세한 내용이나 예시가 없을 경우에도 알아서 적절한 예시나 피드백을 제공해주세요.
    4. LMS 서비스와 관련이 있지 않은 질문이라고 판단될 경우에는 "해당 LMS 서비스와 무관한 질문입니다." 라는 답변을 생성해주세요.
       ex) 오늘 점심으로 무엇을 먹을까? => "해당 LMS 서비스와 무관한 질문입니다."
"""

def create_prompt(user_input, relevant_data, history):
    if not relevant_data:
        return f"죄송합니다. '{user_input}'와 관련된 데이터를 찾을 수 없습니다."

    relevant_docs_content = "\n".join(
        [f"- 테이블: {table}, 데이터: {row}" for table, row, _ in relevant_data]
    )

    prompt = PROMPT_TEMPLATE.format(
        question=user_input,
        context=relevant_docs_content,
        history_context = history
    )

    return prompt.strip()

def call_gemini_api(prompt):
    headers = {
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

def interpret_user_question(user_question, history):
    if not history:
        return user_question

    last_question, _ = history[-1]
    matched_course = re.search(r'(\w+)-course', last_question, re.IGNORECASE)
    if matched_course:
        last_course = matched_course.group(1).upper()
        if "course" not in user_question.lower():
            return f"{last_course}-course에 대한 질문인가요? {user_question}"
    return user_question

def find_relevant_data(user_input, data):
    tokenized_user_input = word_tokenize(preprocess_text(user_input))
    print(tokenized_user_input)
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

def generate_response_with_gemini(user_question):
    global history

    history_context = "\n".join(
        [f"사용자: {q}\n챗봇: {a}" for q, a in history]
    )
    if history_context:
        full_prompt = f"""
        이전 대화:
        {history_context}

        새로운 질문:
        사용자: {user_question}
        """
    else:
        full_prompt = user_question
    
    print("현재 히스토리:")
    print(history_context)
    tables = extract_context(user_question)
    data = fetch_data_from_tables(tables)
    relevant_data = find_relevant_data(user_question, data)

    context_prompt = create_prompt(user_question, relevant_data, history_context)

    final_prompt = f"{full_prompt}\n\n{context_prompt}"
    response = call_gemini_api(final_prompt)

    html_response = markdown2.markdown(response)

    history.append((user_question, response))
    if len(history) > MAX_HISTORY_LENGTH:
        history.pop(0)  # 가장 오래된 대화를 제거

    return html_response