import { DynamoDBClient, DescribeTableCommand, CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event: any) => {
  const { TableName } = event.ResourceProperties;

  try {
    // Check if table exists
    const describeParams = {
      TableName,
    };

    await dynamodb.send(new DescribeTableCommand(describeParams));

    // Table exists, no need to create it
    return {
      Status: "SUCCESS",
      PhysicalResourceId: TableName,
      Data: { TableName },
    };
  } catch (error:any) {
    if (error.name === "ResourceNotFoundException") {
      // Table does not exist, create it
      const createParams:CreateTableCommandInput = {
        TableName,
        AttributeDefinitions: [
          {
            AttributeName: "taskId",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "taskId",
            KeyType: "HASH",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      await dynamodb.send(new CreateTableCommand(createParams));

      return {
        Status: "SUCCESS",
        PhysicalResourceId: TableName,
        Data: { TableName },
      };
    } else {
      // Handle other errors
      return {
        Status: "FAILED",
        Reason: `Error occurred: ${error.message}`,
      };
    }
  }
};
