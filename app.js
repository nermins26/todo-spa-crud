const express = require('express')
const mongojs = require('mongojs')
const db = mongojs('nermindb', ['todos'])

const app = express()
app.use(express.json())

app.use(express.static(__dirname + '/public'))

app.post('/save', (req, res) => {
    let msg = req.body.msg
    db.todos.insert({msg: msg, date: new Date().toDateString()}, (err, data) => {
       res.send('Sve ok') 
    })
})

app.get('/get_data', (req, res)=>{//saljemo podatke u xml http zahjev /get_data u promisu
    db.todos.find((err,data)=> {
        res.send(data)
    })
})

app.post('/delete', (req, res)=> {
    let id = req.body.id
    db.todos.remove({"_id": db.ObjectId(id)}, (err,data)=> {
        res.send('Deleted')
    })
})

app.listen(3000, ()=> {
    console.log('Listening to port 3000...')
})