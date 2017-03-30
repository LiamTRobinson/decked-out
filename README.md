# decked-out
MtG Playtest App

This is a Magic: The Gathering app designed for creating, reading, updating, and deleting custom decks with cards searched up by the MtG API. This app was designed from the ground up with the intention of being mobile ready.  Everything was planned knowing that I only had 5 days to complete this project for General Assembly's Web Development Intensive.

Because I knew I wanted my users to be able to use my app on the go, I decided early on that I wanted to use the materialize framework.  The first thing I did for this project was plan the data mapping and the general framework as seen below:

![Alt text](/images/startOfPlanning.jpg?raw=true)
![Alt text](/images/initialWireframe.jpg?raw=true)
![Alt text](/images/initialDataMap.jpg?raw=true)
![Alt text](/images/ERD.jpg?raw=true)
![Alt text](/images/playtestWireframe.jpg?raw=true)

Everything here is designed to make the user feel the same way as when you are actually playing with the cards.  I could just have every user have every card in the database in their collection, but then what's the point of calling it YOUR collection?! I could have implemented a lot more features into this app if I just used card names instead of images, but it just wouldn't feel the same.  If you have any experience playing the game, you know that players love to shuffle cards in their hand around. That is why the carousel is implemented for the sample hand feature. If you play magic and find yourself testing my app on heroku: 

<a href="https://quiet-tor-58343.herokuapp.com/">Heroku Deployment</a>

PLEASE let me know what you think and what you would like to see added.

After I hit my MVP, I went to work on making a playtest functionality that will let users do most, if not all (I still have a couple hours to work on this app as of writing this!) actions that can be performed in an MtG game. 

I used Jquery, Materialize, and magicthegathering.io when creating this project.  You can see my process here on this user story board:

<a href="https://trello.com/b/cKbQ1aau/deckedout">Trello Board</a>

Thanks for reading and please enjoy my app!

For more things I've done you can check out my portfolio site here

<a href="https://github.com/LiamTRobinson/profile_site">Profile Site</a>