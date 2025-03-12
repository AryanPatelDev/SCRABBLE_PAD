# Scrabble Pad - A Minimalist Writing Tool

#### Video Demo:  https://youtu.be/PyQm6UknWIY

#### Description:
Scrabble Pad is a simple, distraction-free writing tool designed with a focus on clarity and functionality. Whether you're jotting down quick notes, brainstorming ideas, or drafting full documents, Scrabble Pad provides a clean and minimalistic interface to enhance your writing experience. Key features include a large, placeholder-driven textarea, a customizable heading area, and an easy-to-use toggle menu for importing, exporting, switching themes, and clearing the text area. This project was developed as part of the CS50 course to explore the importance of user-focused design in software development.

### Key Features:
- **Distraction-Free Interface:** The main feature of Scrabble Pad is its large, uncluttered textarea that allows users to focus solely on their writing. The placeholder text "Start typing..." guides users initially but disappears once typing begins, reappearing only when the field is empty.

- **Customizable Heading Area:** Above the textarea, there's a heading area where users can enter a title or leave it blank. The placeholder "HEADING HERE..." can be removed by clicking, providing a clean slate for your document title. This flexibility ensures that the heading is as useful or minimal as the user desires.

- **Toggle Menu:** The application includes a small, intuitive toggle menu offering several key functionalities:
  - **Import/Export:** Easily import text files to continue your work or export your notes and drafts with a simple click. When exporting, if no heading is provided, the filename automatically includes the current date and time for better organization.
  - **Light/Dark Mode Switch:** Users can switch between light and dark modes to match their preference or environment, making the tool versatile for different lighting conditions.
  - **Clear Text:** Quickly clear the textarea and heading to start fresh, useful for when you need a blank slate without manually deleting content.

- **Export Functionality:** When exporting a file, if the heading is blank, the filename automatically incorporates the current date and time in the format `YYYYMMDD_HHMM.txt`. This feature helps in organizing and tracking documents efficiently. If a heading is provided, it will be used as the filename, allowing users to name their files intuitively.

- **Import Functionality:** The import feature allows users to upload text files. If the file includes a heading in the format `##HEADING##`, it is extracted and displayed above the textarea; otherwise, the content is treated as plain text.

### Purpose and Use Cases:
Scrabble Pad was created with the intention of providing a minimalist tool for various writing tasks. Whether you need to jot down quick notes, draft ideas, brainstorm, or work on longer documents, Scrabble Pad offers a straightforward and effective solution. It’s ideal for writers, students, and professionals who value a clean workspace and efficient document management.

This project reflects my journey in learning and applying software development principles from CS50x, focusing on creating a tool that is both functional and user-friendly. Scrabble Pad stands as a testament to the importance of simplicity in design and the power of effective user interface elements.

Feel free to explore the demo video linked above to see Scrabble Pad in action and discover how it can streamline your writing process.
