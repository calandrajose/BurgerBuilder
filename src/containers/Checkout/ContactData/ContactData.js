import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import {connect} from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import {updateObject} from '../../../shared/utility'

 class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name",
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      }
      ,
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your address",
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP Code",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your E-mail",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
      },
        valid: false,
        touched: false
      },
      purchaseMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "delivery", displayValue: "Delivery" },
            { value: "takeaway", displayValue: "Takeaway" },
          ],
        },
        value: "delivery",
        validation: {},
        touched: false,
        valid: true
      },
    },
    formIsValid: false
  };

  // componentDidMount(){
  //   this.setState({name: this.createFormField('input', 'text', 'your name')})
  // }

  // createFormField = (elementType, type, placeholder) => {
  //   return {
  //     elementType: elementType,
  //     elementConfig: {
  //       type: type,
  //       placeholder: placeholder,
  //     },
  //     value: "",
  //     validation: {
  //       required: true
  //     },
  //     valid: false,
  //     touched: false
  //   };
  // };

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};

    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price, //should be calculated on server side
      orderData: formData,
      userId: this.props.userId
    };

      this.props.onOrderBurger(order, this.props.token)
  };

  validateInputs = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength && rules.maxLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
  }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  };

  inputChangeHandler = (event, inputId) => {
    

    const updatedFormElement = updateObject(this.state.orderForm[inputId],{
      value:event.target.value,
      valid:this.validateInputs(event.target.value, this.state.orderForm[inputId].validation),
      touched:true
    } );

    const updatedOrderForm = updateObject(this.state.orderForm,{
      [inputId]:updatedFormElement
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });

  };

  render() {
    const formElementsArr = [];

    for (let key in this.state.orderForm) {
      formElementsArr.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArr.map((element) => (
          <Input
            key={element.id} //equals to key (name, address, etc)
            valid={element.config.valid}
            touched={element.config.touched}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            value={element.config.value}
            changed={(event) => this.inputChangeHandler(event, element.id)}
          />
        ))}

        <Button type="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state=>{
  return{
      ings: state.burgerBuilder.ingredients,
      price: state.burgerBuilder.totalPrice,
      loading: state.order.loading,
      token: state.auth.token,
      userId: state.auth.userId
  }
}

const mapDispatchToProps= dispatch=>{
  return{
    onOrderBurger: (orderData, token)=> dispatch(actions.purchaseBurger(orderData, token))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData,axios))