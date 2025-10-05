# Models provide a clear reference of the database structure

## Please refer to this (models) folder for each collection's structure

## HOW IT WORKS

### Users

- User contain the typical fields, but it has isAdmin, as Sifthr will have an admin view
  - Admins can add modules and quizzes
  - Admins can also add news

### Modules

- Modules contain only the title, description and objectID (unique identifier provided by MongoDB) (possible picture URL addition)
- ModuleSections are the module contents connected with the Modules ID

### Quiz (quizzes in db)

- Quiz contains only the title, description and objectID (unique identifier provided by MongoDB)
- Question is the quiz version of ModuleSections (connected via objectId of quiz)
  - It has two types (currently): Input and multiple choice
  - Front-end takes this value and displays either a multiple choice or input based on this
