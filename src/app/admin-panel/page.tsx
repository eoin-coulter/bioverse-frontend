'use client';
import { useState } from 'react';
import AdminPanel from './AdminPanel'; // Import your AdminPanel component
import UserDialog from './UserDialog'; // Import your UserDialog component
import axios from 'axios';
import { User } from '../models/User';
import { Box } from '@mui/material';

interface Questionnaire {
  questionnaire_name: string;
  qna: { question: string; answer: string }[];
}

export default function AdminPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [open, setOpen] = useState(false);

  

  // Fetch questionnaires for the selected user when they are clicked
  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/${user.id}/questionnaires`);
      setQuestionnaires(res.data);
      setOpen(true); // Open the dialog
    } catch (error) {
      alert('Error Fetching Answers')  
      console.error('Error fetching questionnaires:', error);
    }
  };

 

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <><Box display={'flex'}  flexDirection={'column'}>
      <AdminPanel onUserSelect={handleUserSelect} />

      <UserDialog
        open={open}
        onClose={handleCloseDialog}
        user={selectedUser}
        questionnaires={questionnaires}
      />
    </Box>
    </>
  );
}
``
