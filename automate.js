const venom = require('venom-bot');
const fs = require('fs');
const csv = require('csv-parser');

// WhatsApp Group Invite Link
const csGroupLink = "https://chat.whatsapp.com/XXXXXXX"; 
const engGroupLink = 'https://chat.whatsapp.com/YYYYYY'; // Engineering group link

// Start the client
venom.create({
    session: 'session-name', // Define session name
    multidevice: true, // Enable multi-device support
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
            
            // Send the invite link to the user
            await client.sendText(formattedPhone, message);
            console.log(`Invite sent to ${user['Name']} (${phoneNumber})`);
        } catch (error) {
            console.error(`Failed to send invite to ${user['Name']} (${user['Mobile Number']}):`, error);
        }
    }
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
