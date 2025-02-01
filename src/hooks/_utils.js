import axios from 'axios';

export const fetcher = (url) => axios.get(url).then((res) => res.data);

export const handleErrors = (err) => {
  if (err.response) {
    console.log('request error: ', err.response);
  } else {
    console.log('error: ', err);
  }

  if (err.response) {
    switch (err.response.status) {
        case 406: {
        err.response.data.errors.forEach((error) => {
          console.log(error);
        })
        break;
        }
        default: {
          console.log('Something is wrong with the server')
        }
    }
  } else {
     console.log('Something is wrong with the server') 
  }
};
