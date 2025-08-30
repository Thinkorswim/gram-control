
export class Settings {
  constructor(
    public recommendationsDisabled: boolean = true, 
    public explorePageDisabled: boolean = true,
    public reelsPageDisabled: boolean = true,
    public suggestedFriendsDisabled: boolean = true,
    public commentsDisabled: boolean = true,
  ) {}

  toJSON(): { 
    recommendationsDisabled: boolean;
    explorePageDisabled: boolean;
    reelsPageDisabled: boolean;
    suggestedFriendsDisabled: boolean;
    commentsDisabled: boolean;
   } {
    return {
        recommendationsDisabled: this.recommendationsDisabled,
        explorePageDisabled: this.explorePageDisabled,
        reelsPageDisabled: this.reelsPageDisabled,
        suggestedFriendsDisabled: this.suggestedFriendsDisabled,
        commentsDisabled: this.commentsDisabled,
    };
  }

  static fromJSON(json: {
    recommendationsDisabled: boolean;
    explorePageDisabled: boolean;
    reelsPageDisabled: boolean;
    suggestedFriendsDisabled: boolean;
    commentsDisabled: boolean;

   }): Settings {
    return new Settings(
        json.recommendationsDisabled,
        json.explorePageDisabled,
        json.reelsPageDisabled,
        json.suggestedFriendsDisabled,
        json.commentsDisabled,
    );
  }
}