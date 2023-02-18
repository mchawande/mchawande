export class QuoteService {
    static localStorageKey = new Date().toISOString().split('T')[0];

    static async getQuote() {
        try {
            const quote = localStorage.getItem(this.localStorageKey);
            if (quote) {
                return Promise.resolve(JSON.parse(quote));
            } else {
                const request = new Request('https://quotes.rest/qod');
                const response = await fetch(request);
                const data = await response.json();
                if (data.error) {
                    return Promise.reject(data.error.message);
                } else {
                    const quote = data.contents.quotes[0];
                    localStorage.setItem(this.localStorageKey, JSON.stringify(quote));
                    return Promise.resolve(quote);
                }
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

window.addEventListener('load', (e) => {
    document.querySelectorAll('.quote-card').forEach(async (quoteCard) => {
        const objQuote = await QuoteService.getQuote();

        const $ = (selector, value) => {
            quoteCard.querySelector(selector).innerHTML = value;
        };

        $('.quote-title', objQuote.title);
        $('.quote-date', objQuote.date);
        $('.quote-contents', objQuote.quote);
        $('.quote-tags', objQuote.tags.map(capitalize).join(', '));
        $('.quote-author', '- ' + objQuote.author);

        quoteCard.classList.remove('loading');
    });
});

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.substring(1, text.length);
}
