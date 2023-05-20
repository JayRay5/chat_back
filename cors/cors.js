const cors= require('cors')

const corsOption={
    origin: ["https://localhost:3000"],
    methods:["GET","POST","DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,

    exposedHeaders: ['Set-Cookie'], 
    
}

module.exports=cors(corsOption)