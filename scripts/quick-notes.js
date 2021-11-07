class QuickNotes {
    static ID = 'quick-notes';

    static FLAGS = {
        NOTES: 'quicknotes'
    }
}

class QuickNotesData {
    static getQuickNotesJournalEntry() {
        const id = game.user?.getFlag(QuickNotes.ID, QuickNotes.FLAGS.NOTES);
        return game.journal.get(id);
    }

    static async createQuickNotesJournal() {
        const journalEntryName = game.i18n.localize('QUICK-NOTES.journal-entry-name');
        const newJournalEntry = await JournalEntry.create(
            {
                name: game.user.name + journalEntryName,
            },
            { renderSheet: false, activate: false }
        );

        await game.user?.setFlag(QuickNotes.ID, QuickNotes.FLAGS.NOTES, newJournalEntry.id);

        return newJournalEntry
    }

    static async takeNotes(journalEntry, newContent) {
        const oldContent = journalEntry.data.content;
        await journalEntry.update({
            content: oldContent + newContent + '<br><br>'
        });
    }
}

Hooks.on('renderChatMessage', (message, html, data) => {
    const tooltip = game.i18n.localize('QUICK-NOTES.button-title');
    const takeNotesButton = $(`<a class="" style=""><i class="fas fa-feather" title="${tooltip}"></i></a>`);

    html.find('.message-metadata').append(takeNotesButton);

    takeNotesButton.click(async e => {
        let quickNotesJournalEntry = QuickNotesData.getQuickNotesJournalEntry()
        if (quickNotesJournalEntry == null) {
            quickNotesJournalEntry = await QuickNotesData.createQuickNotesJournal();
        }

        QuickNotesData.takeNotes(quickNotesJournalEntry, message.export());
        takeNotesButton.css('color', 'Green');
    });
});