const express = require('express');
const redis = require('redis')
const {Pool} = require('pg')
const cors = require('cors')


const keys = require('./keys');

const app = express()


app.use(express.json());
app.use(cors());


const pgClient =new Pool({
    user: keys.pgUser,
    database: keys.pgDatabase,
    port: keys.pgPort,
    host: keys.pgHost,
    password: keys.pgPassword
})


pgClient.on('error', ()=>console.log('Lost pg connection'))

pgClient.on('connect', client=>{
    client.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(()=>console.log('something went wrong'))
})


const redisClient = redis.createClient({
    url:`redis://${keys.redisHost}:${keys.redisPort}`,
    retry_strategy:()=>1000
})

const sub = redisClient.duplicate();


app.get('/', (req,res)=>{
    res.send('Hi There')
})

app.get('/values/all',async(req,res)=>{
   const values = await  pgClient.query('SELECT * FROM values');
   return res.status(200).json(values.rows);
});

app.get('/values/current', async(req,res)=>{
    redisClient.hgetall('values', (err, values)=>{
        if(err) {
            console.log(err);
        }
        return res.status(200).json(values);
    })
}) 

app.post('/values', async(req,res)=>{
    const index= req.body.index;

    if(parseInt(index)>40) {
       return res.status(422).send('Index too high')
    }

    await redisClient.hset('values', index, 'nothing yet');
    sub.publish('insert',index);
    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    return res.send({working: true})
})

app.listen(9090,()=>{
    console.log('Server running on port 9091')
})