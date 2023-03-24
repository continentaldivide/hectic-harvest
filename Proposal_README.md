# hectic harvest

## hop to it

Cozy farming games like Harvest Moon and Stardew Valley are near and dear to my heart. They're a great way to unwind and destress...at least, that's what I used to think. In reality, these games have a frenetic quality that finds me rushing to till fields before the sun goes down, maximize my pumpkin yields (have to harvest today -- it's almost winter!), racing to finish my fishing before the shop closes so I can sell my haul...and the list goes on.

Hectic Harvest is a gentle jab at the strange dichotomy of the stressful peaceful farming sim. You play Taylor, the harried hare hurrying to bring order to the garden and maximize its output. You'll race against the clock as crops quickly grow across several rows of tilled soil, and the more you can collect before time runs out, the longer you'll be able to _veg out_ and enjoy the _fruits_ of your labor after a hard day's work.

## Tech Stack

- HTML/CSS/JS DOM + Canvas
- Assets from [itch.io](https://cupnooble.itch.io/sprout-lands-asset-pack)
- If time permits, possibly Phaser 3.5

## Wireframe

![Wireframe](Project1Wireframe.png)

## MVP Goals

- Game starts with an unskippable instructions page describing the game objective and controls.
- Game is a 'race against the clock' -- game ends when the timer runs out.
- User has a controllable avatar that can walk between rows of crops and interact to collect them. Interact uses hit detection; if avatar is touching/standing on a crop, that crop can be harvested with a button press.
- Score increases for each crop harvested.
- Game has no direct win/loss condition; objective is simply to maximize points within the time limit.

## Stretch Goals

- Add an additional 'narrative/flavor' opening screen.
- Add custom assets from itch.io.
- Add ability to pause game and/or re-display instructions.
- Create some kind of 'movement penalty' with crop lines. Maybe they're bounded as impassable, or maybe the player moves more slowly while intersecting the crop line.
- Crops need to be watered to be harvested! Instead of a single interaction, each crop will require multiple interactions -- watering to allow a sprout to progress and harvesting when it's mature.
- Point variance system: different crops are worth different amounts of points.
- Poison mushrooms! Better not touch these...
- Different difficulty levels. (Faster/shorter clock? Faster crop spawns? Higher point threshold for victory?)
- If firing on all cylinders with other objectives, possibly integrate phaser.

## Potential Roadblocks

- I've decided to do a canvas project instead of a DOM project because I have no experience with Canvas and thus it represents a greater opportunity for growth. Of course, this means it's very hard to estimate whether I can accomplish what I have in mind within a week. To account for this, I've shaved as much as I can from MVP into the stretch goals while still leaving a functional and entertaining game.
