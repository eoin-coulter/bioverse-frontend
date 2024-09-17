'use client';
import { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { User } from '../models/User';



interface AdminPanelProps {
  onUserSelect: (user: User) => void;
}

export default function AdminPanel({ onUserSelect }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);



  // Fetch users and completed questionnaires on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

 
  

  if(users.length === 0) return <div>Loading...</div>

  return (
    <Box display={'flex'}  flexDirection={'column'}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Completed Questionnaires</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.completed_questionnaires}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onUserSelect(user)} // Call the handler when user is selected
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LogoutButton/>
    </Box>
  );
}
