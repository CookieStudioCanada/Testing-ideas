import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
AUTHORIZATION_CODE = 'your_authorization_code'  # Replace with the authorization code you receive

BASE_URL = 'https://api.linkedin.com/v2'
HEADERS = {}

def get_access_token(auth_code):
    url = 'https://www.linkedin.com/oauth/v2/accessToken'
    params = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    response = requests.post(url, data=params)
    response.raise_for_status()
    return response.json().get('access_token')

def get_user_posts():
    url = f'{BASE_URL}/ugcPosts'
    params = {
        'q': 'authors',
        'authors': f'urn:li:person:{YOUR_LINKEDIN_PERSON_URN}',
        'count': 100
    }
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json().get('elements', [])

def get_likes_for_post(post_id):
    url = f'{BASE_URL}/socialActions/{post_id}/likes'
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json().get('elements', [])

def main():
    global HEADERS

    # Step 1: Get access token
    access_token = get_access_token(AUTHORIZATION_CODE)
    HEADERS = {
        'Authorization': f'Bearer {access_token}',
        'X-Restli-Protocol-Version': '2.0.0'
    }

    # Step 2: Fetch posts and likes
    posts = get_user_posts()
    data = []

    for post in posts:
        post_id = post['id']
        likes = get_likes_for_post(post_id)

        for like in likes:
            liker = like['actor']['id']
            data.append({'post_id': post_id, 'liker_id': liker})

    # Step 3: Create a DataFrame and export to CSV
    df = pd.DataFrame(data)
    df.to_csv('linkedin_likes.csv', index=False)
    print('Data exported to linkedin_likes.csv')

if __name__ == '__main__':
    # Before running the script, you need to get the authorization code by visiting this URL:
    # https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress%20w_member_social
    main()
