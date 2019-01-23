let express = require('express');
let bodyParser = require('body-parser')
let xss = require('xss');

let port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let messages = [];
let cnt = 0;

function addMessage(name, message) {
    messages[++cnt] = {id: cnt, name: xss(name), message: xss(message)};
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/messages_list', (req, res) => {
    let last_message_id = req.body.last_id;

    if(last_message_id != undefined) {

        let result = {};
        index_message_id = last_message_id;

        while(index_message_id < cnt) {
            result[++index_message_id] = messages[index_message_id];
        }
        res.send(JSON.stringify(result));
    } else {
        res.send(JSON.stringify(messages));
    }
});

app.post('/message', (req, res) => {
    let name = req.body.name;
    let message = req.body.message;
    if(name != undefined && name != "") {
        if(message != undefined && message != "") {
            addMessage(name, message);
            res.send(JSON.stringify({res: 'OK'}));
        }
        else
            res.send(JSON.stringify({res: 'ERR', msg: 'No message specified'}));
    }
    else
        res.send(JSON.stringify({res: 'ERR', msg: 'No name specified'}));
});

addMessage("SERVER", "Initial Message");

app.listen(port, () => {
    console.log('Example app listening on port %d!', port);
});
