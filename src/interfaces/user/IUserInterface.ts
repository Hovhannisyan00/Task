export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  created_at: Date;
}

export interface IUserWithPassword extends IUser {
  password: string;
}
