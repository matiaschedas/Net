import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { error } from "console";
import { makeObservable, observable, action, runInAction } from "mobx";
import { ChannelType } from "../Models/channels";
import { IMessage } from "../Models/messages";
import { IUser } from "../Models/users";
import { RootStore } from "./rootStore";

export default class CommonStore{
  rootStore: RootStore
  @observable token: string | null = window.localStorage.getItem('jwt')
  @observable appLoaded = false
  @observable.ref hubConnection: HubConnection | null = null
  @observable selectedChannelId: string | null = null
  @observable selectedChannelType: ChannelType | null = null
  
  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.rootStore = rootStore;
    
  }
  
  @action setSelectedChannelId = (id: string) => {
    this.selectedChannelId = id
  }

  @action setSelectedChannelType = (type: ChannelType) => {
    this.selectedChannelType = type
  }

  @action setAppLoaded = () => {
    this.appLoaded = true
  }


  @action setToken = (token: string | null) => {
    window.localStorage.setItem('jwt', token!)
    this.token = token
  }

  @action.bound restartHubConnection = async () => {
    await this.stopHubConnection()
  
    await this.createHubConnection(); // Crear nueva conexión
  
  }

  @action createHubConnection = async () => {
    if(this.hubConnection) return;
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5000/chat', {
      accessTokenFactory: () => this.rootStore.commonStore.token!
    })
    .configureLogging(LogLevel.Information)
    .build()

    //this.hubConnection.start().catch((error) => console.log("Error establishing connection", error))

    this.hubConnection.on('ReceiveMessage', (message: IMessage) => {
      runInAction(() => {
       // this.messages.push(message)
        this.rootStore.messageStore.messages = [...this.rootStore.messageStore.messages, message]
        this.rootStore.channelStore.addNotification(message.channelId, message)
      })
    })
    this.hubConnection.on('UserLogged', (user: IUser) => {
      runInAction(() => {
        const index = this.rootStore.userStore.users.findIndex(u => u.id === user.id)
        if(index !== -1){
          this.rootStore.userStore.users[index] = {
            ...this.rootStore.userStore.users[index],
            isOnline: true
          };
        }
      })
    })
    this.hubConnection.on('UserLogout', (user: IUser) => {
      runInAction(() => {
        const index = this.rootStore.userStore.users.findIndex(u => u.id === user.id)
        if(index !== -1){
          this.rootStore.userStore.users[index] = {
            ...this.rootStore.userStore.users[index],
            isOnline: false
          }
        }
      })
    })

    await this.hubConnection.start()
    console.log('SignalR connection established')
  }

  @action stopHubConnection = async () => {
    if(this.hubConnection){
      try{
        await this.hubConnection.stop()
        console.log('SignalR conection stopped')
      } catch (error){
        console.log('Error stopping SignalR connection', error)
      } finally {
        this.hubConnection = null
      }
    }
  }
}