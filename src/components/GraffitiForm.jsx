import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabaseClient } from '../services/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';
import ErrorComp from "./ErrorComp";

const boroughs = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

const GraffitiForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    address: "",
    zip: "",
    borough: "",
    longitude: "",
    latitude: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    const { zip, longitude, latitude } = formData;
    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);

    if (zip && !/^\d{5}$/.test(zip)) {
      errors.zip = "Invalid zip code";
    }

    if (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
      errors.longitude = "Invalid longitude";
    }

    if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
      errors.latitude = "Invalid latitude";
    }

    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormErrors({}); // reset
      setLoading(true);
      const { address, zip, borough, longitude, latitude } = formData;
      const { data, error } = await supabaseClient
        .from('graffiti')
        .insert([
          {
            incident_zip: parseFloat(zip),
            incident_address: address,
            borough: borough,
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            unique_key: uuidv4(),
            status: "open"
          }
        ]);
        if (error) {
          setFormErrors({ form: "Error: " + error.message });
        } else {
          setMsg("Pin added successfully");
          navigate('/form-submitted');
        }
      } catch (error) {
        setFormErrors({ form: "Error: " + error.message });
      }
      setLoading(false);
      resetForm();
  }

  const resetForm = () => {
    setFormData({
      address: "",
      zip: "",
      borough: "",
      longitude: "",
      latitude: ""
    });
  };

  return (
    <>
      {formErrors.form && <p className="error">{formErrors.form}</p>}
      <form onSubmit={handleSubmit} id="graffiti-form">
        <label htmlFor="address">Address</label>
        <input 
          name="address" 
          placeholder="address" 
          type="text" 
          required 
          value={formData.address}
          onChange={handleChange}
        />
        {formErrors.address && <p className="error">{formErrors.address}</p>}

        <label htmlFor="zip">Zip Code</label>
        <input 
          name="zip" 
          placeholder="zip code" 
          type="string" 
          required 
          value={formData.zip}
          onChange={handleChange}
        />
        {formErrors.zip && <p className="error">{formErrors.zip}</p>}

        <label htmlFor="borough">Borough</label>
        <select
          name="borough"
          required
          value={formData.borough}
          onChange={handleChange}
        >
          <option value="">Select Borough</option>
          {boroughs.map((borough) => (
            <option key={borough} value={borough}>
              {borough}
            </option>
          ))}
        </select>
        {/* {formErrors.borough && <p className="error">{formErrors.borough}</p>} */}

        <label htmlFor="latitude">Latitude</label>
        <input 
          name="latitude" 
          placeholder="number between -90 and 90 (e.g. 40.781)" 
          type="string" 
          required 
          min={-90}
          max={90}
          step="any"
          value={formData.latitude}
          onChange={handleChange}
        />
        {formErrors.latitude && <p className="error">{formErrors.latitude}</p>}

        <label htmlFor="longitude">Longitude</label>
        <input  
          name="longitude" 
          placeholder="number between -180 and 180 (e.g. -73.974)" 
          type="string" 
          required 
          min={-180}
          max={180}
          step="any"
          value={formData.longitude}
          onChange={handleChange}
        />
        {formErrors.longitude && <p className="error">{formErrors.longitude}</p>}

       
        <button type="submit" disabled={loading}> SUBMIT </button>
      </form>
    </>
  )
}

export default GraffitiForm;
