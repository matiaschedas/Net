import { action, observable, makeObservable, configure, runInAction } from "mobx"
import { createContext } from "react"
import agent from "../Api/agent"
import { IChannel } from "../Models/channels"

configure({ enforceActions: 'always' })
class ChannelStore {
  @observable channels: IChannel[] = []
  @observable isModalVisible: boolean = false
  
  constructor(){
    makeObservable(this)
  }

  @action loadChannels = async () => {
    try{
      var response = await agent.Channels.list()
      runInAction(() => response.forEach((channel) => this.channels.push(channel)))
    }
    catch(err){
      console.log(err)
    }
    
  }
  @action showModal = (show: boolean) => {
    this.isModalVisible = show
  }
  @action createChannel = async (channel: IChannel) => {
    try{
      await agent.Channels.create(channel)
      runInAction(() => this.channels.push(channel))
    }
    catch(err){
      console.log(err)
    }
  }
}

export default createContext(new ChannelStore())