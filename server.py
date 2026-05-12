import http.server
import socketserver
import os
import time
import base64
import json
from webdav3.client import Client

# ─────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────
PORT = 8000
DIRECTORY = "."
QA_DIR = "qa_captures"

SEAFILE_CONFIG = {
    'webdav_hostname': "http://192.168.31.105/seafdav",
    'webdav_login':    "40f03ec467ef40d19d97c44852622c3b@auth.local",
    'webdav_password': "8UM@c5fS5BYyjsQ"
}

# Specific target path
TARGET_DIR = "/My Library/Pictures/fitscan_captures"

# Initialize WebDAV client
client = Client(SEAFILE_CONFIG)

# Ensure local capture directory exists
if not os.path.exists(QA_DIR):
    os.makedirs(QA_DIR)

# Ensure remote Seafile directory exists
def ensure_remote_dir(path):
    parts = path.strip('/').split('/')
    current_path = ""
    for part in parts:
        current_path += "/" + part
        if not client.check(current_path):
            try:
                client.mkdir(current_path)
                print(f"Created remote directory: {current_path}")
            except Exception as e:
                print(f"Notice: Could not create {current_path}: {e}")

# Run directory check
ensure_remote_dir(TARGET_DIR)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def upload_to_seafile(self, local_path, filename):
        """Uploads local file to Seafile via WebDAV upload_sync"""
        try:
            remote_path = os.path.join(TARGET_DIR, filename)
            # webdavclient3 uses upload_sync for local files
            client.upload_sync(remote_path=remote_path, local_path=local_path)
            print(f"Successfully uploaded to Seafile: {remote_path}")
            return True
        except Exception as e:
            print(f"Failed to upload to Seafile: {e}")
            return False

    def do_POST(self):
        if self.path == '/save-frame':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                image_data = data.get('image')
                
                if image_data and image_data.startswith('data:image/jpeg;base64,'):
                    # Decode base64 image
                    base64_str = image_data.split(',')[1]
                    image_bytes = base64.b64decode(base64_str)
                    
                    filename = f"fitscan_test_{int(time.time() * 1000)}.jpg"
                    
                    # 1. Save locally as backup
                    filepath = os.path.join(QA_DIR, filename)
                    with open(filepath, 'wb') as f:
                        f.write(image_bytes)
                    
                    # 2. Upload to Seafile using the file path
                    seafile_success = self.upload_to_seafile(filepath, filename)
                        
                    # Respond to client
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        'status': 'success', 
                        'filename': filename,
                        'seafile_upload': seafile_success
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"status": "error", "message": "Invalid image data"}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

# Start the server
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Target Seafile directory: {TARGET_DIR}")
    httpd.serve_forever()