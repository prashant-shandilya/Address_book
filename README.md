# Address_book

This API maintains address books.

It's features are adding single contact,adding multiple contact,get authorized, delete contact,update contact,find contact,get desired number of contacts.


* GET AUTHENTICATED
   Firstly you must posess a passkey (allowed passkeys are kept in passkey.js) , then 
   POST     /get_auth
   {
    "passkey":"example passkey"
   }
   
   This will return your JWT token 
   
   {
   "token":"example token"
   }
   This token is used at every single endpoint in the web app to get authorized without it you are not allowed to make requests.
   
   
*ADD SINGLE CONTACT
   POST   /contact/add_single
   {
   "name":"Prashant kumar",
   "address":"ranchi",
   "P_number":"7678789878",
   "token":"your jwt token"
   }
  it will post this contact on the database.
  
 
*ADD BULK CONTACT
  POST    /contact/add_bulk
  {
    contacts:[{"name":"Prashant kumar",
   "address":"ranchi",
   "P_number":"7678789878"},
   {
   "name":"vikalp shandilya",
   "address":"delhi",
   "P_number":"8978675645"
   }]
   "token":"your jwt token"
  }
  
  
*DELETE CONTACT
  DELETE   /contact/delete/<contact id>
  {
  "token":<your token>
  }
  
  
*UPDATE CONTACT
  PUT   /contact/update/<contact id>
  {
   "name":"vikalp shandilya",
    "address":"lucknow",
  "P_number":"9898989878",
  "token":<your jwt token>
  }
  
  
*FIND SINGLE CONTACT
 POST     /contact/<contact id>
  {
  "token":<your jwt token>
  }
  
  
*PAGINATION
 POST     /contact/fetch/<number of contacts to display>
 {
  "token":<your jwt token>
 }
 return the specified numbers of contacts sorted in ascending order by names.
  
  
*PHRASE MATCHING
 POST     /contact/match
  {
    "name":"gupta",
    "address":"delhi",
    "P_number":"",
    "token":<your jwt token>
  }
  this will return the contacts with name having "gupta" and address having "delhi" substring in it.If some field are left blank it will not 
  do filtering on it. Increasing the number of data in the fields narrows the search result.
 
   
   Comment is a good way to know if it works.
  
   This is the new branch.

  
  
   
   

