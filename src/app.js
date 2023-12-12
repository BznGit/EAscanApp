
const settings = require('./nodesSettings.json');
const DbController = require('./controllers/dbController');
const ApiController = require('./controllers/apiController');
const api = new ApiController();
const db = new DbController();

let oldTopSnapshotHash = 'null';


api.getGeneral().then((res)=>{
    if(!res) return;
    //console.log(res)
    if(oldTopSnapshotHash !=  res.ea.topSnapshotHash) oldTopSnapshotHash = res.ea.topSnapshotHash;
    console.log('EAP app started!');
}).then(()=>{
    
    setInterval(() => {
        api.getGeneral().then((res)=>{
            if(!res) return;
                   
            // Определение нового блока ---------------------------------------
            if (oldTopSnapshotHash = res.ea.topSnapshotHash){
                oldTopSnapshotHash = res.ea.topSnapshotHash;
                
                api.getSnapShot(oldTopSnapshotHash).then((res)=>{
                    if(!res) return;
                    console.log('Новый блок!');
                    db.setSnapshot(res);
                });

                // Получение и сохранение инфы по PPLNS ----------------------
                api.getPplns().then(res=>{
                    if(!res) return;
                    db.updatePplns(res)
                });

                // Получение и сохранение инфы по HourlyChart ----------------------
                api.getHourlyChart().then(res=>{
                    if(!res) return;
                    db.updateHourlyChart(res)
                });

                // Получение и сохранение инфы по HourlyChart ----------------------
                api.getDailyChart().then(res=>{
                    if(!res) return;
                    db.updateHourlyChart(res)
                });

                // Получение и сохранение инфы по нодам ----------------------
                api.getNodes().then(res=>{
                    if(!res) return;
                    res.forEach(element => {
                        let obj = element.data.miners.hr;
                        for (key in obj) {
                            api.getMiner(key, element.ipAdress).then(res=>{
                                res.miner = key;
                                db.updateMiner(res, element.ipAdress)    
                            })
                        }
                    });
                    db.updateNodes(res)
                });
            } 
        })
    },  settings.intervalApiSec*1000);
});  
    

