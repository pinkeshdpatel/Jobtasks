/*
  # Add attachments column to tasks table

  1. Changes
    - Add `attachments` column to tasks table as a text array
    - Default value is an empty array
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE tasks 
    ADD COLUMN attachments text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;