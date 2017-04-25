# Inception and Purpose

This app was developed as part of the Web Development Intensive program at General Assemably.  The goal was to make a full CRUD app on the MEN stack.  I chose to make a deck-building app for Magic: The Gathering (a trading card game, henceforth referred to as "MtG" in this document). The MVP I had set for myself was to allow users the ability to create, edit, read, and delete accounts, cards from their collection, and decks they had constructed using those cards.  The card information was to be attained from a third party API.  Two reach goals were to allow users to view a sample hand of seven cards and playtest their decks as if they were playing a game of MtG.

# Synopsis

From the ground up, I knew that users would find the most value from this app if it was mobile responsive, and so all styling decisions were made with that in mind.  The app quickly arrived at the MVP.  Once a user has made an account and logged in, they will be navigated to their decks index page.  Under the cards menu, a user will see all of the cards in their collection.  They can hit the red "X" button to delete a card from their collection and can hit "Add Cards" to query the API for any MtG card ever printed.

Once they have all the cards for a given deck, they can navigate back to their deck index page, select "Create Deck", and choose a name and format (what type of games this deck is meant to play) for the deck.  They can then select the name of any of their decks to view that deck's show page.  On the show page, they can see the total number of cards in the deck, each card and its quantity in the deck, a sample hand of seven randomly selected cards, go to playtest the deck, or edit the deck.  The edit page allows users to add cards from their collection, adjust the quantities of those cards, rename the deck or format, or delete the deck.  When they save those changes they are redirected backa to the deck's show page.

When a user decides to playtest a given deck, they are redirected to the playtest view.  Here, they can see all the different zones that exist in an MtG game (battlefield, hand, library, graveyard, and exile).  To begin or restart the playtest, the user selects "Start".  Moving cards from one zone to another is as easy as selecting the card and telling it where to go within the modal that pops up.  "Draw" will move the top card from the library into the hand.  A user can perform all other actions from an MtG game (create tokens and tap/untap cards on the battlefield) except creating counters to put onto cards which is a feature still being developed.

The entire app is easily used on mobile and can be used to playtest against your friends' or your own decks on another device or in paper.  Hidden information is easily kept hidden through the use of modals.  When a user is done playtesting, they can select "Back" to return to the main app.

# Planning

Everything here is designed to make the user feel the same way as when you are actually playing with the cards, no matter the screen size.  I could just have every user have every card in the database in their collection, but then what's the point of calling it YOUR collection?! I could have implemented a lot more features into this app if I just used card names instead of images, but it just wouldn't feel the same.  If you have any experience playing the game, you know that players love to shuffle cards in their hand around. That is why I knew I wanted to implement the carousel for the sample hand feature.

You can find my Trello board [HERE](https://trello.com/b/cKbQ1aau/deckedout)

Here are some images of my initial planning process:

My initial planning:

![Alt text](./public/images/startOfPlanning.jpg?raw=true)

My initial data map and ERD:

![Alt text](./public/images/initialDataMap.jpg?raw=true)
![Alt text](./public/images/ERD.jpg?raw=true)

My initial wireframes:

![Alt text](./public/images/initialWireframe.jpg?raw=true)

![Alt text](./public/images/playtestWireframe.jpg?raw=true)

# Technology Used
	
	* HTML5/CSS
	* Materialize CSS
	* JavaScript
	* Jquery
	* Node.js
	* magicthegathering.io
	* AJAX
	* MongoDB/Mongoose
	* Express

# To Do

I am working to add counter functionality to the playtest view.  I am also working to incorporate Passport in this app for authentication and authorization.  Another goal of mine is to find a good way to handle error responses from the forms and third party API.

# More On This Project and Me

I love puzzles, coding, and MtG so I really loved working on this project.  You can find the deployed app [HERE](https://quiet-tor-58343.herokuapp.com/).  Please feel free to make a pull or send me any comments/feedback at liamtrobinson@gmail.com.  To see some more work I've done check out my portfolio site [HERE](http://gunner-lizard-82827.bitballoon.com/).  Thanks for reading and I hope you have as much fun using this app as I did making it!