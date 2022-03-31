import { Connection, Request } from 'tedious'

export class AzureSQLDatabaseHandler{

  connection : Connection;

  constructor(){
    this.connection = new Connection(this.config);
    
    this.connection.on("connect", err => {
      console.log("So far..")
      if (err) {
        //console.error(err.message);
      } else {
        console.log("TAAAAAT")
      }
    });

    this.connection.connect();
  }

  config = {
    authentication: {
      options: {
        userName: "jondog",
        password: "AnNeuUZ1"
      },
      type: "default"
    },
    server: "jondog.database.windows.net",
    options: {
      database: "TimeRegistrationSystem",
      encrypt: true,
      trustServerCertificate:true
    }
  
  };

  async query() {
    let returnJson = {"array":[]}

    return await new Promise((resolve,reject) => {
    const request : Request = new Request(
      'SELECT * FROM test', (err, rowCount) => {
        if(err){
          console.log(err.message)
        }
      }
    );

      this.connection.execSql(request);

      request.on("row", columns => {
        let jsonElement = {}
        columns.forEach(column => {
          jsonElement[column.metadata.colName] = column.value;
        });
        returnJson.array.push(jsonElement);
        resolve(returnJson);
      });
      
      console.log(returnJson);
    }).then(()=>{return returnJson});
  
  }
  
}