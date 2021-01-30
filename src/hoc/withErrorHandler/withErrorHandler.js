import React, { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Auxiliary/Auxiliary";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, setError] = useState(null);

    const reqInterceptor = axios.interceptors.request.use((req) => {
      setError(null);
      return req;
    });
    const respInterceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => setError(error)
    );

    useEffect(()=>{
        return ()=>{
            axios.interceptors.request.eject(reqInterceptor)
            axios.interceptors.response.eject(respInterceptor)
        }
    }, [reqInterceptor, respInterceptor])

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <Aux>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
