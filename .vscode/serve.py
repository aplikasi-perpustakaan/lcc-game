import os
import socket
import sys
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

def run_server():
    os.chdir(ROOT)
    if is_port_in_use(PORT):
        print(f"Serving HTTP on 127.0.0.1 port {PORT} (reusing active instance) ...", flush=True)
        try:
            while True:
                time.sleep(3600)
        except (KeyboardInterrupt, SystemExit):
            pass
        return

    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            # Suppress normal GET spam in terminal
            pass

    server = HTTPServer(('127.0.0.1', PORT), QuietHandler)
    print(f"Serving HTTP on 127.0.0.1 port {PORT} ...", flush=True)
    try:
        server.serve_forever()
    except (KeyboardInterrupt, SystemExit):
        server.server_close()

if __name__ == '__main__':
    run_server()
