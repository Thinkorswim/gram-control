
export class Settings {
  constructor(
    public recommendationsDisabled: boolean = true, 
    public explorePageDisabled: boolean = true,
    public reelsPageDisabled: boolean = true,
    public suggestedFriendsDisabled: boolean = true,
    public commentsDisabled: boolean = true,
    public hideStoriesOnMainPage: boolean = false,
  ) {}

  toJSON(): {
    recommendationsDisabled: boolean;
    explorePageDisabled: boolean;
    reelsPageDisabled: boolean;
    suggestedFriendsDisabled: boolean;
    commentsDisabled: boolean;
    hideStoriesOnMainPage: boolean;
   } {
    return {
        recommendationsDisabled: this.recommendationsDisabled,
        explorePageDisabled: this.explorePageDisabled,
        reelsPageDisabled: this.reelsPageDisabled,
        suggestedFriendsDisabled: this.suggestedFriendsDisabled,
        commentsDisabled: this.commentsDisabled,
        hideStoriesOnMainPage: this.hideStoriesOnMainPage,
    };
  }

  static fromJSON(json: {
    recommendationsDisabled: boolean;
    explorePageDisabled: boolean;
    reelsPageDisabled: boolean;
    suggestedFriendsDisabled: boolean;
    commentsDisabled: boolean;
    hideStoriesOnMainPage: boolean;
   }): Settings {
    return new Settings(
        json.recommendationsDisabled,
        json.explorePageDisabled,
        json.reelsPageDisabled,
        json.suggestedFriendsDisabled,
        json.commentsDisabled,
        json.hideStoriesOnMainPage,
    );
  }
}