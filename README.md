# RainyDay

An app designed to help people remember and act on the things they’ve been saving for “a rainy day" or taken a "rain check" on.

## App Features

### RainChecks
The main feature of the app is the ability to create "RainChecks" that contain the details of what it is the user wants to do, but has not yet (e.g., "Drink that fancy bottle of wine I got as a gift"). After creating an account and logging in, users are able to create these RainChecks and fill in a variety of details (e.g., title, description, representative emoji, image, URL, and privacy). After creating a RainCheck, users are able to view their pending RainChecks from their dashboard. From here, clicking on any RainCheck allows the user to view the details of said RainCheck. Users are also able to edit a RainCheck's details, or delete it entirely.

### Reminder Types
Users can currently be reminded of their RainChecks in 3 different ways:
- Rain: a reminder is sent the next time it rains in the user's location.
- Random: a reminder is sent at a random date at any point from the day of RainCheck creation to 365 days later.
- Fixed: a reminder is sent at a specific day selected by the user.

### Friend System
The app also has a planned "friend system", wherein a user can send a friend request to another user. This allows each user to see the public RainChecks of their friend, as well as send encouragements to complete said RainChecks.

## Tech Stack
- React Native (Expo)
- Firebase (Auth, Firestore, Notifications)
- OpenWeatherMap API

## RainyDay was designed and developed by Ameer Ahmad
