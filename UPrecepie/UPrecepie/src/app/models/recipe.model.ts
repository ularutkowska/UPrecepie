import { Rating } from './rating.model';


export class Recipe {
  constructor(
    public id: string, 
    public title: string,
    public description: string,
    public ingredients: string[],
    public instructions: string[],
    public categoryName: string,
    public preparation_time: number,
    public rating: number,
    public ratings: Rating[],
    public comments: string[] 
  ) {}
}
