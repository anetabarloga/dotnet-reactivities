# Guided Project on .NET Core with React

# About

The project is a simplistic social platform for group activities planning with real-time chat messaging system. The app is currently deployed through Heroku and can be accessed here (may take a moment to load for the first time):
https://dotnet-reactivities.herokuapp.com/

Disclaimer: The app is created for learning purposes and thus some errors are expected. If you notice any, feel free to drop me a message as I am planning to maintain the app to further improve my skills.

## Technology Stack

- Backend
    - C# .NET 6.0
    - SignalR is used for real-time connection for the chat hub feature
- Frontend
    - React with npm & nodeJS
    - Axios client for http requests
    - MobX is used for state management client-side
    - Formik and Yup are used for forms and input validation client-side
    - Semantic UI is used for out-of-the-box CSS styling
- Deployment & source control
    - Heroku
    - PostgresQL (migrated from SQLite)
    - Github

## Future content

- Interface redesign
- Password reset
- Private messaging feature
- Expand user profile features: interest tags, location, age
- design for mobile
- add google maps markers and sorting events by 'nearby' and geolocation

## Bug Reports

- image uploads size restriction
- password complexity too steep
- permissions issue: logging in as different user after logout does not refresh the feed content. Content must be manually refreshed using Ctlr + R on Windows or Cmd + R on MacOS

## FAQ

## Credits

The application was developed following the Udemy course 'Complete Guide to Building an App with Net Core and React' by Neil Cummings.
