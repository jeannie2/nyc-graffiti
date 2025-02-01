import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabaseClient } from '../services/supabaseClient.js';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Loading from '../components/Loading';

const GraffitiShowPage = () => {
  const params = useParams();
  const [ loading, setLoading ] = useState(false);
  const [ folderUrl, setFolderUrl] = useState('');
  const [ images, setImages ] = useState([]);
  const [ error, setError ] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const latitude = queryParams.get('latitude');
  const longitude = queryParams.get('longitude');

  useEffect(() => {
    const fetchData = async () => {
      await getDatabaseLink();
      await displayList();
    }
    fetchData();
  }, [params.id]);

  const getDatabaseLink = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .storage
        .from('graffiti')
        .getPublicUrl(`${params.id}`)
      if (!error && data) {
        setFolderUrl(data.publicUrl);
      } else {
        setError(error);
      }
    } catch(error) {
      setError(error);
    }
    setLoading(false);
  }

  const displayList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
      .storage
      .from('graffiti')
      .list(`${params.id}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })
      if (!error && data) {
        setImages(data);
      } else {
        setError(error);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return (
    <>
      {loading && <Loading />}
      {error && <div className="error-screen">Error: {error.message} </div>}
      {!loading && !error && (
      <>
        {images?.length === 0 ? ( 
            <Container id="graffiti-show-page" sx={{textAlign: 'center'}}>
             <h1>No images yet! <Link to={`/imageupload/${params.id}?latitude=${latitude}&longitude=${longitude}`} style={{ cursor: 'pointer' }}>Upload </Link>to see it here</h1>
            </Container>
        ) : (
            images && images.length > 0 && (
            <>
              <h2 id="graffiti-show-page-title"> { longitude && latitude ? `Latitude: ${latitude}, Longitude: ${longitude}` : '' } </h2>
              <ImageList variant="masonry" cols={3} gap={8}>
                {images?.map((item) => (
                    <ImageListItem key={item.id}>
                    <img
                        src={`${folderUrl}/${item.name}?w=248&fit=crop&auto=format`}
                        srcSet={`${folderUrl}/${item.name}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.name}
                        loading="lazy"
                    />
                    </ImageListItem>
                ))}
              </ImageList>
            </>
            )
            )}
      </>
     )}
    </>
  )
}

export default GraffitiShowPage;
