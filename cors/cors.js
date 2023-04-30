const cors= require('cors')

const corsOption={
    origin: ["https://localhost:3000"],
    methods:["GET","POST"],
    credentials: true,
    optionsSuccessStatus: 200,
    
}

module.exports=cors(corsOption)