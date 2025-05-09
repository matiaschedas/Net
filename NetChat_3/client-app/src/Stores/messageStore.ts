import { observable, action, runInAction, makeObservable } from "mobx";
import agent from "../Api/agent";
import { IMediaFormValues, IMessage, IMessageFormValues } from "../Models/messages";
import { RootStore } from "./rootStore";
import { HubConnection } from '@aspnet/signalr'
import { HubConnectionBuilder } from "@aspnet/signalr/dist/esm/HubConnectionBuilder";
import { LogLevel } from "@aspnet/signalr/dist/esm/ILogger";

export default class MessageStore
{
  @observable messages: IMessage[] = []
  rootStore: RootStore
  @observable isModalVisible: boolean = false
  @observable isImageModelVisble: boolean = false
  @observable imageSelected: string | null = null
  

  constructor(rootStore: RootStore  ) {
    makeObservable(this)
    this.rootStore = rootStore
    
  }



  

  @action sendMessage = async (message: IMessageFormValues) => 
  {
    try {
      await this.rootStore.commonStore.hubConnection?.invoke('SendMessage', message)
      //const result = await agent.Messages.send(message) //con endpoint (ahora se usa SignalR)

      /*runInAction(() => {
        //this.messages.push(result)
        this.messages = [...this.messages, result] //esto dispara los useEffect porque se crea un nuevo array cada vez, de la otra forma se actualiza el mismo array y los useeffect no lo detectan como un cambio en la dependencia messages
        //console.log(`se cargo el mensaje: ${JSON.stringify(result, undefined, 2)}`)
      })*/ //(ahora se usa SignalR)
    }
    catch(error) {
      throw error
    }
  }
  @action loadMessages = async (channelId: string) => {
    try{
      this.messages = []
      if(channelId !== undefined){
        const result = await this.rootStore.channelStore.detail(channelId)
        
        runInAction(() => {
          this.messages = result.messages ?? []
          console.log("se cargaron los mensajes")
        });
      }
    }
    catch(error){
      throw error
    }
  }
  @action uploadImage = async (values: IMediaFormValues) => {
    try{
      /*const result = */await agent.Messages.sendMedia(values)
      /* innecesario con signalr:
      runInAction(() => {
        this.messages = [...this.messages, result]
       //console.log(`se cargo el mensaje: ${JSON.stringify(result, undefined, 2)}`)
      });*/
    }
    catch(error){
      throw error
    }
  }
  @action showModal = (show: boolean) => {
    this.isModalVisible = show
  }
  @action showImageModal = (show: boolean) => {
    this.isImageModelVisble = show
  }
  @action setImageSelected = (imageUrl : string) => {
    this.imageSelected = imageUrl
  }
}