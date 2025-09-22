🚀 How to Deploy
npm install
serverless deploy
🔧 Test the System
curl -X POST https://<your-api-url>/submit \
  -H "Content-Type: application/json" \
  -d '{"taskId": "123","title":"buy vegetables", "payload": {"message": "your description"}}'
Check CloudWatch for logs of processed and failed tasks.
