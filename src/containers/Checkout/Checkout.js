import React, { Component } from 'react'
import {Route, Redirect} from "react-router-dom"
import {connect} from 'react-redux'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'
// import * as actions from '../../store/actions/index'


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
        let summary = <Redirect to='/'/>
        if(this.props.ings){
            const purchaseRedirect = this.props.purchased ? <Redirect to='/'/> : null
            summary = (
                <div>
                    {purchaseRedirect}
                    <CheckoutSummary 
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutConfirmed={this.checkoutConfirmedHandler}
                        ingredients={this.props.ings}/>
                    <Route path={this.props.match.url + '/contact-data'}
                        component={ContactData} //render={(props)=> <ContactData {...props} price={this.props.price} ingredients={this.props.ings}/>}
                        />
                </div>
            )
        }
        return summary
    }
}

const mapStateToProps = state=>{
    return{
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout)