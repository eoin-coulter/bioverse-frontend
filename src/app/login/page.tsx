'use client';
import { useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";

// Define the expected shape of the response from the API
interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    is_admin: boolean;
  };
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [pword, setPassword] = useState<string>("");
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL
  console.log(url); // Make sure it's exactly as defined in the .env file
  



  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>(
        `${url}/login/`,
        { username, pword }
      );

     Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 }); 
     response.data.user.is_admin ? router.push('/admin-panel') :router.push("/questionnaires");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{color: "black"}}>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={pword}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>


        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          onClick={() => router.push('/signup')}
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        
      </form>
    </Box>
  );
}
