import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Map, { Popup, Marker, FullscreenControl, ScaleControl, NavigationControl, GeolocateControl } from 'react-map-gl';
import { supabaseClient } from '../services/supabaseClient.js';
import Loading from '../components/Loading';
import Pin from '../components/Pin.jsx';
import Controls from "../components/Controls.jsx"
import useGraffitiAPI from '../hooks/useGraffitiAPI.js';

const MapPage = () => {
  const { graffitiData, graffitiError, isLoading } = useGraffitiAPI();
  const [ DBdata, setDBdata ]= useState([]);
  const [ combined, setCombined ] = useState([]);
  const [ status, setStatus] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ popupInfo, setPopupInfo ] = useState(null);

  useEffect(() => {
    getDBRecords();

    if (graffitiData) {
      setStatus(graffitiData);
    }

  }, [graffitiData]);

  useEffect(() => {
    if (DBdata) {
      let APIandDBdata = DBdata.concat(graffitiData);
      setCombined(APIandDBdata);
      // setCombined([])
    }
  }, [DBdata]);

  const getDBRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('graffiti')
        .select('*')  // useparams
      if (data) {
        setDBdata(data);
      }
      if (error) {
        setError(error);
      }
    } catch(error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  };

  const pins = useMemo(() => {
    if (combined?.length === 0) {
      // console.log("no records returned from API and database");
      return null; 
    } else {
      return combined?.map((city, index) => {
        if (!city?.longitude || !city?.latitude) {
          return null;
        }

        return (
          <Marker
            key={`marker-${index}`}
            longitude={parseFloat(city.longitude)} 
            latitude={parseFloat(city.latitude)} 
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(city);
            }}
          >
            <Pin />
          </Marker>
        );
      });
    }
  }, [combined]);

  return (
    <>
    { loading || isLoading && <Loading /> }
    { error || graffitiError && <div className="error-screen">Error: { error ? error.message : graffitiError } </div> }
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        latitude: 40.61,
        longitude: -73.99,
        zoom: 10,
        bearing: 0,
        pitch: 0
      }}
      style={{width: '100%', height: '90vh'}}
      mapStyle="mapbox://styles/pkwil/clhab6j5i00uk01qthcfqanu3"
      // ><FullscreenControl /> </Map>
      >

        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
          >
            <div id="popup">
              <p><span>Record creation date:</span> <br/>{popupInfo.created_date ? popupInfo.created_date : popupInfo.created_at} </p>
              <p><span>Address: </span>{popupInfo.incident_address}, {popupInfo.incident_zip}</p>
              <p><span>Borough: </span> {popupInfo.borough} </p>

              <div>
                <Link to={`/${popupInfo.unique_key}?latitude=${popupInfo.latitude}&longitude=${popupInfo.longitude}`}>Photo gallery</Link>
              </div>
              <div>
                <Link to={`/imageupload/${popupInfo.unique_key}`}>Upload image</Link>
              </div>

            </div>
          </Popup>
        )}
      </Map>
      <Controls/>
    </>
  );
}

export default MapPage;
