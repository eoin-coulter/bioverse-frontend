import axios from 'axios'
import React, { useEffect } from 'react'
import { Questionnaire } from '../models/Questionnare'
import { Box, Card, CardContent, Grid2, Typography } from '@mui/material';
import Link from 'next/link';




export default async function QuestionnairesPage() {

  // Fetch data from FastAPI in the server component
  const res = await fetch('http://localhost:8000/questionnaires/', {
    cache: 'no-store',  // Disable caching if you want fresh data on every request
  });
  const questionnaires: Questionnaire[] = await res.json();
 

  return (
    <Box sx={{ padding: 4 }}>
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
  </Box>
  );


}
function QuestionaireCard({ questionnaire }: { questionnaire: Questionnaire }) {

  return(
    <Link href={`/questionnaires/${questionnaire.id}`} passHref >
  <Card
  sx={{
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 6,  // Add shadow effect on hover
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

