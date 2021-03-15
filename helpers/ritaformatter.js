class RitaFormatter {
    static getActorItem(spellItem, translationString = '') {
        return `<h2 class="rita-actoritem" style="cursor:pointer;" data-rita="${spellItem.actor.id}:${spellItem.id}">${translationString!=''?game.i18n.format(translationString, {spellItemName: spellItem.name}):spellItem.name}</h2>`;
    }
}