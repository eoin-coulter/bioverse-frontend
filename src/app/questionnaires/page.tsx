import React from 'react'
import { Questionnaire } from '../models/Questionnare'
import { Box, Card, CardContent, Grid2, Typography } from '@mui/material';
import Link from 'next/link';
import LogoutButton from '../LogoutButton';




export default async function QuestionnairesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questionnaires/`, {
    cache: 'no-store',  
  });
  const questionnaires: Questionnaire[] = await res.json();
   

  return (<>
    <Box display={'flex'} flexDirection={'column'} >
    <Typography variant="h4" component="h1" gutterBottom color='black'>
      All Questionnaires
    </Typography>

    <Grid2 container spacing={3}>
      {questionnaires.map((questionnaire) => (
        
        <Grid2  key={questionnaire.id} component="div">
          <QuestionaireCard questionnaire={questionnaire}></QuestionaireCard>
         
        </Grid2>
      ))}
    </Grid2>
    <LogoutButton/>
  </Box>
  </>
  );


}
function QuestionaireCard({ questionnaire }: { questionnaire: Questionnaire }) {

  return(
    <Link href={`/questionnaires/${questionnaire.id}`} passHref >
  <Card
  sx={{
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 6,  
    },
  }}
>
  <CardContent>
    <Typography variant="h6" component="div">
      {questionnaire.title}
    </Typography>
  </CardContent>
</Card>
</Link>)
}

