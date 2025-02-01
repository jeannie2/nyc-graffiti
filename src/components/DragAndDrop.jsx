import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabaseClient } from '../services/supabaseClient.js';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ["JPG", "PNG"];
const boxArea = <div id="drop-area"><h1 id="drop-area-text">DROP IMAGE HERE (jpg, png) </h1></div>

const DragAndDrop = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const [ file, setFile] = useState(null);

    const handleChange = async (file) => {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file[0].type)) {
        setError("Invalid file type");
        return;
      } else {
        setError("");
        console.log("Valid file type");
      }

      try {
        setFile(file);
        setError("");
        setLoading(true);
        const { data, error } = await supabaseClient.storage
          .from('graffiti')
          .upload(`${params.id}/${file[0].name}`, file[0], {
            cacheControl: '3600',
            upsert: true
            // contentType: "image/jpg"
         });

        if (!error && data) {
          navigate('/image-submitted');
        } else {
          setError("Error uploading file");
        }
      } catch (error) {
        setError("Error uploading file");
      }
      setLoading(false);
    }

    return (
      <>
        <FileUploader
          multiple={true}
          handleChange={handleChange}
          onTypeError={() => setError("Invalid file type")}
          name="file"
          types={fileTypes}
          children={boxArea}
        />
         {loading && <p id="drag-drop-loading">Loading...</p>}
         {error && <p id="drag-drop-error">Error: {error}</p>}
      </>
    )
}

export default DragAndDrop;
