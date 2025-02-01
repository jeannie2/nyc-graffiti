import useSWR from 'swr';
import { fetcher } from '../hooks/_utils.js';

const useGraffitiAPI = () => {
  const { data, error, isLoading, isValidating } = useSWR('https://data.cityofnewyork.us/resource/8q69-4ke5.json?status=Open&descriptor=Graffiti', fetcher)

  return {
    graffitiData: data, 
    graffitiError: error, 
    isLoading: !data && !error,
    isValidating
  }
}

export default useGraffitiAPI;
