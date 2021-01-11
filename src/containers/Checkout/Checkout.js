import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import {Route} from "react-router-dom"
import ContactData from './ContactData/ContactData'
import {connect} from 'react-redux'


 class Checkout extends Component {
/*     state = {
        ingredients: null,
        totalPrice: 0
    }

    UNSAFE_componentWillMount (){
        const query = new URLSearchParams(this.props.location.search)
        const ingredients = {};
        let price=null;
        for(let param of query.entries()){
            if(param[0] ==='price'){
                price = param[1]
            }else{
                ingredients[param[0]] = +param[1]
            }
        }
        this.setState({ingredients : ingredients, totalPrice: price})
    } */

    checkoutConfirmedHandler = ()=>{
        this.props.history.replace('/checkout/contact-data')
    }
    
    checkoutCancelledHandler = ()=>{
        this.props.history.goBack()
    }

    render() {
        
        return (
            <div>
                <CheckoutSummary 
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutConfirmed={this.checkoutConfirmedHandler}
                ingredients={this.props.ings}/>
                <Route path={this.props.match.url + '/contact-data'}
                component={ContactData}
                 //render={(props)=> <ContactData {...props} price={this.props.price} ingredients={this.props.ings}/>}
                 />
            </div>
        )
    }
}

const mapStateToProps = state=>{
    return{
        ings: state.ingredients,
    }
}

export default connect(mapStateToProps)(Checkout)