# Auth api
- POST /signUp
- POST /login
- POST /logout

# viewing & updating profile 
- GET /profile/view
- PATCH /profile/update

# password reset
- PATCH /forgotPassword


# connections
- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted
- POST /request/review/rejected

# feed
- GET /users/feed
- GET /users/connections
- GET /users/request