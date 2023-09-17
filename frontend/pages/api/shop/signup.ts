import type { NextApiRequest, NextApiResponse } from 'next'
import Axios from '@/helper/axios'

type SingUp = {
  name: string,
  email: string,
  password: string
}

class Shop {
  static signUp = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { name, email, password }: SingUp = req.body
      const { data } = await Axios.post('/v1/api/shop/signup', {
        name, email, password
      })
      if(!data && data.status !== 200) throw new Error(`Erorrrr:::: from server`)

      res.status(200).json(data)
    } catch(err) {
      res.status(500).json({ 
        message: 'Error::::',
        status: 500,
        error: err
      })
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
    return Shop.signUp(req, res)    
  } else {
    // Handle any other HTTP method
  }
}

