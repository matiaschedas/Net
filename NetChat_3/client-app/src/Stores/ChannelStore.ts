import axios, { AxiosError, HttpStatusCode } from "axios"
import { action, observable, makeObservable, runInAction, computed, toJS} from "mobx"
import agent from "../Api/agent"
import { ChannelType, IChannel } from "../Models/channels"
import { toast } from 'react-toastify'
import { RootStore } from "./rootStore"
import { Channel, channel } from "diagnostics_channel"
import { getEffectiveTypeParameterDeclarations } from "typescript"


export default class ChannelStore {
  @observable channels: IChannel[] = []
  @observable isModalVisible: boolean = false
  @observable errorStatus: number | null = null
  @observable errorMessage: string = ''
  @observable navigate: ((path: string) => void) | null = null
  rootStore: RootStore
  @observable activeChannel: IChannel | null = null
  @observable isChannelLoaded: boolean = false
  @observable starredChannels: IChannel[] = []
  
  constructor(rootStore: RootStore){
    makeObservable(this)
    this.rootStore = rootStore
  }

  @action setChannelStarred = async (channel: IChannel) => {
    try{
      channel.channelType = channel.channelType !== ChannelType.Starred ? ChannelType.Starred : ChannelType.Channel
      await agent.Channels.update(channel)
      await this.loadChannels(ChannelType.Channel)
      await this.loadChannels(ChannelType.Starred)
    } catch(error){
      throw error
    }
  }
  
  @action setNavigate = (navigateFn: (path: string) => void) => {
    this.navigate = navigateFn
  }
  @action loadChannels = async (channelType: ChannelType) => {
    try{
      var response = await agent.Channels.list(channelType)
      runInAction(() => {
        var channelsFromResponse = response.filter(c => c.channelType === channelType)
        this.isChannelLoaded = false
        if(channelType !== ChannelType.Starred){
          this.channels = channelsFromResponse
        }
        else{
          this.starredChannels = channelsFromResponse
        }
        this.isChannelLoaded = true
      });
      
    }
    catch(err){
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===404)
      {
        runInAction(() => {
          this.setError(404, 'Error al cargar canales');
          this.navigate?.('/notfound');
          this.clearError();
        });
      }
      if(axiosError.response?.status===500)
      {
        runInAction(() => {
            this.setError(500, 'Error al crear canal');
            toast.error('Server error');
            this.clearError();
        });
      }
      if(axiosError.message === 'Network Error' && !axiosError.response)
      {
        runInAction(() => {
            toast.error('Network Error - Make sure API is running');
        });
      }
      if(axiosError.response?.status!==401) throw err
    }
    
  }
  @action showModal = (show: boolean) => {
    this.isModalVisible = show
  }
  @action setActiveChannel = (channel: IChannel) => {
    this.activeChannel = channel
  } 
  @action getCurrentChannel = () => {
    const active = this.activeChannel ?? this.channels[0]
    console.log("channel: " + JSON.stringify( active, undefined, 2))
    return toJS(active)
  }
  @action createChannel = async (channel: IChannel) => {
    try{
      await agent.Channels.create(channel)
      runInAction(() => this.channels.push(channel))
    }
    catch(err){
      console.log(err)
      if (!axios.isAxiosError(err)) {
        runInAction(() => {
          toast.error('Ocurrió un error inesperado');
        });
      } 
      const axiosError = err as AxiosError;
      if (axiosError.response?.status===404)
      {
        runInAction(() => {
          this.setError(404, 'Error al cargar canales');
          this.navigate?.('/notfound');
          this.clearError();
        });
      }
      if(axiosError.response?.status===500)
      {
        runInAction(() => {
            this.setError(500, 'Error al crear canal');
            toast.error('Server error');
            this.clearError();
        });
      }
      if(axiosError.message === 'Network Error' && !axiosError.response)
      {
        runInAction(() => {
            toast.error('Network Error - Make sure API is running');
        });
      }
      if(axiosError.response?.status!==401) throw err
    }
  }
  @action detail = async (channelId: string) : Promise<IChannel> => {
    try{
      return await agent.Channels.detail(channelId)
    }
    catch (error){
      throw error
    }
  }
  @action setError = (status: number, message: string) => {
    this.errorStatus = status
    this.errorMessage = message
  }
  @action clearError = () => {
    this.errorStatus = null
    this.errorMessage = ''
  }
  @action changePrivateChannel = async (userId: string) => {
    try{
      let currentChannel = await agent.Channels.privateChannel(userId)
      runInAction(() => {
        this.setActiveChannel(currentChannel)
      });
    }
    catch(error){
      throw error
    }
  
  }
}

