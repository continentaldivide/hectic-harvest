# hectic harvest

## hop to it

Cozy farming games like Harvest Moon and Stardew Valley are near and dear to my heart. They're a great way to unwind and destress...at least, that's what I used to think. In reality, these games have a frenetic quality that finds me rushing to till fields before the sun goes down, maximize my pumpkin yields (have to harvest today -- it's almost winter!), racing to finish my fishing before the shop closes so I can sell my haul...and the list goes on.

Hectic Harvest is a gentle jab at the strange dichotomy of the stressful peaceful farming sim. You play Taylor, the harried hare hurrying to bring order to the garden and maximize its output. You'll race against the clock as crops quickly grow across several rows of tilled soil, and the more you can collect before time runs out, the longer you'll be able to _veg out_ and enjoy the _fruits_ of your labor.

## Tech Stack

- HTML/CSS/JS DOM + Canvas
- Assets from [itch.io](https://cupnooble.itch.io/sprout-lands-asset-pack)
- Likely some implementation of Phaser

## Wireframe

![Wireframe](Project1Wireframe.png)

## MVP Goals

- Game is a 'race against the clock' -- game ends when the timer runs out.
- User has a controllable avatar that can walk between rows of crops and interact to collect them.
- Score increases for each crop harvested.
- Win state can be based on certain point thresholds, or the game objective can simply be attaining the highest possible score.

## Stretch Goals

- Crops need to be watered to be harvested! Instead of a single interaction, each crop will require multiple interactions -- watering to allow a sprout to progress and harvesting when it's mature.
- Point variance system: different crops are worth different amounts of points.
- Poison mushrooms! Better not touch these...
- Different difficulty levels. (Faster/shorter clock? Faster crop spawns? Higher point threshold for victory?)

## Potential Roadblocks

- I've decided to do a canvas project instead of a DOM project because I have no experience with Canvas and thus it represents a greater opportunity for growth. Of course, this means it's very hard to estimate whether I can accomplish what I have in mind within a week. To account for this, I've shaved as much as I can from MVP into the stretch goals while still leaving a functional and entertaining game.
