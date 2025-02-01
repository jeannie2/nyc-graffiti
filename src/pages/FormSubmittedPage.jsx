import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';

const FormSubmittedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 5000)
  }, []);

  return (
    <Container id="form-submitted-page" sx={{textAlign: 'center'}}>
      <h2>Form submitted. Please check the map! </h2>
      <h2 style={{ marginTop: '0' }}>Redirecting to map, please wait...</h2>
    </Container>
  )
}

export default FormSubmittedPage;
