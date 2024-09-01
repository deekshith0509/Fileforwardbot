import csv
import os
import logging
import sqlite3
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters
)
from collections import defaultdict

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    handlers=[
        logging.FileHandler('bot_activity.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

from os.path import join, dirname
from dotenv import load_dotenv

# Load environment variables from the .env file
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Retrieve environment variables with validation
API_TOKEN = os.environ.get('API_TOKEN')
if API_TOKEN is None:
    raise ValueError("Environment variable 'API_TOKEN' is not set.")

DATABASE = os.environ.get('DATABASE')
if DATABASE is None:
    raise ValueError("Environment variable 'DATABASE' is not set.")

ALLOWED_GROUP_ID = os.environ.get('ALLOWED_GROUP_ID')
try:
    ALLOWED_GROUP_ID = int(ALLOWED_GROUP_ID) if ALLOWED_GROUP_ID is not None else None
except ValueError:
    raise ValueError("Environment variable 'ALLOWED_GROUP_ID' must be an integer.")

ADMIN_USERS = os.environ.get('ADMIN_USERS')
if ADMIN_USERS:
    try:
        ADMIN_USERS = list(map(int, ADMIN_USERS.split(',')))
    except ValueError:
        raise ValueError("Environment variable 'ADMIN_USERS' must be a comma-separated list of integers.")
else:
    ADMIN_USERS = []

    
    
PAGE_SIZE = 6  

def human_readable_size(size):
    """Convert file size to a human-readable format."""
    if size < 1024:
        return f"{size}B"
    elif size < 1024 ** 2:
        return f"{size / 1024:.2f}KB"
    elif size < 1024 ** 3:
        return f"{size / (1024 ** 2):.2f}MB"
    else:
        return f"{size / (1024 ** 3):.2f}GB"



def log_bot_activity(update=None, activity=""):
    """Log bot activities to a file with user details."""
    if isinstance(update, Update) and update.message and update.message.from_user:
        user = update.message.from_user
        user_info = f"User ID: {user.id}, First Name: {user.first_name}, Last Name: {user.last_name or 'N/A'}"
    else:
        user_info = "User information not available"

    with open('bot_activity.log', 'a', encoding='utf-8') as log_file:
        log_file.write(f"{datetime.now()}: {activity} | {user_info}\n")

# Initialize the database
def get_db_connection():
    """Create and return a new database connection."""
    conn = sqlite3.connect(DATABASE)
    return conn

def init_db():
    """Initialize the database with the required table."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS file_metadata (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            file_id TEXT NOT NULL UNIQUE,
                            chat_id INTEGER NOT NULL,
                            file_name TEXT NOT NULL,
                            message_id INTEGER NOT NULL,
                            file_type TEXT NOT NULL,
                            file_size INTEGER NOT NULL
                          )''')
        conn.commit()



async def save_file_metadata(update: Update, file_id: str, chat_id: int, file_name: str, message_id: int, file_type: str, file_size: int) -> None:
    """Save file metadata to the database and handle duplicates."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check for existing file_id
            cursor.execute("SELECT 1 FROM file_metadata WHERE file_id = ?", (file_id,))
            if cursor.fetchone():
                await update.message.reply_text(f"File with ID '{file_id}' already exists in the database. Upload discarded.")
                return  # Exit the function to prevent further processing

            # Insert new file metadata
            cursor.execute("""
                INSERT INTO file_metadata (file_id, chat_id, file_name, message_id, file_type, file_size)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (file_id, chat_id, file_name, message_id, file_type, file_size))
            conn.commit()
            log_bot_activity(update, f"File '{file_name}' uploaded and saved to chat {chat_id}.")
    except sqlite3.Error as e:
        logging.error(f"Error saving file metadata: {e}")
        await update.message.reply_text(f"Error saving file: {e}")


def search_file_metadata(query):
    """Search for files in the database by file name, matching whole words or phrases."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Convert query into a pattern for different cases
            pattern_start = f"{query}%"
            pattern_middle = f"% {query} %"
            pattern_underscore = f"_{query}_"

            # Search using patterns for start of filename, middle, and underscore
            cursor.execute("""
                SELECT file_id, chat_id, file_name, message_id, file_type, file_size
                FROM file_metadata
                WHERE file_name LIKE ? OR file_name LIKE ? OR file_name LIKE ?
            """, (pattern_start, pattern_middle, pattern_underscore))
            
            files = cursor.fetchall()
            return files
    except sqlite3.Error as e:
        logging.error(f"Error searching file metadata: {e}")
        return []


def is_admin(user_id):
    """Check if a user is an admin."""
    return user_id in ADMIN_USERS


async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle document uploads and save metadata to the database."""
    chat_id = update.message.chat_id

    if chat_id == ALLOWED_GROUP_ID:
        document = update.message.document
        file_id = document.file_id
        file_name = document.file_name
        message_id = update.message.message_id
        file_size = document.file_size

        # Await the save_file_metadata coroutine to handle duplicates and save metadata
        await save_file_metadata(update, file_id, chat_id, file_name, message_id, 'document', file_size)
        
        # Send confirmation message
        await update.message.reply_text(f"Document '{file_name}' uploaded and saved.")
    else:
        await update.message.reply_text("This bot only accepts files from a specific group.")

async def handle_video(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle video uploads and save metadata to the database."""
    chat_id = update.message.chat_id

    if chat_id == ALLOWED_GROUP_ID:
        video = update.message.video
        file_id = video.file_id
        file_name = video.file_name
        message_id = update.message.message_id
        file_size = video.file_size

        # Await the save_file_metadata coroutine to handle duplicates and save metadata
        await save_file_metadata(update, file_id, chat_id, file_name, message_id, 'video', file_size)
        
        # Send confirmation message
        await update.message.reply_text(f"Video '{file_name}' uploaded and saved.")
    else:
        await update.message.reply_text("This bot only accepts videos from a specific group.")


async def search_files(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle text messages to search for and show matching files."""
    query = update.message.text
    files = search_file_metadata(query)
    user_id = update.message.from_user.id
    
    if files:
        context.user_data['current_page'] = 0
        context.user_data['files'] = files
        await show_files(update, context, 0)
    else:
        await update.message.reply_text("No files found with that name.")

async def show_files(update: Update, context: ContextTypes.DEFAULT_TYPE, page: int) -> None:
    """Show paginated files with inline buttons."""
    files = context.user_data.get('files', [])
    start_idx = page * PAGE_SIZE
    end_idx = start_idx + PAGE_SIZE
    page_files = files[start_idx:end_idx]
    
    if not page_files:
        await update.message.reply_text("No files to display.")
        return
    
    keyboard = [
        [InlineKeyboardButton(f"[{human_readable_size(file[5])}] {file[2]}", callback_data=str(idx))]
        for idx, file in enumerate(page_files, start=start_idx)
    ]
    
    nav_buttons = []
    if start_idx > 0:
        nav_buttons.append(InlineKeyboardButton("Back", callback_data="prev_page"))
    if end_idx < len(files):
        nav_buttons.append(InlineKeyboardButton("Next", callback_data="next_page"))
    
    keyboard.append(nav_buttons)
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    page_number_text = f"Page {page + 1}/{(len(files) + PAGE_SIZE - 1) // PAGE_SIZE}"
    
    if update.callback_query:
        await update.callback_query.edit_message_text(f"Select a file to forward:\n{page_number_text}", reply_markup=reply_markup)
    else:
        await update.message.reply_text(f"Select a file to forward:\n{page_number_text}", reply_markup=reply_markup)






async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a concise welcome message and instructions when the bot starts."""
    user = update.message.from_user
    user_id, first_name, last_name = user.id, user.first_name, user.last_name or 'N/A'
    welcome_message = (
        f"Hi, {first_name} {last_name}!\n\n"
        "Welcome to the File Retrieval Bot!\n\n"
        "Commands:\n"
        "/start - Show this message\n"
        "/list_files - List files (admin only)\n"
        "/remove_file [filename] - Remove a file (admin only)\n"
        "/remove_files [id] - Remove files by ID (admin only)\n"
        "/show_log - View activity log (admin only)\n"
        "/clear_log - Clear the activity log (admin only)\n"
        "/feedback [your feedback] - Send feedback\n"
        "/sfeedback - Show feedback (admin only)\n"
        "/dfeedback - Delete feedback (admin only)\n\n"
        f"Your User ID: {user_id}"
    )
    await update.message.reply_text(welcome_message)
    log_bot_activity(update, f"User {first_name} {last_name} (ID: {user_id}) started the bot.")





async def feedback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle user feedback and store it in a CSV file."""
    user = update.message.from_user
    user_id = user.id
    first_name = user.first_name
    last_name = user.last_name or 'N/A'
    feedback_text = ' '.join(context.args)

    if not feedback_text:
        await update.message.reply_text("Please provide feedback after the command.")
        return

    # Define the path for the feedback file
    feedback_file = 'feedback.csv'

    # Write feedback to the file
    file_exists = os.path.isfile(feedback_file)
    with open(feedback_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            # Write header if file does not exist
            writer.writerow(['User ID', 'First Name', 'Last Name', 'Feedback', 'Timestamp'])
        writer.writerow([user_id, first_name, last_name, feedback_text, datetime.now().isoformat()])

    await update.message.reply_text("Thank you for your feedback!")

    # Check if feedback length exceeds the Telegram limit
    if len(feedback_text) > 4096:
        if is_admin(user_id):
            # Send the feedback CSV file to the admin
            admin_chat_id = update.message.chat_id  # Replace with actual admin chat ID
            with open(feedback_file, 'rb') as file:
                await context.bot.send_document(chat_id=admin_chat_id, document=file, filename='feedback.csv')
            await update.message.reply_text("The feedback file has been sent to the admin.")
        else:
            await update.message.reply_text("Feedback is too long. Please shorten it or contact the admin directly.")

async def sfeedback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show all feedback to the admin."""
    user_id = update.message.from_user.id

    if not is_admin(user_id):
        await update.message.reply_text("You are not authorized to access this command.")
        return

    feedback_file = 'feedback.csv'

    if not os.path.isfile(feedback_file):
        await update.message.reply_text("No feedback found.")
        return

    with open(feedback_file, 'r') as file:
        feedback_content = file.read()

    if len(feedback_content) > 4096:
        await update.message.reply_text("Feedback file is too large to display here. Please check the file directly.")
        # Send the feedback file to the admin
        admin_chat_id = update.message.chat_id  # Replace with actual admin chat ID
        with open(feedback_file, 'rb') as file:
            await context.bot.send_document(chat_id=admin_chat_id, document=file, filename='feedback.csv')
    else:
        await update.message.reply_text(feedback_content)

async def dfeedback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Delete all feedback from the CSV file."""
    user_id = update.message.from_user.id

    if not is_admin(user_id):
        await update.message.reply_text("You are not authorized to access this command.")
        return

    feedback_file = 'feedback.csv'

    if not os.path.isfile(feedback_file):
        await update.message.reply_text("No feedback to delete.")
        return

    os.remove(feedback_file)
    await update.message.reply_text("Feedback has been deleted.")


from typing import Dict, List
import logging
from telegram import Update
from telegram.ext import ContextTypes
from asyncio import Lock

logger = logging.getLogger(__name__)

# Global lock and queue dictionary
lock = Lock()
user_file_queue: Dict[int, List[int]] = {}

async def handle_callback_query(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    data = query.data
    user_id = query.from_user.id
    chat_id = query.message.chat.id  # Use the chat ID from the callback query's message

    async with lock:
        if data == "send_files":
            if chat_id in user_file_queue:
                await send_selected_files(update, context, chat_id)
            else:
                await query.answer(text="No files selected. Please select files first.")
        elif data == "next_page":
            current_page = context.user_data.get("current_page", 0)
            await show_files(update, context, current_page + 1)
            context.user_data["current_page"] = current_page + 1
        elif data == "prev_page":
            current_page = context.user_data.get("current_page", 0)
            await show_files(update, context, current_page - 1)
            context.user_data["current_page"] = current_page - 1
        elif data.isdigit():
            index = int(data)
            files = context.user_data.get('files', [])
            if 0 <= index < len(files):
                # Store the selected file index
                if index not in user_file_queue.get(chat_id, []):
                    user_file_queue.setdefault(chat_id, []).append(index)
                # Forward the file directly
                file = files[index]
                file_id, file_chat_id, message_id = file[0], file[1], file[3]
                try:
                    await context.bot.copy_message(chat_id=chat_id, from_chat_id=file_chat_id, message_id=message_id)
                    logger.info(f"Successfully forwarded file ID {file_id} to chat ID {chat_id}.")
                except Exception as e:
                    logger.error(f"Error sending file ID {file_id} to chat ID {chat_id}: {e}")
            else:
                await query.answer(text="Invalid selection. Please try again.")
        else:
            await query.answer(text="Unknown action. Please try again.")

async def send_selected_files(update: Update, context: ContextTypes.DEFAULT_TYPE, chat_id: int) -> None:
    files = context.user_data.get('files', [])
    selected_indices = user_file_queue.get(chat_id, [])

    async with lock:
        if selected_indices:
            for index in selected_indices:
                if 0 <= index < len(files):
                    file = files[index]
                    file_id, file_chat_id, message_id = file[0], file[1], file[3]
                    try:
                        # Forward each file by its file_id
                        await context.bot.copy_message(chat_id=chat_id, from_chat_id=file_chat_id, message_id=message_id)
                        logger.info(f"Successfully forwarded file ID {file_id} to chat ID {chat_id}.")
                    except Exception as e:
                        logger.error(f"Error sending file ID {file_id} to chat ID {chat_id}: {e}")
                        await context.bot.send_message(chat_id=chat_id, text=f"Failed to send file: {file_id}")

            # Notify after sending all selected files
            await context.bot.send_message(chat_id=chat_id, text="All selected files have been sent.")
        else:
            await context.bot.send_message(chat_id=chat_id, text="No files were selected or available to send.")

        # Clear the user's queue and update the callback message
        user_file_queue[chat_id] = []
        await update.callback_query.message.edit_text("Files have been sent. Thank you!")
        await update.callback_query.message.edit_reply_markup(reply_markup=None)



    


    
def start_removal_timer(user_id: int):
    """Start or reset the inactivity timer for the user."""
    if user_id in removal_timers:
        removal_timers[user_id].cancel()
    timer = Timer(600, lambda: clear_user_selections(user_id))
    timer.start()
    removal_timers[user_id] = timer

def clear_user_selections(user_id: int):
    """Clear the file selections for the user and delete the timer."""
    if user_id in user_selections:
        user_selections[user_id] = []
    if user_id in removal_timers:
        del removal_timers[user_id]



import os
import json
import tempfile
async def admin_list_files(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """List all files stored in the database, export as JSON/CSV, or display the first 4096 characters."""
    user_id = update.message.from_user.id
    if is_admin(user_id):
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                
                # Fetch all data from the file_metadata table
                cursor.execute("SELECT * FROM file_metadata")
                files = cursor.fetchall()
                
                # Fetch the column names
                column_names = [description[0] for description in cursor.description]
                
                if not files:
                    await update.message.reply_text("No files found.")
                    return

                # Construct a list of dictionaries for JSON export
                files_data = [dict(zip(column_names, file)) for file in files]

                # Handle JSON export
                if context.args and context.args[0].lower() == 'json':
                    # Convert the list of dictionaries to JSON
                    files_json = json.dumps(files_data, indent=4)
                    with tempfile.NamedTemporaryFile(delete=False, mode='w', newline='', suffix='.json') as temp_file:
                        temp_file.write(files_json)
                        temp_file_path = temp_file.name
                    
                    # Send the JSON file as a document
                    with open(temp_file_path, 'rb') as file:
                        await update.message.reply_document(document=file, filename='file_metadata.json')
                    
                    # Remove the temporary file
                    os.remove(temp_file_path)
                    return
                
                # Prepare the table data for display in the message
                file_list = "\n".join(
                    [f"{idx + 1}. {file['id']} - {file['file_name']} ({file['file_type']}) - {human_readable_size(file['file_size'])}"
                     for idx, file in enumerate(files_data)]
                )
                
                # Check the length of the file_list
                if len(file_list) > 4096:  # Telegram message length limit
                    with tempfile.NamedTemporaryFile(delete=False, mode='w', newline='', suffix='.csv') as temp_file:
                        writer = csv.DictWriter(temp_file, fieldnames=column_names)
                        writer.writeheader()
                        writer.writerows(files_data)
                        temp_file_path = temp_file.name
                    
                    # Send the CSV file as a document
                    with open(temp_file_path, 'rb') as file:
                        await update.message.reply_document(document=file, filename='file_metadata.csv')
                    
                    # Remove the temporary file
                    os.remove(temp_file_path)
                else:
                    # Send the file list as a text message
                    await update.message.reply_text(f"Files:\n{file_list}")

        except sqlite3.Error as e:
            logging.error(f"Error listing files: {e}")
            await update.message.reply_text(f"Error listing files: {e}")
    else:
        await update.message.reply_text("You are not authorized to use this command.")




def parse_index(index_str: str, total_count: int) -> int:
    """Parse and validate the index string and return the corresponding 0-based index."""
    try:
        # Convert the index string to an integer
        index = int(index_str)
        # Adjust for 1-based indexing, so we convert to 0-based by subtracting 1
        index -= 1
        # Check if the index is within the valid range
        if 0 <= index < total_count:
            return index
        else:
            return None
    except ValueError:
        # Handle the case where the index is not a valid integer
        return None





async def remove_file(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Remove files based on provided id."""
    user_id = update.message.from_user.id
    if is_admin(user_id):
        if context.args:
            file_id_str = " ".join(context.args).strip()
            
            try:
                file_id = int(file_id_str)  # Convert the provided id to an integer
                
                with get_db_connection() as conn:
                    cursor = conn.cursor()
                    
                    # Check if the provided id exists in the table
                    cursor.execute("SELECT file_name FROM file_metadata WHERE id = ?", (file_id,))
                    result = cursor.fetchone()
                    
                    if result:
                        file_name = result[0]
                        
                        # Delete the row with the matching id
                        cursor.execute("DELETE FROM file_metadata WHERE id = ?", (file_id,))
                        conn.commit()
                        
                        await update.message.reply_text(f"File '{file_name}' removed successfully.")
                        log_bot_activity(f"File with id {file_id} removed by admin {user_id}.")
                    else:
                        await update.message.reply_text(f"No file found with id {file_id}.")
            except ValueError:
                await update.message.reply_text("Invalid id provided. Please provide a numeric id.")
            except sqlite3.Error as e:
                logging.error(f"Error removing file: {e}")
                await update.message.reply_text(f"Error removing file: {e}")
        else:
            await update.message.reply_text("Please provide the id of the file to remove.")
    else:
        await update.message.reply_text("You are not authorized to use this command.")




import os

async def show_log(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send the bot activity log to the user. If the log is too long, send it as a file. Accessible only to admins."""
    user_id = update.message.from_user.id
    
    # Check if the user is an admin
    if is_admin(user_id):
        log_file_path = 'bot_activity.log'
        
        # Read the log file
        with open(log_file_path, 'r') as log_file:
            log_data = log_file.read()
        
        # Check if log data exceeds a certain length (e.g., 4096 characters)
        if len(log_data) > 4096:
            # Send the log file as an attachment
            await context.bot.send_document(
                chat_id=update.message.chat_id,
                document=open(log_file_path, 'rb'),
                filename='bot_activity.log',
                caption='Bot Activity Log'
            )
        else:
            # Send the log data as a text message
            await update.message.reply_text(f"Bot Activity Log:\n{log_data}")
    else:
        # Notify the user they are not authorized
        await update.message.reply_text("You are not authorized to view the bot activity log.")


async def clear_log(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Clear the bot activity log."""
    user_id = update.message.from_user.id
    if is_admin(user_id):
        try:
            open('bot_activity.log', 'w').close()
            await update.message.reply_text("Log file cleared.")
            log_bot_activity(f"Admin {user_id} cleared the log file.")  # No update required here
        except Exception as e:
            await update.message.reply_text(f"Error clearing log file: {e}")
    else:
        await update.message.reply_text("You are not authorized to use this command.")


def main():
    """Start the bot."""
    app = ApplicationBuilder().token(API_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    app.add_handler(MessageHandler(filters.VIDEO, handle_video))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), search_files))
    app.add_handler(CallbackQueryHandler(handle_callback_query))
    app.add_handler(CommandHandler("list_files", admin_list_files))
    app.add_handler(CommandHandler("remove_file", remove_file))
    app.add_handler(CommandHandler("show_log", show_log))
    app.add_handler(CommandHandler("clear_log", clear_log))
    app.add_handler(CommandHandler("feedback", feedback))
    app.add_handler(CommandHandler("sfeedback", sfeedback))
    app.add_handler(CommandHandler("dfeedback", dfeedback))

    init_db()

    try:
        logger.info("Starting the bot...")
        app.run_polling()
    except KeyboardInterrupt:
        logger.info("Bot stopped by user.")
        sys.exit(0) 
if __name__ == '__main__':
    main()
