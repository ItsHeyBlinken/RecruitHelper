-- Fix UTPB athletics URL (utpbbasinguns.com is dead; correct domain is utpbfalcons.com)
UPDATE schools SET athletics_url = 'https://utpbfalcons.com', updated_at = NOW()
WHERE school_name = 'University of Texas Permian Basin';
