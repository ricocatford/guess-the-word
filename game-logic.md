# Game Logic
## Program Workflow
1. Call randomWords API for generating an array of random words.
2. Call freeDictionary API for finding a word.
3. Iterate through array in search of a matching word.
4. Split word into characters.
5. Generate an array of random numbers for altering display of certain characters.
6. Sort order of the previously generated array.
7. Start setting game object.
8. Display game onto screen.
9. Players turn, has 60 seconds and 5 tries.
10. Check for users input and process it.
11. Update screen once input has been checked.
12. When turn ends, stop game.
13. Display scores (total rounds/words, correct and incorrect answers, win ratio %).
14. Display buttons for QUIT game or NEXT ROUND.
15. If QUIT game is chosen, return to Main screen. If Next Round, update game status and back to step 1.
