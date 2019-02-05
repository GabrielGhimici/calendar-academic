export interface ProfileState {
  data: Profile,
  loading: boolean,
  error: any
}

export class Profile {
  constructor(
    public username: string = '',
    public email: string = '',
    public affiliation: string = '',
    public firstLogin: boolean = null,
    public rights: number = null
  ) {}
}
