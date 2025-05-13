import { computed, observable, action, makeObservable, runInAction } from "mobx";
import agent from "../Api/agent";
import { IUser, IUserFormValues } from "../Models/users";
import { RootStore } from "./rootStore";
import md5 from 'md5';
import { HubConnection } from "@aspnet/signalr";

export default class UserStore {
  @observable user: IUser | null = null
  rootStore: RootStore
  @observable navigate: ((path: string) => void) | null = null
  @observable users: IUser[] = []
  @observable.ref hubConnection: HubConnection | null = null

  constructor(rootStore: RootStore)
  {
    makeObservable(this)
    this.rootStore = rootStore
  }

  @computed get IsLoggedIn() {
    console.log("logeado: "+!!this.user)
    return !!this.user
  }

  @action setNavigate = (navigateFn: (path: string) => void) => {
    this.navigate = navigateFn
  }
  @action login = async (values: IUserFormValues) => {
    try
    {
      /*const connection = this.rootStore.commonStore.hubConnection;
      if (!connection) throw new Error("Hub connection is not established");
      await connection.invoke('Login', values);*/
      var user = await agent.User.login(values)
      console.log("EL USUARIO LOGEO: "+JSON.stringify(user, undefined , 2))
      debugger;
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token)
      })
      await this.rootStore.commonStore.restartHubConnection();
      const connection = this.rootStore.commonStore.hubConnection
      if (!connection) throw new Error("Hub connection is not established userStore")
      this.navigate?.("/");
      await connection.invoke('Login', values)
    }
    catch(error) 
    {
      console.log(error)
      throw error
    }
  }
  @action logout = async (id: string) => {
    try{
      await agent.User.logout(id)
      debugger
      const connection = this.rootStore.commonStore.hubConnection
      if (!connection) throw new Error("Hub connection is not established userStore")
      await connection.invoke('Logout', id)
      
      runInAction(() => {
        this.rootStore.commonStore.setToken(null)
        this.user = null
        this.navigate?.("/login");
      });
    }
    catch(error){
      console.log(error)
      throw error
    }
  }
  @action register = async (values: IUserFormValues) => {
    try{
      values.avatar = `http://gravatar.com/avatar/${md5(values.email)}?d=identicon`
      var user = await agent.User.register(values)
      runInAction(() => {
        this.user = user
        this.navigate?.("/");
        this.rootStore.commonStore.setToken(user.token)
      });
    }
    catch(error){
      console.log("Error en el register: "+error)
      throw error
    }
  }
  @action setCurrentUser = async() => {
    try{
      var user = await agent.User.current()
      runInAction(() => {
        this.user = user
        console.log("se ejecuto setCurrentUser")
      });
    }
    catch(error){
      throw error
    }
  }
  @action getCurrentUser = () => {
    console.log("se ejecuto getCurrentUser")
    return this.user
  }
  @action getUser = async () => {
    try {
      const user = await agent.User.current()
      runInAction(() => {
        this.user = user
      })
    }
    catch(error){
      throw error
    }
  }
  @action loadUsers = async () => {
    try{
      const users = await agent.User.list()
      runInAction(() => {
        this.users = users
      });
    }
    catch(error){
      throw error
    }
  }

}
