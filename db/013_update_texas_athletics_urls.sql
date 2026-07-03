-- Update Texas school athletics URLs from Texas_College_Softball_Athletic_Websites.md
-- Apply in pgAdmin, then re-scrape: npm run scrape:tx -- --concurrency 2

UPDATE schools SET athletics_url = 'https://wranglersports.com', updated_at = NOW()
WHERE school_name = 'Odessa College';
UPDATE schools SET athletics_url = 'https://apacheathletics.com', updated_at = NOW()
WHERE school_name = 'Tyler Junior College';
UPDATE schools SET athletics_url = 'https://mclennanathletics.com', updated_at = NOW()
WHERE school_name = 'McLennan Community College';
UPDATE schools SET athletics_url = 'https://grayson.edu/athletics', updated_at = NOW()
WHERE school_name = 'Grayson College';
UPDATE schools SET athletics_url = 'https://etbuathletics.com', updated_at = NOW()
WHERE school_name = 'East Texas Baptist University';
UPDATE schools SET athletics_url = 'https://gochaps.com', updated_at = NOW()
WHERE school_name = 'Midland College';
UPDATE schools SET athletics_url = 'https://templejc.edu/athletics', updated_at = NOW()
WHERE school_name = 'Temple College';
UPDATE schools SET athletics_url = 'https://wcathletics.com', updated_at = NOW()
WHERE school_name = 'Weatherford College';
UPDATE schools SET athletics_url = 'https://nctcathletics.com', updated_at = NOW()
WHERE school_name = 'North Central Texas College';
UPDATE schools SET athletics_url = 'https://vernoncollege.edu/athletics', updated_at = NOW()
WHERE school_name = 'Vernon College';
UPDATE schools SET athletics_url = 'https://ciscoathletics.com', updated_at = NOW()
WHERE school_name = 'Cisco College';
UPDATE schools SET athletics_url = 'https://hchawkssports.com', updated_at = NOW()
WHERE school_name = 'Howard College';
UPDATE schools SET athletics_url = 'https://wtccoyotes.com', updated_at = NOW()
WHERE school_name = 'Western Texas College';
UPDATE schools SET athletics_url = 'https://kilgore.edu/athletics', updated_at = NOW()
WHERE school_name = 'Kilgore College';
UPDATE schools SET athletics_url = 'https://navarroathletics.com', updated_at = NOW()
WHERE school_name = 'Navarro College';
UPDATE schools SET athletics_url = 'https://buccaneersports.com', updated_at = NOW()
WHERE school_name = 'Blinn College';
UPDATE schools SET athletics_url = 'https://sanjacsports.com', updated_at = NOW()
WHERE school_name = 'San Jacinto College';
UPDATE schools SET athletics_url = 'https://tvccsports.com', updated_at = NOW()
WHERE school_name = 'Trinity Valley Community College';
UPDATE schools SET athletics_url = 'https://pjc.edu/athletics', updated_at = NOW()
WHERE school_name = 'Paris Junior College';
UPDATE schools SET athletics_url = 'https://hillcollege.edu/athletics', updated_at = NOW()
WHERE school_name = 'Hill College';
UPDATE schools SET athletics_url = 'https://clarendonbulldogs.com', updated_at = NOW()
WHERE school_name = 'Clarendon College';
UPDATE schools SET athletics_url = 'https://fpclainsports.com', updated_at = NOW()
WHERE school_name = 'Frank Phillips College';
UPDATE schools SET athletics_url = 'https://epcc.edu/Athletics', updated_at = NOW()
WHERE school_name = 'El Paso Community College';
UPDATE schools SET athletics_url = 'https://rangercollegeathletics.com', updated_at = NOW()
WHERE school_name = 'Ranger College';
UPDATE schools SET athletics_url = 'https://trinitytigers.com', updated_at = NOW()
WHERE school_name = 'Trinity University';
UPDATE schools SET athletics_url = 'https://acroos.com', updated_at = NOW()
WHERE school_name = 'Austin College';
UPDATE schools SET athletics_url = 'https://hsuathletics.com', updated_at = NOW()
WHERE school_name = 'Hardin-Simmons University';
UPDATE schools SET athletics_url = 'https://hputx.edu/athletics', updated_at = NOW()
WHERE school_name = 'Howard Payne University';
UPDATE schools SET athletics_url = 'https://cruathletics.com', updated_at = NOW()
WHERE school_name = 'University of Mary Hardin-Baylor';
UPDATE schools SET athletics_url = 'https://southwesternpirates.com', updated_at = NOW()
WHERE school_name = 'Southwestern University';
UPDATE schools SET athletics_url = 'https://schreinerathletics.com', updated_at = NOW()
WHERE school_name = 'Schreiner University';
UPDATE schools SET athletics_url = 'https://letuathletics.com', updated_at = NOW()
WHERE school_name = 'LeTourneau University';
UPDATE schools SET athletics_url = 'https://mcmurryads.com', updated_at = NOW()
WHERE school_name = 'McMurry University';
UPDATE schools SET athletics_url = 'https://godustdevils.com', updated_at = NOW()
WHERE school_name = 'Texas A&M International University';
UPDATE schools SET athletics_url = 'https://utpbbasinguns.com', updated_at = NOW()
WHERE school_name = 'University of Texas Permian Basin';
UPDATE schools SET athletics_url = 'https://rattlerathletics.com', updated_at = NOW()
WHERE school_name = 'St. Mary''s University';
UPDATE schools SET athletics_url = 'https://gohilltoppers.com', updated_at = NOW()
WHERE school_name = 'St. Edward''s University';

-- Schools in the markdown not yet in seed (add separately if desired):
--   Houston Christian University: https://hcuhuskies.com
--   Lamar University: https://lamarcardinals.com
--   Prairie View A&M University: https://pvpanthers.com
--   Stephen F. Austin State University: https://sfajacks.com
--   Tarleton State University: https://tarletonsports.com
--   Texas A&M University-Commerce: https://lionathletics.com
--   Texas A&M University-Corpus Christi: https://goislanders.com
--   Midwestern State University: https://msumustangs.com
--   Sul Ross State University: https://srlobos.com
--   Alvin College: https://www.alvincollege.edu/athletics/softball.html
--   Angelina College: https://angelinaathletics.com
--   Coastal Bend College: https://cbcathletics.com
--   Galveston College: https://gc.edu/athletics
--   Laredo College: https://laredo.edu/athletics
--   Northeast Texas Community College: https://ntcceagles.com
--   South Plains College: https://spctexans.com
--   Southwest Texas Junior College: https://swtjc.edu/athletics
--   Texarkana College: https://texarkanacollege.edu/athletics
--   Houston-Victoria: https://uhvjaguars.com
--   Jarvis Christian University: https://jarvisathletics.com
--   Nelson University: https://nelsonlions.com
--   Our Lady of the Lake University: https://ollusaintsathletics.com
--   Texas A&M-Texarkana: https://tamuteagles.com
--   Texas College: https://texascollege.edu/athletics
--   Texas Wesleyan University: https://txwesathletics.com
--   University of the Southwest: https://uswathletics.com
--   Wayland Baptist University: https://wbuathletics.com
