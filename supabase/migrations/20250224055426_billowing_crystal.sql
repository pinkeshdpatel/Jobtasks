/*
  # Add missing columns to tasks table

  1. Changes
    - Add time_spent column to track time spent on tasks in minutes
    - Add attachments column to store task attachments
    - Add progress column to track task completion percentage

  2. Notes
    - Using IF NOT EXISTS to prevent errors if columns already exist
    - Setting appropriate default values for each column
*/

DO $$ 
BEGIN
  -- Add time_spent column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'time_spent'
  ) THEN
    ALTER TABLE tasks 
    ADD COLUMN time_spent integer NOT NULL DEFAULT 0;
  END IF;

  -- Add progress column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'progress'
  ) THEN
    ALTER TABLE tasks 
    ADD COLUMN progress integer NOT NULL DEFAULT 0;
  END IF;

  -- Add attachments column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE tasks 
    ADD COLUMN attachments text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;