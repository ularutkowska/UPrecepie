export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public name: string,
    public surname: string,
    public submitted_recipes: string[],
    public favourite_list: string[]
  ) {}
}
