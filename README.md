Make sure you have install nodejs

npm install


node automate.js

It will ask to scan the given qr code


const venom = require('venom-bot');
const fs = require('fs');
const csv = require('csv-parser');

// WhatsApp Group Invite Links
const csGroupLink = 'https://chat.whatsapp.com/XXXXXX'; // Computer Science group link
const engGroupLink = 'https://chat.whatsapp.com/YYYYYY'; // Engineering group link

// Start the client
venom.create({
    session: 'session-name',
    multidevice: true,
}).then((client) => {
    sendGroupLinkToUsers(client);
}).catch((error) => {
    console.log('Error starting Venom:', error);
});

async function sendGroupLinkToUsers(client) {
    const users = await getUsersFromCSV('students.csv'); // Read CSV file to get users' phone numbers

    for (const user of users) {
        const phoneNumber = user['Mobile Number']; // Extract phone number from CSV
        const groupLink = user['Group'] === 'Computer Science' ? csGroupLink : engGroupLink; // Choose group based on CSV column

        try {
            const formattedPhone = `${phoneNumber}@c.us`; // Format phone number with WhatsApp suffix
            const message = `Hello, join our WhatsApp group using the link below:\n${groupLink}`;
            
            // Send the invite link to the user using sendText method
            await client.sendText(formattedPhone, message);
            console.log(`Invite sent to ${user['Name']} (${phoneNumber})`);

            // Pause to avoid rate limits (e.g., 5 seconds between each message)
            await delay(5000); // 5 seconds delay
        } catch (error) {
            console.error(`Failed to send invite to ${user['Name']} (${user['Mobile Number']}):`, error);
        }
    }
}

// Delay function to control rate
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Read users from CSV
function getUsersFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const users = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                users.push(row); // Add each row to the users array
            })
            .on('end', () => {
                resolve(users); // Resolve with the array of users when done
            })
            .on('error', (error) => {
                reject(error); // Reject if there's an error reading the CSV
            });
    });
}


WhatsApp's limitations:
Rate Limiting: WhatsApp has rate limits to prevent spamming. If you send too many messages in a short time or add too many people to a group in rapid succession, you may be temporarily banned or restricted. The exact rate limit is not publicly disclosed but generally, large numbers of messages or group additions can result in restrictions.

Account Restrictions: Using automation to add large numbers of participants to a group or send unsolicited messages can trigger WhatsApp’s automated anti-spam systems. This can result in:

Account bans or temporary blocks
Limits on your ability to send messages or add participants to groups
Notifications or warnings from WhatsApp
Group Size Limit: WhatsApp groups have a maximum participant limit (usually around 1024 members). If you're managing large groups and want to keep them organized, you should consider this limit.

How to manage these limits:
To avoid hitting these limits and getting your account banned, you can implement the following best practices:

Rate Limiting:

Pause between actions: Add pauses between adding participants or sending messages. For example, wait a few seconds (e.g., 5-10 seconds) before sending each message or adding a new participant to the group.
Batch processing: Instead of sending messages or adding everyone at once, send messages in small batches over a longer period.
Respect WhatsApp's Policies:

Always ensure that you're adding people to groups only with their consent.
Be mindful of the context and frequency of your messages.
Use WhatsApp Business API: If you're automating messages for business purposes (e.g., customer communication or notifications), consider using the WhatsApp Business API. It’s designed for companies and has more relaxed limits, but it still requires approval from WhatsApp and compliance with their terms.

Keep your bot’s actions natural: Avoid automating tasks in a way that would seem unnatural, like adding hundreds of people to a group within seconds. This could be flagged by WhatsApp’s security system.
