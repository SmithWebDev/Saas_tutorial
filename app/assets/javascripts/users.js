/* global $, Stripe */
//Document Ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  //Set Stripe Public Key
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content'));
   
  //When user clicks form submit btn
  submitBtn.click(function(event){
    
  //prevent default submission behavior
  event.preventDefault();
  submitBtn.val('Processing').prop('disabled', true);
  
  //Collect card fields.
  var ccNum = $('#card_number').val(),
      cvcNum = $('#card_code').val(),
      expMon = $('card_month').val(),
      expYear = $('card_year').val();
      
  //Use Stripe JS library to check for card errors
  var error = false;
  
  //Validate card number
  if( !Stripe.card.validateCardNumber(ccNum)){
    error = true;
    alert('The credit card number appears to be invalid');
  }
  
  //Validate card number
  if( !Stripe.card.validateCVC(cvcNum)){
    error = true;
    alert('The CVC number appears to be invalid');
  }
  
  //Validate card number
  if( !Stripe.card.validateExpiry(expMon, expYear)){
    error = true;
    alert('The expiration date appears to be invalid');
  }
  
  
  if (error){
    //If there are card error, dont send to stripe
    submitBtn.prop('disabled', false).val('Sign Up')
  }
  else{
    
  //Send the card info to Stripe.
  Stripe.createToken({
    number: ccNum,
    cvc: cvcNum,
    exp_month: expMon,
    exp_year: expYear
  }, stripeResponseHandler);
  }
  
  
  return false;
  });
  
  //Stripe returns card token
  function stripeResponseHandler(status, response){
    //Get Token from response
    var token = response.id;
    
    //Inject card token as hidden field into form.
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //Submit form to our Rails app
    theForm.get(0).submit();
  }

});
