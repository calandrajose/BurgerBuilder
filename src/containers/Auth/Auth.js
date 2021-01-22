import React, { Component } from "react";
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/auth";
import {updateObject, validateInputs} from '../../shared/utility'

class Auth extends Component {
  state = {
    controls: {
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
    },
    formIsValid: false,
    isSignup: true,
  };

  componentDidMount(){
    if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
      this.props.onSetRedirectPath();
    }
  }

  inputChangeHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls,{
      [controlName]: updateObject(this.state.controls[controlName],{
        value: event.target.value,
        valid: validateInputs(event.target.value, this.state.controls[controlName].validation),
        touched: true,
      })
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }

    this.setState({ controls: updatedControls, formIsValid: formIsValid });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  switchAuthModeHandler = (e) => {
    //e.preventDefault()
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    const formElementsArr = [];

    let errorMessage = null;

    let authRedirect = null;
    if(this.props.isAuthenticated){
      authRedirect = <Redirect to={this.props.authRedirectPath}/>
    }

    if(this.props.error){
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }

    for (let key in this.state.controls) {
      formElementsArr.push({
        id: key,
        config: this.state.controls[key],
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
        changed={(event) => this.inputChangeHandler(event, element.id)}
      />
    ));

    let output = (
      <div className={classes.Auth}>
        {authRedirect}
        <form onSubmit={this.submitHandler}>
          {formInputs}
          <Button type="Success" disabled={!this.state.formIsValid}>
            SUBMIT
          </Button>
        </form>
        <Button type="Danger" clicked={this.switchAuthModeHandler}>
          SWITCH TO
          {this.state.isSignup ? " SIGNIN" : " SIGNUP"}
        </Button>
        {errorMessage}
      </div>
    );

    if (this.props.loading) {
      output = <Spinner />;
    }

    return output;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetRedirectPath: ()=>dispatch(actions.setAuthRedirectPath('/'))
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
