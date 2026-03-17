## Website Feature Improvement Requirement


### Change the order of the game page

- Refer to `src/routes/games/$gameId.tsx` for the current order

- The game recaps (video-section) is currently placed at the bottom of the page, it should be moved to the top of the page, right below the game score card.

### Allow team captains to customize player performance metrics

- Refer to `src/routes/players/$playerId.tsx` 

- There is a radar chart that displays the player's performance metrics, the team captain should be able to select which metrics to display on the radar chart which directly affects the player stats table (will be added in the future)


### Game schedule label

- Refer to `lib/components/schedules/schedule-view.tsx` and `lib/components/games/game-card.tsx`

- If there are games that are not marked as complete and have passed the game date, they should be labelled as "cancelled"
