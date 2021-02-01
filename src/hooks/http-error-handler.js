import {useState, useEffect} from 'react'

const HttpErrorHandler = (httpClient) => {
    const [error, setError] = useState(null);

    const reqInterceptor = httpClient.interceptors.request.use((req) => {
      setError(null);
      return req;
    });
    const respInterceptor = httpClient.interceptors.response.use(
      (res) => res,
      (error) => setError(error)
    );

    useEffect(()=>{
        return ()=>{
            httpClient.interceptors.request.eject(reqInterceptor)
            httpClient.interceptors.response.eject(respInterceptor)
        }
    }, [reqInterceptor, respInterceptor])

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return [error, errorConfirmedHandler]
}

export default HttpErrorHandler