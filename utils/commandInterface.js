module.exports = class CommandInterface{
	constructor(args){
		for (let key in args) {
			if (key == "execute") {
				this.executeCommand = args[key];
			} else {
				this[key] = args[key];
			}
		}
	}

	async execute(params){
		if(this.permissions){
			let channel = params.channel;
            
			let channelPerms = channel.permissionsFor(params.client.user.id);
			for(let i in this.permissions){
				if(!channelPerms.has(this.permissions[i])){
					if(channelPerms.has("SEND_MESSAGES"))
						console.log(`something wrong boyo`);
					return;
				}
			}
		}

		// Check if command is for nsfw only
		if (this.nsfw && !params.channel.nsfw) {
			console.log(`something wrong boyo`);
			return;
		}
		await this.executeCommand.bind(params)(params);
	}

}