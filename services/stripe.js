const { createLogger } = require('logger');
const CONFIG = require('../config/stripe.config.json');
const stripe = require('stripe')(CONFIG.development.secret_key);

 
// Define a function to create a customer and charge them for a trial period using the provided payment method
async function createCustomerAndCharge(email, paymentMethodId, trialPeriodDays, subscriptionPlanId) {
  try {
    // Check if the customer has subscribed before
    const existingCustomer = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    // If the customer has subscribed before, return an error
    if (existingCustomer.data.length > 0) {
      throw new Error('Customer has already subscribed');
    }

    // Create a customer with the provided email and payment method
    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

    // Set the payment method as the customer's default payment method
    await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: paymentMethodId } });

    // Create a subscription for the customer with the provided trial period and plan
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      trial_period_days: trialPeriodDays,
      items: [{ plan: subscriptionPlanId }],
    });

    console.log(`Customer ${customer.id} subscribed with trial period of ${trialPeriodDays} days using payment method ${paymentMethodId}`);

    return customer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Define a function to charge a customer for their subscription after the trial period ends using the provided payment method
async function chargeCustomer(email, paymentMethodId, subscriptionId) {
  try {

    //Get the customer
    const existingCustomer = await stripe.customers.list({
        email: email,
        limit: 1,
      });
    // Get the customer's subscription

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
console.log(existingCustomer)
    // Charge the customer for the subscription using the provided payment method
    const invoice = await stripe.invoices.create({
      customer: existingCustomer.data[0].id,
      subscription: subscriptionId,
      //payment_method: paymentMethodId,
      auto_advance: true,
    });

    console.log(`Customer ${existingCustomer.id} charged for subscription ${subscriptionId} using payment method ${paymentMethodId}`);

    return invoice;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Call the createCustomerAndCharge function to create a customer and charge them for a trial period using a credit card payment method
// createCustomerAndCharge('test@example.com', '<credit_card_payment_method_id>', 7, '<subscription_plan_id>')
//   .then((customer) => {
//     // After the trial period ends, check if the customer has subscribed and charge them if they haven't using a giro payment method
//     setTimeout(async () => {
//       const subscriptions = await stripe.subscriptions.list({
//         customer: customer.id,
//         status: 'active',
//       });

//       if (subscriptions.data.length === 0) {
//         await chargeCustomer(customer.id, '<giro_payment_method_id>', customer.subscriptions.data[0].id);
//       }
//     }, 604800000); // 7 days in milliseconds
//   });

// Call the createCustomerAndCharge function to create a customer and charge them for a trial period using a PayPal payment method
// createCustomerAndCharge('test@example.com', '<paypal_payment_method_id>', 7, '<subscription_plan_id>')
//   .then((customer) => {
//     // After the trial period ends, check if the customer has subscribed and charge them if they haven't using a PayPal payment method
//     setTimeout(async () => {
//       const subscriptions = await stripe.subscriptions.list({
//         customer: customer.id,
//         status: 'active',
//       });

//       if (subscriptions.data.length === 0) {
//         await chargeCustomer(customer.id, '<paypal_payment_method_id>', customer.subscriptions.data[0].id);
//       }
//     }, 604800000); // 7 days in milliseconds
//   });


// Define a function to create a PaymentMethod object for a credit card payment
async function createCreditCardPaymentMethod(cardNumber, cardExpMonth, cardExpYear, cardCvc) {
  try {

    //Retrieve all Poducts and Subscription


    const products = await stripe.products.list();
    const subscriptions = await stripe.subscriptions.list();

    const productIds = products.data.map((product) => product.id);
    const subscriptionIds = subscriptions.data.map((subscription) => subscription.id);

    console.log(`Product IDs: ${productIds}`);
    console.log(`Subscription IDs: ${subscriptionIds}`);
 




    // Create a PaymentMethod object with the credit card details
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     number: cardNumber,
    //     exp_month: cardExpMonth,
    //     exp_year: cardExpYear,
    //     cvc: cardCvc,
    //   },
    // });

    // console.log(`Credit card PaymentMethod ${paymentMethod.id} created`);

    // return paymentMethod;
    return 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Call the createCreditCardPaymentMethod function to create a PaymentMethod object for a credit card payment
// createCreditCardPaymentMethod('4242424242424242', 12, 2024, '123')
//   .then((paymentMethod) => {
//     // Use the PaymentMethod object to create a customer and charge them for a trial period
//     createCustomerAndCharge('test@example.com', paymentMethod.id, 7, '<subscription_plan_id>');
//   });

 module.exports = {
     createCreditCardPaymentMethod, createCustomerAndCharge, chargeCustomer
 }