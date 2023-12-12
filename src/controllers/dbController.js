const settings = require('../nodesSettings.json');
const MongoClient = require("mongodb").MongoClient;
const url = settings.dataBaseUrl;
const mongoClient = new MongoClient(url);
let db = mongoClient.db('EASCAN'); 

let DbController = class {

    async updatePplns(data){
        try{ 
            let pplns = db.collection('pplns');
            await pplns.replaceOne({}, data, {upsert: true}); 
        }catch(err){
            console.log('db updatePplns error!', err);
        } 
    };
    
    async updateNodes(data){
        let obj = {
            array: data
        }
        try{ 
            let nodes = db.collection('nodes');
            await nodes.replaceOne({}, obj, {upsert: true}); 
        }catch(err){
            console.log('db updateNodes error!', err);
        } 
    };

    async setSnapshot(data){
        try{ 
            let snapshots = db.collection('snapshots');
            await snapshots.insertOne(data); 
        }catch(err){
            console.log('db setSnapshot error!', err);
        } 
    };

    async updateMiner(data, node){
        try{ 
            let nodeMiner = db.collection(node);
            await nodeMiner.replaceOne({miner: data.miner}, data, {upsert: true}); 
        }catch(err){
            console.log('db setSnapshot error!', err);
        } 
    };

    async updateHourlyChart(data){
        try{
            let obj = {
                array: data
            } 
            let hourlyChart = db.collection('hourlyChart');
            await hourlyChart.replaceOne({}, obj, {upsert: true}); 
        }catch(err){
            console.log('db updateHourlyChart error!', err);
        } 
    };

    async updateDailyChart(data){
        try{
            let obj = {
                array: data
            } 
            let dailyChart = db.collection('dailyChart');
            await dailyChart.replaceOne({}, obj, {upsert: true}); 
        }catch(err){
            console.log('db updateDailyChart error!', err);
        } 
    }
}

module.exports = DbController;