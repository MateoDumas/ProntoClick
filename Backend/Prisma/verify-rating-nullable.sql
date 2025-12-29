-- Script para verificar si el campo rating es nullable
-- Ejecutar este script en pgAdmin

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'SupportSurvey' 
AND column_name = 'rating';

-- Si is_nullable es 'NO', entonces necesitas ejecutar el script update-survey-rating-nullable.sql
-- Si is_nullable es 'YES', entonces el campo es nullable y el problema es que Prisma no se regeneró

