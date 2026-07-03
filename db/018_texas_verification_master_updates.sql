-- Apply URL fixes and removals from Texas_Softball_URL_Verification_Master.md

DELETE FROM schools WHERE school_name IN ('Southwest Texas Junior College', 'Texarkana College', 'Laredo College');

UPDATE schools SET athletics_url = 'https://mcmurrysports.com', updated_at = NOW()
WHERE school_name = 'McMurry University';

UPDATE schools SET athletics_url = 'https://schreinermountaineers.com', updated_at = NOW()
WHERE school_name = 'Schreiner University';

UPDATE schools SET athletics_url = 'https://hpusports.com', updated_at = NOW()
WHERE school_name = 'Howard Payne University';

UPDATE schools SET athletics_url = 'https://goetbutigers.com', updated_at = NOW()
WHERE school_name = 'East Texas Baptist University';

UPDATE schools SET athletics_url = 'https://jcubulldogs.com', updated_at = NOW()
WHERE school_name = 'Jarvis Christian University';

UPDATE schools SET athletics_url = 'https://www.tcsteersathletics.com', updated_at = NOW()
WHERE school_name = 'Texas College';

UPDATE schools SET athletics_url = 'https://athletics.alvincollege.edu', updated_at = NOW()
WHERE school_name = 'Alvin Community College';

UPDATE schools SET athletics_url = 'https://www.hchawk.com', updated_at = NOW()
WHERE school_name = 'Howard College';

UPDATE schools SET athletics_url = 'https://navarrobulldogs.com', updated_at = NOW()
WHERE school_name = 'Navarro College';

UPDATE schools SET athletics_url = 'https://www.wranglersports.net', updated_at = NOW()
WHERE school_name = 'Cisco College';

UPDATE schools SET athletics_url = 'https://www.gcwhitecaps.com', updated_at = NOW()
WHERE school_name = 'Galveston College';

UPDATE schools SET athletics_url = 'https://www.gcvikings.com', updated_at = NOW()
WHERE school_name = 'Grayson College';

UPDATE schools SET athletics_url = 'https://hillcollegeathletics.com', updated_at = NOW()
WHERE school_name = 'Hill College';

UPDATE schools SET athletics_url = 'https://www.kcrangernation.com', updated_at = NOW()
WHERE school_name = 'Kilgore College';

UPDATE schools SET athletics_url = 'https://pjcathletics.com', updated_at = NOW()
WHERE school_name = 'Paris Junior College';

UPDATE schools SET athletics_url = 'https://www.rangersports.net', updated_at = NOW()
WHERE school_name = 'Ranger College';

UPDATE schools SET athletics_url = 'https://plainsmensports.com', updated_at = NOW()
WHERE school_name = 'Frank Phillips College';

UPDATE schools SET athletics_url = 'https://www.tcleopards.com', updated_at = NOW()
WHERE school_name = 'Temple College';

UPDATE schools SET athletics_url = 'https://www.wtcathletics.com', updated_at = NOW()
WHERE school_name = 'Western Texas College';

UPDATE schools SET athletics_url = 'https://www.epcc.edu/Services/Athletics/softball', updated_at = NOW()
WHERE school_name = 'El Paso Community College';

UPDATE schools SET athletics_url = 'https://www.vernoncollege.edu/athletics', updated_at = NOW()
WHERE school_name = 'Vernon College';

UPDATE schools SET athletics_url = 'https://brookhavenathletics.com', updated_at = NOW()
WHERE school_name = 'Dallas College Brookhaven';

UPDATE schools SET athletics_url = 'https://eastfieldathletics.com', updated_at = NOW()
WHERE school_name = 'Dallas College Eastfield';

UPDATE schools SET athletics_url = 'https://northlakecollegeathletics.com', updated_at = NOW()
WHERE school_name = 'Dallas College North Lake';

UPDATE schools SET athletics_url = 'https://rlcsports.com', updated_at = NOW()
WHERE school_name = 'Dallas College Richland';
