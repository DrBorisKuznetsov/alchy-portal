import os
import pickle
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import sys

# Настройка кодировки для Windows
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Конфигурация ссылок - ищем по ключевой части
OLD_LINK = "sites.google.com/view/alchy-channel"  # Частичное совпадение
NEW_LINK = "https://alchy-hub.github.io/"

# Настройки API
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def get_authenticated_service():
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    client_secrets_file = "client_secrets.json"
    
    if not os.path.exists(client_secrets_file):
        print(f"ERROR: File '{client_secrets_file}' not found!")
        print("Please download your OAuth client secret JSON and rename it to 'client_secrets.json'.")
        return None

    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, SCOPES)
    credentials = flow.run_local_server(port=0, prompt='select_account')
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def update_video_descriptions(youtube):
    print("Connecting to YouTube...")
    
    channels_response = youtube.channels().list(
        mine=True,
        part="contentDetails"
    ).execute()
    
    uploads_playlist_id = channels_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    
    videos_to_update = []
    next_page_token = None
    
    while True:
        playlist_response = youtube.playlistItems().list(
            playlistId=uploads_playlist_id,
            part="snippet",
            maxResults=50,
            pageToken=next_page_token
        ).execute()
        
        for item in playlist_response["items"]:
            video_id = item["snippet"]["resourceId"]["videoId"]
            title = item["snippet"]["title"]
            description = item["snippet"]["description"]
            
            if OLD_LINK in description:
                videos_to_update.append({
                    "id": video_id,
                    "title": title,
                    "description": description,
                    "categoryId": item["snippet"].get("categoryId", "27")
                })
        
        next_page_token = playlist_response.get("nextPageToken")
        if not next_page_token:
            break

    if not videos_to_update:
        print("No videos with old links found.")
        print("\nDEBUG: Showing last 5 video descriptions (newest first):")
        playlist_response2 = youtube.playlistItems().list(
            playlistId=uploads_playlist_id,
            part="snippet",
            maxResults=50
        ).execute()
        items = playlist_response2["items"]
        # Reverse to get newest first
        items = list(reversed(items))
        for item in items[:5]:
            title = item["snippet"]["title"]
            description = item["snippet"]["description"]
            print(f"\n--- {title} ---")
            print(repr(description[:500]) if description else "(empty)")
        return

    print(f"Found {len(videos_to_update)} videos to update.")
    for v in videos_to_update:
        print(f"  - {v['title']}")

    confirm = input("\nStart updating? (y/n): ")
    if confirm.lower() != 'y':
        print("Cancelled.")
        return

    for v in videos_to_update:
        new_description = v["description"].replace(OLD_LINK, NEW_LINK)
        
        try:
            print(f"Updating: {v['title']}...")
            youtube.videos().update(
                part="snippet",
                body={
                    "id": v["id"],
                    "snippet": {
                        "title": v["title"],
                        "description": new_description,
                        "categoryId": v["categoryId"]
                    }
                }
            ).execute()
        except Exception as e:
            print(f"Error updating {v['title']}: {e}")

    print("\nSuccess! All links updated to the new portal.")

if __name__ == "__main__":
    service = get_authenticated_service()
    if service:
        update_video_descriptions(service)
