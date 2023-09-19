const dialogFlow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const accountSid = 'AC29e10272f8cf5aca3810fb0eba4c4f2f';
const authToken = 'e6d0f35e6761ac4a44532a68e84bdfe4';
const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(express.json());
app.use(cors());

const Port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/webhook", async (req, res) => {
  var id = res.req.body.session.substr(43);
  console.log(id);
  const agent = new WebhookClient({ request: req, response: res });

  function hi(agent) {
    console.log(`intent => hi`);
    agent.add(`hi from server side`);
  }

  function fallback(agent) {
    console.log(`intent => fallback`);
    agent.add("sorry from server side");
  }
  function Order(agent) {

    console.log("Intent => Order")

    const { number, Products } = agent.parameters;
    agent.add(
      `Your order of ${number} ${Products} is confirmed `
    );
    client.messages
      .create({
        body: `You Recieved A Order Of ${number} ${Products}`,
        to: '+923101200978'
      })
      .then(message => console.log(message.sid))
      .done();
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", hi);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Order", Order);

  agent.handleRequest(intentMap);
});
app.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
});