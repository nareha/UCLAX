import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

export function formatDate(dateObject: Date) {
    const options : DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
    };

    const formattedDate = dateObject.toLocaleString('en-US', options);
    return formattedDate;
}
