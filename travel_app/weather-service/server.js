const express = require('express');
const cors = require('cors'); // 引入 cors 庫
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { QueryCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const app = express();
const port = 3001;

// 設定 DynamoDB 的區域
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json()); // 解析 JSON 請求主體
app.use(cors()); // 啟用 CORS

app.post('/weather', async (req, res) => {
  const { city } = req.body; // 從 POST 請求中取得城市名稱

  try {
    const params = {
      TableName: 'WeatherData',
      KeyConditionExpression: 'City = :city',
      ExpressionAttributeValues: {
        ':city': city
      },
      ScanIndexForward: false,
      Limit: 1
    };

    const command = new QueryCommand(params);
    const data = await docClient.send(command);

    if (data.Items && data.Items.length > 0) {
      // 處理 DynamoDB 回傳的資料
      const item = data.Items[0];
      res.json(item);
    } else {
      res.status(404).json({ error: 'Weather data not found' });
    }
  } catch (error) {
    console.error('Error fetching weather data from DynamoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Weather service running at http://localhost:${port}`);
});
