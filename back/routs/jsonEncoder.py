from flask.json.provider import DefaultJSONProvider
from datetime import datetime, time, timedelta, timezone

class CustomJSONEncoder(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, (datetime, time)):
            return obj.isoformat()
        if isinstance(obj, timedelta):
            return str(obj)
        return super().default(obj)   
