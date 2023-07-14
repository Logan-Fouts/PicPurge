import urllib.parse

from flask import Flask
from flask_cors import CORS
from picpurger import init

app = Flask(__name__)
CORS(app)


@app.route("/picAPI/run/<path:file_path>/<agro>/<keep_non_media>", methods=["GET"])
def run(file_path, agro, keep_non_media):
    decoded_file_path = "/" + urllib.parse.unquote(file_path)
    init(decoded_file_path, int(agro), bool(keep_non_media))
    return {"finished": f"{decoded_file_path}"}


if __name__ == "__main__":
    app.run(port=5000)
