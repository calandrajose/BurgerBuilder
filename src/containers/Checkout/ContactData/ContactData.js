import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'
import spinner from "../../../components/UI/Spinner/Spinner";

export default class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      zipcode: "",
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price, //should be calculated on server side
      customer: {
        name: "Jose Calandra",
        address: {
          street: "Test 123",
          zipCode: "123456",
          country: "Argentina",
        },
        email: "test@test.com",
      },
      purchaseMethod: "takeaway",
    };
    axios
      .post("/orders.json", order)
      .then((resp) =>{
        this.setState({loading: false,purchasing: false })
        this.props.history.push('/')
      })
      .catch((err) => this.setState({ loading: false, purchasing: false }));
  };

  render() {
    let form = (<form>
      <input
        className={classes.Input}
        type="text"
        name="name"
        placeholder="Your Name"
      ></input>
      <input
        className={classes.Input}
        type="email"
        name="email"
        placeholder="Your E-Mail"
      ></input>
      <input
        className={classes.Input}
        type="text"
        name="street"
        placeholder="Street"
      ></input>
      <input
        className={classes.Input}
        type="text"
        name="zipcode"
        placeholder="zipcode"
      ></input>
      <Button clicked={this.orderHandler} type="Success">
        ORDER
      </Button>
    </form>);
    if(this.state.loading){
      form = <Spinner/>
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}
