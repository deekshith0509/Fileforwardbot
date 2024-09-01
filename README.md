# Telegram File Metadata Bot

This Telegram bot is designed to handle file uploads in a specified group chat, manage metadata storage, and provide various administrative and user functionalities.

## Features

- **File Upload Handling**: Accepts document and video files in a specified group chat.
- **Metadata Storage**: Saves file metadata (name, type, size, etc.) to a SQLite database.
- **File Search**: Allows users to search for files by name with paginated results.
- **Pagination**: Displays search results in a paginated format for easy browsing.
- **Admin Functions**: Includes listing files, removing files, clearing logs, and handling feedback.
- **Feedback Handling**: Collects, stores, and allows admins to manage user feedback.
- **Activity Logging**: Logs bot activity and administrative actions for tracking purposes.

## Technologies

- **Python**: Programming language used for the bot.
- **python-telegram-bot**: Library for interfacing with the Telegram API.
- **SQLite**: Database for storing file metadata.
- **CSV**: Format for storing and exporting user feedback.
- **Logging**: Python logging module for tracking bot activity.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/deekshith0509/fileforwardbot.git
   cd fileforwardbot
   ```

2. **Install dependencies:**

   Ensure you have Python 3.8 or later installed. Install the required libraries:

   ```bash
   pip install python-telegram-bot sqlite3
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:

   ```dotenv
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   GROUP=your_group_chat_id
   ```

   Replace `your_telegram_bot_token` with your bot token and `your_group_chat_id` with your group chat ID.

4. **Initialize the database:**

   The SQLite database will be initialized automatically when you run the bot for the first time.

## Usage

Run the bot using:

```bash
python main.py
```
