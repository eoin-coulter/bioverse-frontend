import { NextApiRequest, NextApiResponse } from 'next';
import axios, {AxiosError}from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Capture the full path from the request URL (after /api/proxy)
    const { endpoint } = req.query;

    // Construct the full URL to the backend
    const targetUrl = `${BACKEND_URL}/${endpoint}`;

    // Forward the request to the backend, preserving the method, body, and headers
    const response = await axios({
      url: targetUrl,
      method: req.method,
      data: req.body,
      headers: {
        ...req.headers, // Forward headers
        host: BACKEND_URL, // Set the host to the backend URL
      },
    });

    // Return the response from the backend
    res.status(response.status).json(response.data);
  } catch (error:unknown) {
    console.error('Error connecting to the backend:', error);
  }
}
