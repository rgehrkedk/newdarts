/*
  # Fix First Nine Calculation
  
  1. Changes
    - Update calculate_first_nine function to use first three scores
    - Maintain existing statistics
    
  2. Details
    - Reverse array to get actual first three scores
    - Keep calculation method (total / 9)
*/

-- Update function to calculate first nine average correctly
CREATE OR REPLACE FUNCTION calculate_first_nine(turn_scores integer[])
RETURNS numeric AS $$
DECLARE
  reversed_scores integer[];
  first_three integer[];
  total numeric;
BEGIN
  -- Reverse the array to get scores in chronological order
  SELECT array_agg(score ORDER BY rn)
  INTO reversed_scores
  FROM (
    SELECT score, row_number() OVER () as rn
    FROM unnest(turn_scores) WITH ORDINALITY as t(score, rn)
    ORDER BY rn DESC
  ) sub;
  
  -- Get first three scores
  IF array_length(reversed_scores, 1) >= 3 THEN
    first_three := reversed_scores[1:3];
    total := (first_three[1] + first_three[2] + first_three[3])::numeric;
    RETURN ROUND((total / 9)::numeric, 2);
  END IF;
  
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Recalculate first_nine for existing records
UPDATE game_participants
SET first_nine = calculate_first_nine(turn_scores)
WHERE array_length(turn_scores, 1) >= 3;