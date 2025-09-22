import {APIGatewayProxyHandler} from 'aws-lambda';
import { SQSClient,SendMessageCommand } from '@aws-sdk/client-sqs';
import './tasks';
const SqsClient = new SQSClient({});
const URL = process.env.QUEUE_URL;

if(!URL){
  throw new Error("QUEUE URL is not set");
}

export const submit:APIGatewayProxyHandler = async(event,context)=>{

 try
 {
      const task:Task = JSON.parse(event.body || '{}');
      const {taskId,title,payload} = task;

      if(!taskId || !title || !payload){
        return{
          statusCode:400,
          headers:{
            'Content-Type':'Application/json',
          },
          body:JSON.stringify({
            status:'error',
            message:'taskId and payload are required',
            timestamp:new Date().toISOString()
          }),
        }
      }
     
      try{
              const params = {
                        QueueUrl:URL,
                        MessageBody:JSON.stringify(task),
                      };
              await SqsClient.send(new SendMessageCommand(params));
              console.log("message send to queue: ",URL);
        }
        catch(error){
          console.error("failed to send message to queue : ",error);
        }
      

      
      return{
              statusCode:200,
              headers:{
                        'Content-Type':'application/json'
                      },
              body:JSON.stringify({
                                    status:'success',
                                    message:'task submited successfully',
                                    timestamp:new Date().toISOString()
                                  })
    
            }
 }
 catch(error)
 {
    console.error("failed to send message to queue");
    return{
            statusCode:500,
            headers:{
                      'Content-Type':'application/json',
                    },
            body:JSON.stringify({
            status:'error',
            message:'failed to send message to queue',
            timestamp:new Date().toISOString(),
            })
          }
  }

}
  