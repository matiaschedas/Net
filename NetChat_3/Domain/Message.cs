
using System;
using System.Text.Json.Serialization;

namespace Domain
{
  public class Message
  {
    public Guid Id { get; set; }
    public string Content {get; set; }
    public DateTime CreatedAt { get; set; }
    public AppUser Sender {get; set; }

    public string SenderId {get; set; }
    //esto indica que no quiero que me devuelva esta prop al hacer un include con EF, asi evitamos la referencia circular
    [JsonIgnore]
    public  Channel Channel {get; set; }
    public Guid ChannelId {get; set; }
    public MessageType MessageType {get; set; }
  }
}