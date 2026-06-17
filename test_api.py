import requests
import json

base_url = "http://localhost:8080"
login_url = f"{base_url}/api/v1/auth/login"
reports_url = f"{base_url}/api/v1/admin/reports"

try:
    # 1. Login
    login_data = {
        "email": "SuperAdmin@gmail.com",
        "password": "SuperAdmin@123"
    }
    print("Logging in...")
    resp = requests.post(login_url, json=login_data)
    resp.raise_for_status()
    login_json = resp.json()
    token = login_json.get("data", {}).get("token")
    if not token:
        print("Login failed, response:", login_json)
        exit(1)
        
    print("Logged in successfully. Fetching reports...")
    # 2. Fetch reports
    headers = {
        "Authorization": f"Bearer {token}"
    }
    reports_resp = requests.get(reports_url, headers=headers)
    reports_resp.raise_for_status()
    reports_data = reports_resp.json()
    
    # 3. Print first report keys and value for reporterName/author etc
    items = reports_data.get("data", [])
    if not items:
        print("No reports found!")
    else:
        first_item = items[0]
        print("First item keys:", list(first_item.keys()))
        for key in ["reporterName", "reporter", "authorName", "userName", "name"]:
            if key in first_item:
                print(f"{key}: {first_item[key]}")
        
        # Check capitalized versions
        for key in ["ReporterName", "Reporter", "AuthorName", "UserName", "Name"]:
            if key in first_item:
                print(f"{key}: {first_item[key]}")
        
        # print full item
        print("Full item:")
        print(json.dumps(first_item, indent=2))
        
except Exception as e:
    print("Error:", e)
    if hasattr(e, "response") and e.response is not None:
        print("Response text:", e.response.text)

