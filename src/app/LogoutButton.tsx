'use client';
import { Button } from '@mui/material'
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = () => {
    deleteCookie('user'); 
    router.push('/login');
  };

  return (
    <Button color="inherit"  onClick={handleLogout}>
    Logout
  </Button>
  )
}
