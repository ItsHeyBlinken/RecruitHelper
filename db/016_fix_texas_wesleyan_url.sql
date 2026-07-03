-- Texas Wesleyan athletics site moved to ramsports.net (Sidearm)

UPDATE schools
SET athletics_url = 'https://ramsports.net/sports/softball',
    updated_at = NOW()
WHERE school_name = 'Texas Wesleyan University';
