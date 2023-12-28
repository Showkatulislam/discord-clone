import {Server as NetServer,Socket} from 'net'
import {NextApiResponse} from 'next'
import {Server as SocketIoServer} from 'socket.io'
import { Channel, Member, Profile,Server } from "@prisma/client";


export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile|null })[];
  };
  
export type NextApiResponseServerTo=NextApiResponse & {
  socket:Socket & {
    server:NetServer &{
      io:SocketIoServer
    };
  };
}