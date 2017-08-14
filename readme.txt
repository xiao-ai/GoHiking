Project: Go Hiking
Heroku: https://gohiking.herokuapp.com/#!/index
GitHub: https://github.com/xiao-ai/GoHiking



***
Note: 
This app is built on http server, however, the third party API I am using is based on https. 

So I am having trouble to fix the CORS issue when calling the third party API. Since time is short for the project,
I don't have much time to build my project on https.

If you are using Chrome, please install and enable Allow-Control-Allow-Origin: * on your Chrome to bypass the CORS issue.
You can find and download it from here: 
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

Thank you very much!!!



***
I created a new repository on github for this project. And I have invited my TA (Zhang Yin) and Professor
Huo Ming as the collaborator.




*** User Info
Admin user:
username: admin
password: admin

Regular user:
username: user1
password: user1



***
Guidance on using this web project:

*** Login: https://gohiking.herokuapp.com/#!/login
In the login page, user can type the username and password to login. User can also login with his/her google account.
In the meantime, user can also click "create an account" to register, it will redirect user to register page:
https://gohiking.herokuapp.com/#!/register

*** Trails:
This is the homepage link, https://gohiking.herokuapp.com/#!/index, when click the red button "Start Hiking", it will
redirect user to trails search page.

User can type any places/cities/state to search the nearby trailheads. The search widget can autocomplete and predict
what user might want to search, once user clicks the places, the trailheads near that location will show up on the
right part of the website.

User can add the trail into his/her favorite trails by clicking the "heart" icon on the right side of the trail info
box. Only when user if logged in can he/she add trails to his/her favorite list. If user are currently not logged in,
then it will redirect user to login page.


*** User Profile
Click the avatar on the up-right corner of the web page, then click "My Profile" in the dropdown list to go to the
profile page. User can update his/her profile, upload the avatar and change the password.


*** Search/Follow/Unfollow Users
Click the avatar on the up-right corner of the web page, then click "Search Users" in the dropdown list to go to the
search user page.

The search widget supports fuzzy search, it will return all the users when the search text matches any of the following:
username, first name, last name, email. The dropdown menu on the up-right corner shows how many followers the user has,
and how many users he's following.

*** Admin Function
There's a user management page for admin user. Admin user can see all the users, update user profile,
and disable the user.
Once the user is disabled, that user can't login to the website anymore.









