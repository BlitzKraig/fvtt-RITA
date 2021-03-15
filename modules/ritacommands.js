class RitaCommands {
    static listen() {
        Rita.listening = true;
        AudioHelper.play({
            src: 'modules/RITA/audio/active.ogg'
        }, false)
        Rita.listeningTimeout = setTimeout(() => {
            Rita.listening = false;
            AudioHelper.play({
                src: 'modules/RITA/audio/inactive.ogg'
            }, false)
            clearTimeout(Rita.listeningTimeout);
            Rita.listeningTimeout = undefined;
        }, 5000)
    }

    static runCommand(phrase) {
        Rita.listening = true;
        ritaAnnyang.trigger(phrase)
        if (phrase.toLowerCase() !== "again") {
            Rita.lastCommand = phrase;
        }
    }

    static quietly(phrase) {
        Rita.listening = true;
        RitaTalkback.skip = true;
        ritaAnnyang.trigger(phrase);
        if (phrase.toLowerCase() !== "again") {
            Rita.lastCommand = phrase;
        }
    }

    static again() {
        if (Rita.listening) {
            if (Rita.lastCommand) {
                Rita.commonCommand();
                // RitaTalkback.skip = true;
                console.log(Rita.lastCommand);
                ritaAnnyang.trigger(Rita.lastCommand);
            } else {
                RitaTalkback.say("No previous command");
                Rita.listening = false;
            }
        }
    }

    static async useSpellItem(spell, {
        verb = 'Casting'
    } = {}) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token first`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${verb} ${spell}`);

                if (BetterRolls) {
                    // Need to call like this to prevent our speech recognition event from being passed through
                    BetterRolls.rollItem(spellItem).toMessage()
                } else {
                    spellItem.roll();
                }
                // alert(`${Rita.assistantName}: Casting ${spell}`);
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async getRangeSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.range || 'Range unknown'}`, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerSuffix: 'Range'
                    })
                });
                // alert(`${Rita.assistantName}: Casting ${spell}`);
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async getDurationSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.duration || 'Duration unknown'}`, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerSuffix: 'Duration'
                    })
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async getLevelSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.level || 'Level unknown'}`, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerSuffix: 'Level'
                    })
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async getActivationSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.activation || 'Activation unknown'}`, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerSuffix: 'Activation'
                    })
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async getDamageSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.damage + ' ' + spellItem.labels.damageTypes || 'Damage unknown'}`, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerSuffix: 'Damage'
                    })
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }


    static async getSpellItemCount(spell) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Coming soon`);
        }
        Rita.listening = false;
    }

    static async summariseSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                let summary = ``;

                if (spellItem.labels.activation) {
                    summary += `<p>Activation time: ${spellItem.labels.activation}.</p>`;
                }
                if (spellItem.labels.components) {
                    summary += `<p>Components: ${spellItem.labels.components}.</p>`
                }
                if (spellItem.labels.damage) {
                    summary += `<p>Damage: ${spellItem.labels.damage}`
                    if (spellItem.labels.damageTypes) {
                        summary += ` ${spellItem.labels.damageTypes}`
                    }
                    summary += `.</p>`

                }
                if (spellItem.labels.duration) {
                    summary += `<p>Duration: ${spellItem.labels.duration}.</p>`
                }
                if (spellItem.labels.level) {
                    summary += `<p>Level: ${spellItem.labels.level}.</p>`
                }
                if (spellItem.labels.materials) {
                    summary += `<p>Materials: ${spellItem.labels.materials}.</p>`
                }
                if (spellItem.labels.range) {
                    summary += `<p>Range: ${spellItem.labels.range}.</p>`
                }
                if (spellItem.labels.recharge && spellItem.labels.recharge != 'Recharge [undefined]') {
                    summary += `<p>Recharge: ${spellItem.labels.recharge}.</p>`
                }
                if (spellItem.labels.school) {
                    summary += `<p>School: ${spellItem.labels.school}.</p>`
                }
                if (spellItem.labels.target) {
                    summary += `<p>Target: ${spellItem.labels.target}.</p>`
                }
                if (spellItem.labels.toHit) {
                    summary += `<p>Bonus to hit: ${spellItem.labels.toHit}.</p>`
                }
                RitaTalkback.say(summary, {
                    query: RitaFormatter.getActorItem(spellItem, {
                        headerPrefix: 'Summary of'
                    })
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async describeSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token with ${spell}`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase().replace(/:/g, '') == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`<p>${spellItem.data.data.description.value}</p>`, {
                    query: RitaFormatter.getActorItem(spellItem)
                });
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static playPlaylist(playlist) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Playlists coming soon`);
        }
        Rita.listening = false;
    }

    static stopAllPlaylists() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Playlists coming soon`);
        }
        Rita.listening = false;
    }

    static async executeMacro(macro) {
        if (Rita.listening) {
            Rita.commonCommand();
            if (await Rita.executeMacro(macro)) {
                return;
            }
            RitaTalkback.say(`Macro ${macro} not found`);
        }
        Rita.listening = false;
    }

    static targetToken(token) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Coming soon`);
        }
        Rita.listening = false;
    }

    static killToken(token) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Coming soon`);
        }
        Rita.listening = false;
    }

    static async spawnToken(actor) {
        if (Rita.listening) {
            Rita.commonCommand();
            let foundActor = await ActorDirectory.collection.find((actorToFind) => {
                return actorToFind.data.name.toLowerCase().split(' ').join('') == actor.toLowerCase().split(' ').join('')
            })
            if (foundActor) {

                const mouse = canvas.app.renderer.plugins.interaction.mouse;
                let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                const token = await Token.fromActor(foundActor, {
                    x: finalPos[0],
                    y: finalPos[1],
                    hidden: false
                });
                const td = token.data;

                // Adjust token position
                const hg = canvas.dimensions.size / 2;
                td.x -= td.width * hg;
                td.y -= td.height * hg;
                if (!event.shiftKey) mergeObject(td, canvas.grid.getSnappedPosition(td.x, td.y));
                if (!canvas.grid.hitArea.contains(td.x, td.y)) return false;

                // Submit the Token creation request and activate the Tokens layer (if not already active)
                // this.activate();
                Token.create(td);

                RitaTalkback.say(`<h2>Spawning ${foundActor.name}</h2><img style="width: 20%;" src=${td.img}/>`);
                // const mouse = canvas.app.renderer.plugins.interaction.mouse;
                // let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                // let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                // let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                // let summon = await Token.fromActor(foundActor);

                // summon.x = finalPos[1];
                // summon.y = finalPos[0];
                // await game.scenes.viewed.createEmbeddedEntity("Token", summon);

            } else {
                RitaTalkback.say(`Can't find actor ${actor}`)
            }
        }
        Rita.listening = false;
    }

    static listAllCommands() {
        if (Rita.listening) {
            Rita.commonCommand();
            let commandScopes = [...new Set(ritaAnnyang.getCommandsList().map(command => command.scope))];

            let commandsList = {};

            for (let scope of commandScopes) {
                commandsList[scope] = [];
            }

            for (let command of ritaAnnyang.getCommandsList()) {
                commandsList[command.scope].push(command.originalPhrase);
            }

            let ritaMessage = '';
            for (let key of Object.keys(commandsList)) {
                ritaMessage += `<h2>${key}</h2>`;
                for (let command of commandsList[key]) {
                    ritaMessage += `<p>${command}.</p>`
                }
            }

            RitaTalkback.say(ritaMessage);
        }
        Rita.listening = false;
    }

    static silenceRita() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.stop();
        }
        Rita.listening = false;
    }

    static sayLoveYou() {
        if (Rita.listening) {
            Rita.commonCommand();
            let response = [`Ok... That's nice ${game.user.name}`, 'Cool... Cool cool cool.', 'I like you too', 'I am incapable of love', `${Rita.assistantName} does not yet know the emotion: love`]
            RitaTalkback.say(response[Math.floor(Math.random() * response.length)]);
        }
        Rita.listening = false;
    }

    static sayHello() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`Hi ${game.user.name}`);
        }
        Rita.listening = false;
    }

    static sayThankYou() {
        if (Rita.listening) {
            Rita.commonCommand();
            let response = [`You're welcome ${game.user.name}`, 'Any time!', 'No worries', 'Happy to help']
            RitaTalkback.say(response[Math.floor(Math.random() * response.length)]);
        }
        Rita.listening = false;
    }

    static sayPodBayDoors() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(`I'm sorry ${game.user.name}, I'm afraid I can't do that.`);
        }
        Rita.listening = false;
    }
}