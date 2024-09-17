'use client';

import { Answer, QuestionnaireQuestions } from "@/app/models/Questionnare";
import { User } from "@/app/models/User";
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuestionnairePage() {
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireQuestions | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [errors, setErrors] = useState<{ questionId: number; error: string }[]>([]);
    const router = useRouter(); 
    const params = useParams();
    const id:string = params?.id as string ;
    const user:User = JSON.parse(getCookie("user")|| '{}');

    useEffect(() => {
        const fetchQuestionnaireAndPreviousAnswers = async () => {
            try {
                // Fetch questionnaire
                const res = await fetch(`http://localhost:8000/questionnaire/${id}`);
                const data: QuestionnaireQuestions = await res.json();
                setQuestionnaire(data);

                // Fetch previous answers
                const previousAnswers = await fetchPreviousAnswers(user.id, parseInt(id));

                // Map the questionnaire questions with previous answers
                const updatedAnswers = data.questions.map((question) => {
                    // Find the corresponding previous answer for the current question
                    const matchingPreviousAnswer = previousAnswers.find(
                        (prev) => prev.question_id === question.id
                    );
                
                    let answer;
                
                    if (matchingPreviousAnswer && question.data.type === 'mcq') {
                        let temp = matchingPreviousAnswer.answer as string;
                        answer = temp.split(',').map((item) => item.trim());  // Trim any extra spaces
                    } else if (matchingPreviousAnswer) {
                        answer = matchingPreviousAnswer.answer;
                    } else {
                        // If there's no matching answer, set it as an empty string or array depending on the type
                        answer = question.data.type === 'mcq' ? [] : '';
                    }
                
                    return {
                        question_id: question.id,
                        answer: answer 
                    };
                });
                
                // Set the answers state
                setAnswers(updatedAnswers);
            } catch (error) {
                console.error('Error fetching questionnaire or previous answers:', error);
            }
        };

        fetchQuestionnaireAndPreviousAnswers();
    }, []);

    const fetchPreviousAnswers = async (
        userId: number,
        questionnaireId: number
    ): Promise<Answer[]> => {
        const res = await fetch(`http://localhost:8000/previous-answers/${userId}/${questionnaireId}`);
        const previousAnswers = await res.json();

        return previousAnswers.map((item: any) => ({
            question_id: item.question_id,
            answer: item.user_answer.replace(/[{""}]/g, '')
            ,
        }));
    };

    const handleSelectAll = (question_id: number, options: string[]) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.filter((ans) => ans.question_id !== question_id);
            return [
                ...updatedAnswers,
                { question_id, answer: options }
            ];
        });
    };

    const handleTextChange = (questionId: number, answer: string) => {
        setErrors((prevErrors) => prevErrors.filter((error) => error.questionId !== questionId));

        if (!answer.trim()) {
            setErrors((prevErrors) => [...prevErrors, { questionId, error: 'This field cannot be empty or whitespace' }]);
        }

        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.filter((ans) => ans.question_id !== questionId);
            return [
                ...updatedAnswers,
                { question_id: questionId, answer: answer }
            ];
        });
    };

    const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.map((ans) => 
                ans.question_id === questionId
                    ? {
                        ...ans,
                        answer: Array.isArray(ans.answer)
                            ? checked
                                ? [...ans.answer, option]
                                : ans.answer.filter((opt) => opt !== option)
                            : [option]
                    }
                    : ans
            );

            if (!prevAnswers.some((ans) => ans.question_id === questionId)) {
                return [
                    ...updatedAnswers,
                    { question_id: questionId, answer: [option] },
                ];
            }

            return updatedAnswers;
        });
    };

    const submitAnswers = async (userId: number, questionnaireId: number, answers:Answer[]) => {
        try {
            const res = await axios.post('http://localhost:8000/submit-answers/', {
                user_id: userId,
                questionnaire_id: questionnaireId,
                answers: answers
            });

            if (res.status === 200) {
                console.log('Answers submitted successfully:', res.data);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('Failed to submit answers');
        }
    };

    const handleSubmit = () => {
        const validationErrors = answers.filter((ans) => !ans.answer || (typeof ans.answer === 'string' && !ans.answer.trim()));
        if (validationErrors.length > 0) {
            setErrors(validationErrors.map((ans) => ({ questionId: ans.question_id, error: 'This field cannot be empty or whitespace' })));
            return;
        }

        submitAnswers(user.id, parseInt(id), answers);
        router.push('/questionnaires');
    };

    if (!questionnaire) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {questionnaire.title}
                    </Typography>

                    {questionnaire.questions.map((question) => (
                        <Box key={question.id} sx={{ marginBottom: 2 }}>
                            <Typography variant="h6">{question.data.question}</Typography>

                            {question.data.type === 'mcq' && (
                                <>
                                    <FormGroup>
                                        {question.data.options?.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            answers.find((ans) => ans.question_id === question.id && Array.isArray(ans.answer) && ans.answer.includes(option))
                                                                ? true
                                                                : false
                                                        }
                                                        onChange={(event) => handleCheckboxChange(question.id, option, event.target.checked)}
                                                    />
                                                }
                                                label={option}
                                            />
                                        ))}
                                    </FormGroup>

                                    <Button variant="text" color="primary" onClick={() => handleSelectAll(question.id, question.data.options || [])} sx={{ marginTop: 1 }}>
                                        Select All
                                    </Button>
                                </>
                            )}

                            {question.data.type === 'input' && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Your answer"
                                        variant="outlined"
                                        value={answers.find((ans) => ans.question_id === question.id)?.answer || ''}
                                        onChange={(event) => handleTextChange(question.id, event.target.value)}
                                        error={errors.some((error) => error.questionId === question.id)}
                                        helperText={errors.find((error) => error.questionId === question.id)?.error}
                                    />
                                </>
                            )}
                        </Box>
                    ))}
                </CardContent>

                <CardActions>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginLeft: 2, marginBottom: 2 }}>
                        Submit
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
