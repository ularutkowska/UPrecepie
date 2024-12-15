export class Comment {
  constructor(
    public id: string, 
    public recipeId: string, 
    public userId: string, 
    public content: string,
    public date: Date
  ) {}
}
