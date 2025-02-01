import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';

const ImageSubmittedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 5000)
  }, []);

  return (
    <Container id="image-submitted-page" sx={{textAlign: 'center'}}>
      <h2>Image submitted! Please check the marker and click the image gallery link. </h2>
      <h2 style={{ marginTop: '0' }}>Redirecting to map, please wait...</h2>
    </Container>
  )
}

export default ImageSubmittedPage;
