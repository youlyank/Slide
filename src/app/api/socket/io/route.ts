import { NextApiRequest, NextApiResponse } from 'next'
import SocketHandler from '@/lib/socket'

export default function SocketRoute(req: NextApiRequest, res: NextApiResponse) {
  return SocketHandler(req, res)
}