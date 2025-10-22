from flask import Flask
from routs.event import event_bp
from routs.auth_routes import auth_bp
from routs.jsonEncoder import CustomJSONEncoder
from routs.reset_pass import reset_pass_bp
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.register_blueprint(event_bp, url_prefix='/event')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(reset_pass_bp, url_prefix='/reset_pass')
app.json_encoder = CustomJSONEncoder



app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'troque_por_um_segredo_forte')
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['ACCESS_TOKEN_EXPIRES_MINUTES'] = 15

if __name__ == '__main__':
    app.run(port=5000, debug=True)






