import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/auth";
import { updateObject, validateInputs } from "../../shared/utility";

const Auth = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [controls, setControls] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your E-mail",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });

  const {buildingBurger, authRedirectPath, onSetRedirectPath} = props

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetRedirectPath();
    }
  },[buildingBurger, authRedirectPath, onSetRedirectPath]);

  const inputChangeHandler = (event, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: validateInputs(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true,
      }),
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }

    setControls(updatedControls);
    setFormIsValid(formIsValid);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignup);
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const formElementsArr = [];

  let errorMessage = null;

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  for (let key in controls) {
    formElementsArr.push({
      id: key,
      config: controls[key],
    });
  }

  const formInputs = formElementsArr.map((element) => (
    <Input
      key={element.id} //equals to key (name, address, etc)
      valid={element.config.valid}
      touched={element.config.touched}
      elementType={element.config.elementType}
      elementConfig={element.config.elementConfig}
      value={element.config.value}
      changed={(event) => inputChangeHandler(event, element.id)}
    />
  ));

  let output = (
    <div className={classes.Auth}>
      {authRedirect}
      <form onSubmit={submitHandler}>
        {formInputs}
        <Button type="Success" disabled={!formIsValid}>
          SUBMIT
        </Button>
      </form>
      <Button type="Danger" clicked={switchAuthModeHandler}>
        SWITCH TO
        {isSignup ? " SIGNIN" : " SIGNUP"}
      </Button>
      {errorMessage}
    </div>
  );

  if (props.loading) {
    output = <Spinner />;
  }

  return output;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
