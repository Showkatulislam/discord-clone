import {Server as NetServer} from 'http'
import {NextApiRequest} from 'next'
import {Server as ServerIo} from 'socket.io'
import { NextApiResponseServerTo } from '@/types'


/* export const config={
    api:{
        bodyParsar:false
    }
} */

const ioHandler=(req:NextApiRequest,res:NextApiResponseServerTo)=>{
    if(!res.socket.server.io){
        const path='/api/socket/io';
        const httpServer:NetServer=res.socket.server as any
        const IO=new ServerIo(httpServer,{
            path:path,
            //ts ignore
            addTrailingSlash:false
        })
        res.socket.server.io=IO
    }
    res.end()
}

export default ioHandler;