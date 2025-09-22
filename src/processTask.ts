
import { DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSEvent,SQSHandler } from "aws-lambda";


const dynamodb = new DynamoDB();

export const process:SQSHandler = async(event:SQSEvent)=>
{
    console.log("process handler invoke ");
    for(const record of event.Records){
        try
        {
            const task:Task = JSON.parse(record.body);
            const {taskId,title,payload} =task;
            console.log("processing task : ",taskId);

            const fail = Math.random() < 0.3;

            if(fail)
            {
                console.error("Task failed intentionally : ",taskId);
                throw new Error(" Simulated failure for task : " + taskId);
            }
            var dbparams = 
            {
               TableName:"Tasks",
               Item:{
                taskId:{S:taskId.toString()},
                title:{S:title},
               }
            };
            
           const command = new PutItemCommand(dbparams);
           try 
           {
                const data = await dynamodb.send(command);
                console.log("success", data);
            } 
            catch (err) 
            {
                console.log("error", err);
            }
            console.log("task completed successfully",taskId);
        }
        catch(error)
        {
            console.error("error in process : " + error);
        }
       
    }
    

};