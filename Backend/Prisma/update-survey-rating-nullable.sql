-- Script para hacer que el campo rating sea opcional (nullable) en SupportSurvey
-- Ejecutar este script en pgAdmin o en la consola de PostgreSQL

-- Modificar la columna rating para permitir NULL
ALTER TABLE "SupportSurvey" 
ALTER COLUMN "rating" DROP NOT NULL;

-- Verificar que el cambio se aplicó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'SupportSurvey' 
AND column_name = 'rating';

SELECT 'Campo rating actualizado correctamente a nullable' AS resultado;

