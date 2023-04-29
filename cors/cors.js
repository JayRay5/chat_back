const cors= require('cors')

const corsOption={
    origin:'*',
    optionsSuccessStatus:200
}

module.exports=cors(corsOption)