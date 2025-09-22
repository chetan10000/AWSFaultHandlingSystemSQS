import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SQSEvent, SQSHandler } from "aws-lambda";

const sqsclient = new SQSClient({});
const URL = process.env.QUEUE_URL;

if(!URL){
    throw new Error("QUEUE URL is not set");
}

const MAX_RETRY_COUNT = 2;

export const handlerDLQ:SQSHandler = async(event:SQSEvent)=>{
    console.log("handlerDLQ invoke ");
    for(const record of event.Records)
    {
        console.log("received record  : ",record);

         let task;
        try {
                 task = JSON.parse(record.body);
        } catch (err) {
                console.error("❌ Failed to parse record body as JSON:", record.body);
                 continue;
        }

        const retryattr = record.messageAttributes?.RetryCount?.stringValue;
        const retrycount = parseInt(retryattr||"0");

        console.error('Task Failed',{
            taskId:task.taskId,
            payload:task.payload,
            error:record.messageAttributes?.ErrorMessage?.stringValue ||'Unknown error'
        });

        if(retrycount >= MAX_RETRY_COUNT)
        {
             console.warn("max count reach for task :" + task.taskId);
             continue;
        }

        try
        {
                 const params = 
                {
                    QueueUrl:URL,
                    MessageBody:JSON.stringify(task)
                };
                const cmd = new SendMessageCommand(params);
                await sqsclient.send(cmd);
                console.log("message send to queue: ",URL);
        }catch(error){
            console.error("failed to send message to queue : ",error)
        }
       
    }
   
}