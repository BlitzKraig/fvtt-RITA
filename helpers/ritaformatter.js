class RitaFormatter {
    static getActorItem(spellItem, {headerPrefix = '', headerSuffix = ''} = {}) {
        return `<h2 class="rita-actoritem" style="cursor:pointer;" data-rita="${spellItem.actor.id}:${spellItem.id}">${headerPrefix} ${spellItem.name} ${headerSuffix}</h2>`;
    }
}