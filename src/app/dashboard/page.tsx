import axios from 'axios'
import React, { useEffect } from 'react'
import { Questionnaire } from '../models/Questionnare'




export default async function QuestionnairesPage() {
  console.log('here')

  // Fetch data from FastAPI in the server component
  const res = await fetch('http://localhost:8000/questionnaires/', {
    cache: 'no-store',  // Disable caching if you want fresh data on every request
  });
  const questionnaires: Questionnaire[] = await res.json();
  console.log(questionnaires)

  return (
    <div>
      <h1>All Questionnaires</h1>
      <ul>
        {questionnaires?.map((questionnaire) => (
          <li key={questionnaire.id}>{questionnaire.title}</li>
        ))}
      </ul>
    </div>
  );
}
