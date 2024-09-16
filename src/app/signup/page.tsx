'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";

// Define the expected shape of the response from the API
interface SignupResponse {
  message: string;
}

export default function Signup() {
  const [username, setUsername] = useState<string>("");
  const [pword, setPassword] = useState<string>("");
  const [is_admin, setIsAdmin] = useState<boolean>(true);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<SignupResponse>(
        "http://localhost:8000/signup/",
        { username, pword, is_admin }
      );
      alert(response.data.message);
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
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
      <Typography variant="h4" component="h1" gutterBottom  sx={{color: "black"}}>
        Signup
      </Typography>
      <form onSubmit={handleSignup}>
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
          Sign Up
        </Button>
      </form>
    </Box>
  );
}