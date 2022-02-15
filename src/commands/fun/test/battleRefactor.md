# battle.js Refactor

## Current issues

* Nested function declarations are confusing
* Functions change variables they do not take in > This is not necessarily bad but with async functions everywhere compounded with the other issues it's bad
* Flow is hard to understand, program structure is bad -> This brings in issues of scalability later on where it's hard to remove, add and/or change things
  
## Aims

* Improve command flow for greater readability (top down flow instead of jumping around, maybe less unstructured calling and declarations of async functions)
* Represent state of battle in a clearer way that increases readability and allows for easier modification in the future

## Achieved by
* Storing battle state in a class
* Separating functions for clarity
* Improving functions to do more specific tasks

## Structure

1. Find user
2. Create enemy (from battleUtil), get effects messages (from ticketUtil)
3. Initialize a new battle with the Battle class, passing in user and newly created enemy
4. Call methods on Battle class to start rounds, check hp at each turn, calculate damage, return winner etc.
5. Get winner, exp, gold etc.

## class Battle

* Contain methods which are functions that were defined in original battle
* Stores battle state
* Constructor takes in enemy and player