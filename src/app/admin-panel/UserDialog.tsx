import { Dialog, DialogTitle, DialogContent, Typography, Box, DialogActions, Button } from '@mui/material';
import { User } from '../models/User';

interface Questionnaire {
  questionnaire_name: string;
  qna: { question: string; answer: string }[];
}



interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User  | null;
  questionnaires: Questionnaire[];
}

export default function UserDialog({ open, onClose, user, questionnaires }: UserDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {user ? `Questionnaires for ${user.username}` : 'Questionnaires'}
      </DialogTitle>
      <DialogContent>
        {questionnaires.map((questionnaire, index) => (
           <Box key={index} sx={{ marginBottom: 4 }}> {/* Add margin between questionnaires */}
           <Typography variant="h6" gutterBottom>{questionnaire.questionnaire_name}</Typography>
           {questionnaire.qna.map((qna, idx) => (
             <Typography key={idx} sx={{ marginBottom: 2 }}> {/* Add margin between Q&A */}
               Q: {qna.question} <br /> A: {qna.answer}
             </Typography>
           ))}
           <hr />
         </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
