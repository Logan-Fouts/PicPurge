import urllib.parse
from flask import Flask, jsonify
from flask_cors import CORS
from picpurger import init, get_progress_update

app = Flask(__name__)
CORS(app)

# Store the pbar object for access from other functions
pbar = None

# End-point to run the purging script
@app.route("/picAPI/run/<path:file_path>/<agro>/<keep_non_media>", methods=["GET"])
def run(file_path, agro, keep_non_media):
    global pbar
    decoded_file_path = "/" + urllib.parse.unquote(file_path)
    pbar = init(decoded_file_path, int(agro), bool(keep_non_media))
    return {"finished": f"{decoded_file_path}"}

# End-point to retrieve progress bar percentage
@app.route("/picAPI/get_progress", methods=["GET"])
def get_progress():
    if pbar is not None:
        progress_percentage = get_progress_update(pbar)
        return jsonify({"progress": progress_percentage})
    else:
        return jsonify({"progress": 0})  # Return 0 if pbar is not initialized

if __name__ == "__main__":
    app.run(port=5002)
