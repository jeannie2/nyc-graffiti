import { Container } from '@mui/material';
import GraffitiForm from '../components/GraffitiForm';

const FormPage = () => {
  return (
    <Container id="graffiti-form-page" sx={{ textAlign: 'center' }}>
        <h1>Submit a new graffiti marker</h1>
        <GraffitiForm />
    </Container>
  )
}

export default FormPage;
