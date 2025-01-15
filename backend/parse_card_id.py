import sys
import json

data = json.load(sys.stdin)
if isinstance(data, list) and data:
    print(data[0]['id'])
elif isinstance(data, dict) and 'id' in data:
    print(data['id'])
