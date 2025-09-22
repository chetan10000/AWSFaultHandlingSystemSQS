## 🚀 How to Deploy

```bash
npm install
serverless deploy

curl -X POST https://<your-api-url>/submit \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "123",
    "title": "buy vegetables",
    "payload": {
      "message": "your description"
    }
  }'

serverless logs -f process -t
