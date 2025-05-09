export interface IUser{
  userName: string;
  email: string;
  token: string;
  avatar?: string;
  id: string;
  isOnline?: boolean;
}

export interface IUserFormValues{
  userName: string;
  email: string;
  password: string;
  avatar?: string;
}
