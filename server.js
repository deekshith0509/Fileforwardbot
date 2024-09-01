const axios = require('axios');
/*
// URL of the webappbot endpoint to keep alive
const url = 'https://webappbot.glitch.me';

// Function to make a request to the URL
const keepAlive = async () => {
  try {
    const response = await axios.get(url);
    console.log('Keep-alive request successful for webappbot:', response.status);
  } catch (error) {
    console.error('Error making keep-alive request for webappbot:', error.message);
  }
};

// Call the function every 4 minutes (240,000 milliseconds)
setInterval(keepAlive, 240000);

// Optionally, call the function once at startup
keepAlive();
*/

const { spawn } = require('child_process');

// Function to start the Python script as a background process
function startPythonScript() {
    const pythonProcess = spawn('python3', ['main.py'], {
        detached: true, // Runs the process independently from the parent
        stdio: 'ignore' // Ignore stdio to allow the process to continue running in the background
    });

    pythonProcess.unref(); // Allows the parent to exit while the child process continues running
    console.log('Python script started in the background.');
}

// Start the Python script when the server starts
startPythonScript();

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
  

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileForward Bot Overview</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            color: #333333;
            transition: background-color 0.5s, color 0.5s;
            overflow-x: hidden;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .heading {
            font-size: 2em;
            background: linear-gradient(to right, #ff0000, #2f00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 20px 0;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 1s, transform 1s;
        }
        .subheading {
            font-size: 1.5em;
            color: #ff0000;
            margin: 10px 0;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 1s, transform 1s;
        }
        .section {
            max-width: 800px;
            width: 100%;
            margin: 20px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 1s, transform 1s;
        }
        .feature, .applications, .enhancements {
            margin: 10px 0;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 1s, transform 1s;
        }
        .logo {
            font-size: 2em;
            margin: 10px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 1s, transform 1s;
        }
        .toggle {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 1.5em;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .toggle:hover {
            transform: scale(1.2);
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-30px);
            }
            60% {
                transform: translateY(-15px);
            }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        @keyframes logoBounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }
    </style>
</head>
<body>



    <div class="container">
        <div class="toggle" onclick="toggleMode()">☀️</div>
        <div class="heading">FileForward Bot</div>
        <div class="section">
    <div class="subheading">Bot Features</div>
    <div class="feature">📄 <strong>File Forwarding:</strong> Seamlessly forward files between chats, allowing users to share files across different platforms efficiently.</div>
    <div class="feature">🔍 <strong>File Search:</strong> Utilize advanced search functionalities to quickly locate files within chats, making file management easier.</div>
    <div class="feature">💾 <strong>File Storage:</strong> Store frequently accessed files in a dedicated section, providing quick retrieval and management of important files.</div>
    <div class="feature">📅 <strong>Scheduled Forwarding:</strong> Set up scheduled tasks to automatically forward files at designated times, enhancing workflow automation.</div>
    <div class="feature">📩 <strong>Automated Responses:</strong> Configure automated replies triggered when files are received, improving communication and response efficiency.</div>
    <div class="feature">📊 <strong>Activity Logging:</strong> Keep a detailed log of all file management activities, enabling easy tracking and auditing of file operations.</div>
    <div class="feature">🔢 <strong>Pagination Support:</strong> Efficiently manage large volumes of files by implementing pagination, improving navigation and file access.</div>
</div>
<div class="section applications">
    <div class="subheading">Applications</div>
    <div class="applications">✔️ <strong>Team Collaboration:</strong> Share, organize, and manage files within team chats to streamline collaboration.</div>
    <div class="applications">✔️ <strong>Customer Support:</strong> Forward customer files to support agents, ensuring quick and accurate issue resolution.</div>
    <div class="applications">✔️ <strong>Project Management:</strong> Easily manage and track project-related files, keeping all necessary documentation organized.</div>
    <div class="applications">✔️ <strong>File Metadata Management:</strong> Handle file metadata efficiently to ensure secure and organized file storage and retrieval.</div>
    <div class="applications">✔️ <strong>User-specific Queues:</strong> Maintain user-specific file queues for personalized file management and organization.</div>
</div>
<div class="section enhancements">
    <div class="subheading">Enhancements</div>
    <div class="enhancements">🔧 <strong>Advanced Search:</strong> Further refine the search functionality to handle complex queries and large datasets more effectively.</div>
    <div class="enhancements">🚀 <strong>Performance Optimization:</strong> Improve the speed and efficiency of file handling, especially with large volumes of data.</div>
    <div class="enhancements">🌐 <strong>Integration:</strong> Explore integration with other applications and platforms to extend the bot's functionality and reach.</div>
    <div class="enhancements">🔄 <strong>Feedback Management:</strong> Enhance the feedback handling process to better respond to user needs and improve service quality.</div>
    <div class="enhancements">🛡️ <strong>Security Enhancements:</strong> Implement additional security measures to protect file integrity and prevent unauthorized access.</div>
</div>
<div class="section">
    <div class="subheading">Bot Usages and Modifications</div>
    <div class="feature">🔄 <strong>Usage:</strong> Adapt the bot to handle various file types, manage file metadata, and integrate with different platforms to suit specific user needs.</div>
    <div class="feature">🔧 <strong>Modification:</strong> Customize the bot's functionality to align with specific use cases, such as specialized file handling or user-specific features.</div>
</div>

 
    </div>
 
 
 
 
 <script>
        document.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const toggle = document.querySelector('.toggle');
            const currentTheme = localStorage.getItem('theme');

            if (currentTheme === 'dark') {
                body.style.backgroundColor = '#000000';
                body.style.color = '#ffffff';
                toggle.textContent = '☀️';
            } else {
                body.style.backgroundColor = '#ffffff';
                body.style.color = '#333333';
                toggle.textContent = '🌕';
            }

            toggle.addEventListener('click', () => {
                if (body.style.backgroundColor === 'rgb(255, 255, 255)') {
                    body.style.backgroundColor = '#000000';
                    body.style.color = '#ffffff';
                    toggle.textContent = '☀️';
                    localStorage.setItem('theme', 'dark');
                } else {
                    body.style.backgroundColor = '#ffffff';
                    body.style.color = '#333333';
                    toggle.textContent = '🌕';
                    localStorage.setItem('theme', 'light');
                }
            });

            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1
            };
            
            const elements = document.querySelectorAll('.heading, .subheading, .section, .feature, .applications, .enhancements, .logo');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            elements.forEach(element => {
                observer.observe(element);
            });
        });
    </script>
</body>
</html>


  
  
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});








/*
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

// Retrieve tokens from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.WEATHER_API_KEY; // Use your OpenWeatherMap API key

// Create a bot that uses polling
const bot = new TelegramBot(token, { polling: true });

// Static responses
const greetings = [
  "Hello {firstName}! How can I assist you today?",
  "Hi {firstName}! What’s up?",
  "Hey {firstName}! How’s it going?",
  "Greetings {firstName}! How can I help you?"
];
const smallTalk = [
  "I love chatting with you!",
  "Did you know I can tell you jokes? Just type /joke!",
  "How about we play a game? Just ask!",
  "What’s your favorite thing to do?"
];
const compliments = [
  "You're awesome!",
  "I appreciate you!",
  "You're fantastic!",
  "Thanks for chatting with me!"
];
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "What do you get when you cross a snowman and a vampire? Frostbite!"
];

// Function to get a random item from an array
function getRandomResponse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const moment = require('moment-timezone');

// Function to get a time-based personalized greeting
function getTimeBasedGreeting(firstName) {
  const now = moment().tz("Asia/Kolkata"); // Get current time in Kolkata timezone
  const hours = now.hours();
  let greeting;

  if (hours < 12) {
    greeting = `Good morning ${firstName}!`;
  } else if (hours < 18) {
    greeting = `Good afternoon ${firstName}!`;
  } else {
    greeting = `Good evening ${firstName}!`;
  }

  return greeting;
}

// Example usage
const firstName = 'Deekshith'; // Replace with actual first name
console.log(getTimeBasedGreeting(firstName)); // Output will depend on current time in Kolkata timezone


// Function to get a random personalized greeting
function getPersonalizedGreeting(firstName) {
  const greeting = getRandomResponse(greetings);
  return greeting.replace('{firstName}', firstName);
}

// Welcome message and instructions
const manualMessage = `
Welcome! I am your friendly bot. Here are the commands you can use:
- /start: Start the bot
- /help: Show this help message
- /joke: Get a joke
- /weather [location]: Get the weather information for the specified location or default to Hyderabad
- /forecast [location]: Get a 5-day weather forecast for the specified location or default to Hyderabad
- /userinfo: Get your user information
- /photo: Get a sample photo
- /menu: Show interactive options
- /setpreference [preference]: Set your user preference
- /quiz: Start a quiz game
- /convert [amount] to [currency]: Convert currency from USD to the specified currency
- /quit: End the quiz session
- /todo: Show your to-do list
- /todo add [item]: Add an item to your to-do list
- /todo remove [item]: Remove an item from your to-do list
- /todo complete [item]: Mark an item as completed
`;

// Store user data
const userPreferences = {};
const quizSessions = {};
const todoLists = {};

// Send welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  const personalizedGreeting = getTimeBasedGreeting(firstName);
  bot.sendMessage(chatId, `${personalizedGreeting}\n\n${manualMessage}`);
});

// Default location
const defaultLocation = 'Hyderabad';
// Define weather descriptions
const weatherDescriptions = {
  'Clear': 'Clear sky with no clouds. It is sunny and bright.',
  'Clouds': 'Cloudy weather with various amounts of clouds in the sky.',
  'Rain': 'Rainy weather with varying intensities of precipitation.',
  'Drizzle': 'Light rain with very fine droplets.',
  'Thunderstorm': 'Thunderstorms with possible lightning and heavy rain.',
  'Snow': 'Snowfall with varying intensities and accumulation.',
  'Mist': 'Low visibility due to mist, often with reduced visibility.',
  'Fog': 'Dense fog reducing visibility significantly.',
  'Haze': 'Reduced visibility due to haze or dust in the air.',
  // Add more descriptions as needed
};

// Fetch and respond with weather information
bot.onText(/\/weather(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const location = match[1] ? match[1] : defaultLocation;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(weatherUrl);
    const data = response.data;

    // Convert timestamps to Kolkata time
    const sunriseTime = moment.unix(data.sys.sunrise).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const sunsetTime = moment.unix(data.sys.sunset).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    // Get weather condition and description
    const condition = data.weather[0].main;
    const description = weatherDescriptions[condition] || 'No detailed description available for this weather condition.';

    let weatherMessage = `Weather details for ${data.name}, ${data.sys.country}:\n\n`;
    weatherMessage += `**Temperature**: ${data.main.temp}°C\n`;
    weatherMessage += `**Feels Like**: ${data.main.feels_like}°C\n`;
    weatherMessage += `**Minimum Temperature**: ${data.main.temp_min}°C\n`;
    weatherMessage += `**Maximum Temperature**: ${data.main.temp_max}°C\n`;
    weatherMessage += `**Pressure**: ${data.main.pressure} hPa\n`;
    weatherMessage += `**Humidity**: ${data.main.humidity}%\n`;
    weatherMessage += `**Weather Condition**: ${condition}\n`;
    weatherMessage += `**Weather Description**: ${description}\n`;
    weatherMessage += `**Visibility**: ${data.visibility} meters\n`;
    weatherMessage += `**Wind Speed**: ${data.wind.speed} m/s\n`;
    weatherMessage += `**Wind Direction**: ${data.wind.deg}°\n`;
    weatherMessage += `**Cloudiness**: ${data.clouds.all}%\n`;
    weatherMessage += `**Sunrise**: ${sunriseTime}\n`;
    weatherMessage += `**Sunset**: ${sunsetTime}\n`;

    bot.sendMessage(chatId, weatherMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, I could not fetch the weather information.');
  }
});


// Fetch and respond with weather forecast
bot.onText(/\/forecast(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const location = match[1] ? match[1] : defaultLocation;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(forecastUrl);
    const data = response.data;
    let forecastMessage = `Weather forecast for ${data.city.name}, ${data.city.country}:\n\n`;

    data.list.forEach(entry => {
      forecastMessage += `**Date**: ${entry.dt_txt}\n`;
      forecastMessage += `**Temperature**: ${entry.main.temp}°C\n`;
      forecastMessage += `**Weather**: ${entry.weather[0].description}\n\n`;
    });

    bot.sendMessage(chatId, forecastMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, I could not fetch the weather forecast.');
  }
});

// Show help message
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, manualMessage);
});

// Respond to messages with static AI-like replies and personalized greetings
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  const firstName = user.first_name;

  if (msg.text && !msg.text.startsWith('/')) {
    let response;
    if (msg.text.includes('hi') || msg.text.includes('hello')) {
      response = getPersonalizedGreeting(firstName);
    } else if (msg.text.includes('how are you')) {
      response = getRandomResponse(smallTalk);
    } else if (msg.text.includes('thanks') || msg.text.includes('thank you')) {
      response = getRandomResponse(compliments);
    } else {
      response = `You said: ${msg.text}`;
    }
    bot.sendMessage(chatId, response);
  }
});

// Respond with a joke
bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  const joke = getRandomResponse(jokes);
  bot.sendMessage(chatId, joke);
});

bot.onText(/\/userinfo/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  // Create a detailed user info message using available fields
  const userInfo = `User Info:\n` +
    `*First Name*: ${user.first_name || 'N/A'}\n` +
    `*Last Name*: ${user.last_name || 'N/A'}\n` +
    `*Username*: ${user.username || 'N/A'}\n` +
    `*ID*: ${user.id}\n` +
    `*Language Code*: ${user.language_code || 'N/A'}\n` +
    `*Is Bot*: ${user.is_bot ? 'Yes' : 'No'}`;

  bot.sendMessage(chatId, userInfo, { parse_mode: 'Markdown' });
});



// Send a sample photo
bot.onText(/\/photo/, (msg) => {
  const chatId = msg.chat.id;
  
  // Generate a unique URL by appending a timestamp
  const uniqueImageUrl = `https://picsum.photos/900?${Date.now()}`;
  
  bot.sendPhoto(chatId, uniqueImageUrl);
});

  // Show interactive menu
  bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Joke', callback_data: 'joke' }],
          [{ text: 'Weather', callback_data: 'weather' }],
          [{ text: 'Forecast', callback_data: 'forecast' }],
          [{ text: 'User Info', callback_data: 'userinfo' }],
          [{ text: 'Photo', callback_data: 'photo' }],
          [{ text: 'Quiz', callback_data: 'quiz' }],
          [{ text: 'Currency Conversion', callback_data: 'convert' }],
          [{ text: 'To-Do List', callback_data: 'todo' }]
        ]
      }
    };
    bot.sendMessage(chatId, 'Choose an option:', options);
  });

  // Handle callback queries from the inline keyboard
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    switch (action) {
      case 'joke':
        bot.sendMessage(chatId, getRandomResponse(jokes));
        break;
      case 'weather':
        bot.sendMessage(chatId, 'Send your location using /weather [location]');
        break;
      case 'forecast':
        bot.sendMessage(chatId, 'Send your location using /forecast [location]');
        break;
      case 'userinfo':
        bot.sendMessage(chatId, `User Info:\n` +
          `First Name: ${callbackQuery.from.first_name}\n` +
          `Last Name: ${callbackQuery.from.last_name || 'N/A'}\n` +
          `Username: ${callbackQuery.from.username || 'N/A'}\n` +
          `ID: ${callbackQuery.from.id}\n` +
          `Language Code: ${callbackQuery.from.language_code || 'N/A'}\n` +
          `Is Bot: ${callbackQuery.from.is_bot || 'N/A'}`);
        break;
      case 'photo':
        bot.sendPhoto(chatId, 'https://example.com/photo.jpg'); // Replace with an actual photo URL
        break;
      case 'quiz':
        startQuizSession(chatId);
        break;
      case 'convert':
        bot.sendMessage(chatId, 'Send the amount and currency to convert using /convert [amount] to [currency]');
        break;
      case 'todo':
        showTodoList(chatId);
        break;
      default:
        bot.sendMessage(chatId, 'Unknown action.');
    }
  });

  // Start a quiz session
  function startQuizSession(chatId) {
    if (!quizSessions[chatId]) {
      quizSessions[chatId] = { score: 0, active: true };
      bot.sendMessage(chatId, 'Quiz started! Answer the following question: What is 2 + 2? Type /quit to end the quiz session.');
    } else {
      bot.sendMessage(chatId, 'A quiz session is already active. Please finish the current quiz before starting a new one.');
    }

    bot.once('message', async (msg) => {
      if (msg.text === '/quit') {
        if (quizSessions[chatId]) {
          const score = quizSessions[chatId].score;
          delete quizSessions[chatId];
          bot.sendMessage(chatId, `Quiz ended. Your score is ${score} points.`);
        } else {
          bot.sendMessage(chatId, 'No active quiz session to quit.');
        }
      } else if (quizSessions[chatId] && quizSessions[chatId].active) {
        const answer = msg.text;
        if (parseInt(answer) === 4) {
          quizSessions[chatId].score += 1;
          bot.sendMessage(chatId, 'Correct! You have been awarded 1 point.');
          bot.sendMessage(chatId, 'Next question: What is 3 + 5?');
        } else if (parseInt(answer) === 8) {
          quizSessions[chatId].score += 1;
          bot.sendMessage(chatId, 'Correct! You have been awarded 1 point.');
          bot.sendMessage(chatId, 'Next question: What is 7 + 6?');
        } else if (parseInt(answer) === 13) {
          quizSessions[chatId].score += 1;
          bot.sendMessage(chatId, 'Correct! You have been awarded 1 point.');
          bot.sendMessage(chatId, 'The quiz has ended. Type /quit to see your final score.');
        } else {
          bot.sendMessage(chatId, 'Incorrect. Try again!');
        }
      }
    });
  }

  // To-Do List functionality
  function showTodoList(chatId) {
    const list = todoLists[chatId] || [];
    if (list.length === 0) {
      bot.sendMessage(chatId, 'Your to-do list is empty.');
    } else {
      const todoMessage = list.map((item, index) => {
        return `${index + 1}. ${item.text} [${item.completed ? 'Completed' : 'Pending'}]`;
      }).join('\n');
      bot.sendMessage(chatId, `Your to-do list:\n\n${todoMessage}`);
    }
  }

  bot.onText(/\/todo$/, (msg) => {
    const chatId = msg.chat.id;
    showTodoList(chatId);
  });

  bot.onText(/\/todo add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemText = match[1];
    if (!todoLists[chatId]) {
      todoLists[chatId] = [];
    }
    todoLists[chatId].push({ text: itemText, completed: false });
    bot.sendMessage(chatId, `Added "${itemText}" to your to-do list.`);
  });

bot.onText(/\/todo remove (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const index = parseInt(match[1], 10); // Parse the index from the command
  if (isNaN(index) || index < 0) {
    bot.sendMessage(chatId, 'Please provide a valid index number.');
    return;
  }

  if (todoLists[chatId] && todoLists[chatId].length > 0) {
    if (index < todoLists[chatId].length) {
      const removedItem = todoLists[chatId].splice(index, 1)[0];
      bot.sendMessage(chatId, `Removed "${removedItem.text}" from your to-do list.`);
    } else {
      bot.sendMessage(chatId, 'Index out of range. Please provide a valid index.');
    }
  } else {
    bot.sendMessage(chatId, 'Your to-do list is empty.');
  }
});

  bot.onText(/\/todo complete (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemText = match[1];
    if (todoLists[chatId]) {
      const item = todoLists[chatId].find(item => item.text === itemText);
      if (item) {
        item.completed = true;
        bot.sendMessage(chatId, `Marked "${itemText}" as completed.`);
      } else {
        bot.sendMessage(chatId, `"${itemText}" not found in your to-do list.`);
      }
    } else {
      bot.sendMessage(chatId, 'Your to-do list is empty.');
    }
  });

  // Convert currency from USD to the specified currency
  bot.onText(/\/convert (\d+\.?\d*) to (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const amount = match[1];
    const currency = match[2];
    const conversionUrl = `https://api.exchangerate-api.com/v4/latest/INR`;

    try {
      const response = await axios.get(conversionUrl);
      const rate = response.data.rates[currency.toUpperCase()];
      if (rate) {
        const convertedAmount = (amount * rate).toFixed(3);
        bot.sendMessage(chatId, `${amount} INR is ${convertedAmount} ${currency.toUpperCase()}`);
      } else {
        bot.sendMessage(chatId, 'Sorry, I do not support that currency.');
      }
    } catch (error) {
      bot.sendMessage(chatId, 'Sorry, I could not fetch the conversion rate.');
    }
  });

  // Handle errors
  bot.on('polling_error', (error) => {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.statusText || error.message;
    }
    console.error(`Polling error: ${error.code} - ${errorMessage}`);
  });

  bot.on('webhook_error', (error) => {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.statusText || error.message;
    }
    console.error(`Webhook error: ${error.code} - ${errorMessage}`);
  });

  // Download and save files
  bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.document.file_id;

    bot.downloadFile(fileId, './downloads').then(() => {
      bot.sendMessage(chatId, 'File downloaded successfully!');
    }).catch((error) => {
      console.error('File download error:', error);
      bot.sendMessage(chatId, 'Failed to download file.');
    });
  });


bot.onText(/\/quiz/, (msg) => {
  const chatId = msg.chat.id;
  startQuizSession(chatId);
});










bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.forward_from || msg.forward_from_chat) {
    let originalMessageInfo = 'This message was forwarded from:\n';

    // Information about the user who originally sent the message
    if (msg.forward_from) {
      originalMessageInfo += `*Original Sender*\n` +
        `*First Name*: ${msg.forward_from.first_name || 'N/A'}\n` +
        `*Last Name*: ${msg.forward_from.last_name || 'N/A'}\n` +
        `*Username*: ${msg.forward_from.username || 'N/A'}\n` +
        `*ID*: \`${msg.forward_from.id}\`\n` +
        `*Is Bot*: ${msg.forward_from.is_bot || 'N/A'}\n` +
        `*Language Code*: ${msg.forward_from.language_code || 'N/A'}\n`;
    }

    // Information about the chat where the message was originally sent
    if (msg.forward_from_chat) {
      originalMessageInfo += `\n*Original Chat*\n` +
        `*Chat Title*: ${msg.forward_from_chat.title || 'N/A'}\n` +
        `*Chat ID*: \`${msg.forward_from_chat.id}\`\n` +
        `*Chat Type*: ${msg.forward_from_chat.type || 'N/A'}\n`;

      // Fetch and display additional group info if it is a group chat
      if (msg.forward_from_chat.type === 'group' || msg.forward_from_chat.type === 'supergroup') {
        try {
          const chat = await bot.getChat(msg.forward_from_chat.id);

          originalMessageInfo += `\n*Group Info*\n` +
            `*Group Title*: ${chat.title || 'N/A'}\n` +
            `*Description*: ${chat.description || 'N/A'}\n` +
            `*Members Count*: ${chat.members_count || 'N/A'}\n` +
            `*Administrators*: ${await getChatAdministrators(chat.id) || 'N/A'}\n` +
            `*Is Private*: ${chat.is_private || 'N/A'}\n` +
            `*Invite Link*: ${chat.invite_link || 'N/A'}\n` +
            `*Pinned Message*: ${chat.pinned_message ? chat.pinned_message.text : 'N/A'}\n` +
            `*Chat Photo*: ${chat.photo ? 'Available' : 'N/A'}\n`;
        } catch (error) {
          console.error('Failed to fetch group info:', error);
          originalMessageInfo += `\n*Error*: Could not fetch detailed group information.\n`;
        }
      }
    } else {
      originalMessageInfo += `\n*Original Chat Info Not Available*\n`;
    }

    bot.sendMessage(chatId, originalMessageInfo, { parse_mode: 'Markdown' });
  }
});

// Function to get chat administrators
async function getChatAdministrators(chatId) {
  try {
    const admins = await bot.getChatAdministrators(chatId);
    return admins.map(admin => `- ${admin.user.first_name} (${admin.user.id})`).join('\n');
  } catch (error) {
    console.error('Failed to get chat administrators:', error);
    return 'Could not fetch administrators.';
  }
}


// Command to open chat with a specific user by ID
bot.onText(/\/profile (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  try {
    // Get user information from Telegram API
    const user = await bot.getChat(userId);
    if (user) {
      const username = user.username;

      // Create the clickable link if username exists
      if (username) {
        const userLink = `https://t.me/${username}`;
        bot.sendMessage(chatId, `Click the link to open chat with @${username}: ${userLink}`);
      } else {
        bot.sendMessage(chatId, `No username found for this user. Cannot generate a link.`);
      }
    } else {
      bot.sendMessage(chatId, `User not found.`);
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Error fetching user profile.');
  }
});


bot.onText(/\/getuserinfo (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  try {
    // Fetch the chat member details
    const chatMember = await bot.getChatMember(chatId, userId);

    if (chatMember) {
      const user = chatMember.user;
      const userInfo = `User Info:\n` +
        `First Name: ${user.first_name}\n` +
        `Last Name: ${user.last_name || 'N/A'}\n` +
        `Username: ${user.username || 'N/A'}\n` +
        `ID: ${user.id}\n` +
        `Language Code: ${user.language_code || 'N/A'}\n` +
        `Is Bot: ${user.is_bot || 'N/A'}`;

      bot.sendMessage(chatId, userInfo);
    } else {
      bot.sendMessage(chatId, `User not found in this group.`);
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    bot.sendMessage(chatId, 'Error fetching user info.');
  }
});
bot.onText(/\/0509/, (msg) => {
  const chatId = msg.chat.id;

  // URL of the external site you want to redirect to
  const externalUrl = 'https://deekshith0509.github.io'; // Replace with your URL

  // Send a message with a clickable link
  bot.sendMessage(chatId, `Click here to visit the site: [Developer's works](${externalUrl})`, { parse_mode: 'MarkdownV2' });
});
  console.log('Bot is running...');
  */
