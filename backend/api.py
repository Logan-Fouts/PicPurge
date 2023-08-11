import urllib.parse
from flask import Flask, jsonify
from flask_cors import CORS
from picpurger import ImageProcessor

app = Flask(__name__)
CORS(app)

processor = ImageProcessor()

pbar = None

# End-point to run the purging script
@app.route("/picAPI/run/<path:file_path>/<agro>/<keep_non_media>", methods=["GET"])
def run(file_path, agro, keep_non_media):
    global pbar
    decoded_file_path = "/" + urllib.parse.unquote(file_path)
    pbar = processor.init(decoded_file_path, int(agro), bool(keep_non_media))
    return {"finished": f"{decoded_file_path}"}

# End-point to retrieve progress bar percentage
@app.route("/picAPI/get_progress", methods=["GET"])
def get_progress():
    progress_percentage = processor.get_progress_update()
    return jsonify({"progress": progress_percentage})

if __name__ == "__main__":
    app.run(port=5002)