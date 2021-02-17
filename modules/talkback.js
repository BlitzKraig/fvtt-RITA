class RitaTalkback {

    static shouldDialog = false;

    static ttsVoice;
    static ttsPitch = 1.0;
    static ttsRate = 1.0
    static ttsVolume = 0.8;

    static skip = false;

    static getVoice() {
        this.ttsVoice = window.speechSynthesis.getVoices()[game.settings.get("RITA", "ttsVoice")];
        this.ttsPitch = game.settings.get("RITA", "ttsPitch");
        this.ttsRate = game.settings.get("RITA", "ttsRate");
        this.ttsVolume = game.settings.get("RITA", "ttsVolume");
    }

    static say(message, {
        voice = this.ttsVoice,
        rate = this.ttsRate || 1.0,
        pitch = this.ttsPitch || 1.0,
        volume = this.ttsVolume || 1.0,
        query = undefined
    } = {}) {
        if (game.settings.get("RITA", "shouldSpeak")) {
            if (!this.skip) {
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    let voicedMessage = message;
                    voicedMessage = voicedMessage.replace(/\//g, ' or ');
                    voicedMessage = voicedMessage.replace(/@mod/g, ' modifier ')
                    voicedMessage = voicedMessage.replace(/<[^>]*>/g, ' ');
                    voicedMessage = voicedMessage.replace(/&nbsp;/g, ' ');
                    var msg = new SpeechSynthesisUtterance(voicedMessage);
                    if (voice) {
                        msg.voice = voice;
                    }
                    if (rate) {
                        msg.rate = rate;
                    }
                    if (pitch) {
                        msg.pitch = pitch;
                    }
                    if (volume) {
                        msg.volume = volume;
                    }
                    window.speechSynthesis.speak(msg);
                }
            } else {
                this.skip = false;
            }
        }
        if (game.settings.get("RITA", "shouldChat")) {
            let content = '';
            if (query) {
                content += `${query}\n`
            }
            content += message;
            ChatMessage.create({
                speaker: {
                    alias: Rita.assistantName
                },
                content: content,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            });
        }

        if (this.shouldDialog) {
            let content = '';
            if (query) {
                content += `${query}\n`
            }
            content += message;
            new Dialog({
                title: `${Rita.assistantName} Says...`,
                content: content,
                buttons: {
                    ok: {
                        label: "Ok"
                    },
                },
                close: () => {}
            }).render(true);
        }
    }
    static stop() {
        if (window.speechSynthesis && Rita.listening) {
            window.speechSynthesis.cancel();
        }
    }
}