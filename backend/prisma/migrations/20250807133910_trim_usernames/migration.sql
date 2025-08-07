UPDATE "User"
SET "username" = TRIM("username")
WHERE "username" LIKE "% " OR "username" LIKE " %";