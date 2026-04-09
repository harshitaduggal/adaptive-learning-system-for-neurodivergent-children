from flask import Flask
from flask_cors import CORS
from routes.content import content_bp
from database import init_db

app = Flask(__name__)
init_db()
CORS(app)

app.register_blueprint(content_bp)

if __name__ == "__main__":
    app.run(debug=True)