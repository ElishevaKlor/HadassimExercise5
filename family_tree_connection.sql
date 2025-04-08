--חלק ב
--יצירת טבלאות

CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(100),
    Family_Name VARCHAR(100),
    Gender VARCHAR(100),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);
CREATE TABLE Family_Relationships (
    Person_Id INT NOT NULL, 
    Relative_Id INT NOT NULL,  
    Connection_Type NVARCHAR(20),
    CONSTRAINT PK_FamilyRelationships PRIMARY KEY (Person_Id, Relative_Id) ,
    FOREIGN KEY (Person_Id) REFERENCES Persons(Person_Id) ON DELETE CASCADE ,
	CONSTRAINT chk_Connection_Type CHECK (Connection_Type IN ('אבא', 'אח', 'אחות', 'אמא', 'בן זוג', 'בת זוג', 'בן', 'בת'))
);


--Persons--כדי להתמודד עם נתונים חלקיים על זוגות בטבלת 
UPDATE p2
SET Spouse_Id = p.Person_Id
FROM Persons p
JOIN Persons p2 ON p.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id IS NULL;


--בדיקה
--DELETE FROM Persons
--DELETE FROM [dbo].[Family_Relationships]
--INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
--VALUES
--(1, 'David', 'Cohen', 'Male', NULL, NULL, NULL),
--(2, 'Miriam', 'Cohen', 'Female', NULL, NULL, 1),
--(3, 'Yossi', 'Cohen', 'Male', 1, 2, NULL),
--(4, 'Rachel', 'Cohen', 'Female', 1, 2, NULL),
--(5, 'Sarah', 'Levi', 'Female', NULL, NULL, 6),
--(6, 'Eliau', 'Levi', 'Male', NULL, NULL,NULL)


-- קשרים של אבא לילד/ה
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Father_Id, p.Person_Id,
       CASE p.Gender
           WHEN 'Male' THEN 'בן'
           WHEN 'Female' THEN 'בת'
       END
FROM Persons p
WHERE p.Father_Id IS NOT NULL
AND EXISTS (SELECT 1 FROM Persons WHERE Person_Id = p.Father_Id);


-- קשרים של ילד/ה לאבא
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Father_Id, 'אבא'
FROM Persons p
WHERE p.Father_Id IS NOT NULL;

-- קשרים של אמא לילד/ה
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Mother_Id, p.Person_Id,
       CASE p.Gender
           WHEN 'Male' THEN 'בן'
           WHEN 'Female' THEN 'בת'
       END
FROM Persons p
WHERE p.Mother_Id IS NOT NULL
AND EXISTS (SELECT 1 FROM Persons WHERE Person_Id = p.Mother_Id);

-- קשרים של ילד/ה לאמא
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Mother_Id, 'אמא'
FROM Persons p
WHERE p.Mother_Id IS NOT NULL;

--קשרים של בני זוג
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Spouse_Id, 
       CASE 
           WHEN p.Gender = 'Male' THEN 'בת זוג' 
           WHEN p.Gender = 'Female' THEN 'בן זוג' 
       END
FROM Persons p
WHERE p.Spouse_Id IS NOT NULL;

--קשרים של אחים
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT 
    p1.Person_Id,
    p2.Person_Id,
    CASE p2.Gender
        WHEN 'Male' THEN 'אח'
        WHEN 'Female' THEN 'אחות'
    END
FROM Persons p1
JOIN Persons p2 ON p1.Person_Id <> p2.Person_Id
WHERE 
    (
        (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
        OR 
        (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
    )

select *
from [dbo].[Persons]


select *
from [dbo].[Family_Relationships]



--drop TRIGGER trg_Family_Relationships_Update
--DROP TRIGGER IF EXISTS trg_UpdateFamilyRelationships;
--GO

--CREATE TRIGGER trg_UpdateFamilyRelationships
--ON Persons
--AFTER INSERT, UPDATE, DELETE
--AS
--BEGIN
--    SET NOCOUNT ON;

--    -- טיפול במחיקה (סילוק קשרים קיימים)
--    DELETE FROM [dbo].[Family_Relationships]
--    WHERE Person_Id IN (SELECT Person_Id FROM deleted)
--    OR Relative_Id IN (SELECT Person_Id FROM deleted);


--    -- קשרים של אבא לילד/ה
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i.Father_Id, i.Person_Id,
--           CASE i.Gender
--                WHEN 'Male' THEN 'בן'
--                WHEN 'Female' THEN 'בת'
--           END
--    FROM inserted i
--    WHERE i.Father_Id IS NOT NULL
--      AND EXISTS (SELECT 1 FROM Persons p WHERE p.Person_Id = i.Father_Id)
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i.Father_Id
--            AND fr.Relative_Id = i.Person_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          WHERE i2.Father_Id = i.Father_Id
--            AND i2.Person_Id = i.Person_Id
--            AND i2.Person_Id < i.Person_Id
--      );

--    -- קשרים של ילד/ה לאבא
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i.Person_Id, i.Father_Id, 'אבא'
--    FROM inserted i
--    WHERE i.Father_Id IS NOT NULL
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i.Person_Id
--            AND fr.Relative_Id = i.Father_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          WHERE i2.Person_Id = i.Person_Id
--            AND i2.Father_Id = i.Father_Id
--            AND i2.Person_Id < i.Person_Id
--      );

--    -- קשרים של אמא לילד/ה
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i.Mother_Id, i.Person_Id,
--           CASE i.Gender
--                WHEN 'Male' THEN 'בן'
--                WHEN 'Female' THEN 'בת'
--           END
--    FROM inserted i
--    WHERE i.Mother_Id IS NOT NULL
--      AND EXISTS (SELECT 1 FROM Persons p WHERE p.Person_Id = i.Mother_Id)
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i.Mother_Id
--            AND fr.Relative_Id = i.Person_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          WHERE i2.Mother_Id = i.Mother_Id
--            AND i2.Person_Id = i.Person_Id
--            AND i2.Person_Id < i.Person_Id
--      );

--    -- קשרים של ילד/ה לאמא
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i.Person_Id, i.Mother_Id, 'אמא'
--    FROM inserted i
--    WHERE i.Mother_Id IS NOT NULL
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i.Person_Id
--            AND fr.Relative_Id = i.Mother_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          WHERE i2.Person_Id = i.Person_Id
--            AND i2.Mother_Id = i.Mother_Id
--            AND i2.Person_Id < i.Person_Id
--      );

--    -- קשרים של בני זוג
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i.Person_Id, i.Spouse_Id,
--           CASE
--                WHEN i.Gender = 'Male' THEN 'בת זוג'
--                WHEN i.Gender = 'Female' THEN 'בן זוג'
--           END
--    FROM inserted i
--    WHERE i.Spouse_Id IS NOT NULL
--      AND EXISTS (SELECT 1 FROM Persons p WHERE p.Person_Id = i.Spouse_Id)
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i.Person_Id
--            AND fr.Relative_Id = i.Spouse_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          WHERE i2.Person_Id = i.Person_Id
--            AND i2.Spouse_Id = i.Spouse_Id
--            AND i2.Person_Id < i.Person_Id
--      );

--    -- קשרים של אחים
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT i1.Person_Id, p2.Person_Id,
--           CASE p2.Gender WHEN 'Male' THEN 'אח' WHEN 'Female' THEN 'אחות' END
--    FROM inserted i1
--    JOIN Persons p2 ON (i1.Father_Id IS NOT NULL AND i1.Father_Id = p2.Father_Id)
--                       OR (i1.Mother_Id IS NOT NULL AND i1.Mother_Id = p2.Mother_Id)
--    WHERE i1.Person_Id <> p2.Person_Id
--      AND EXISTS (SELECT 1 FROM Persons p WHERE p.Person_Id = p2.Person_Id)
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = i1.Person_Id
--            AND fr.Relative_Id = p2.Person_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          JOIN Persons p3 ON (i2.Father_Id IS NOT NULL AND i2.Father_Id = p3.Father_Id)
--                             OR (i2.Mother_Id IS NOT NULL AND i2.Mother_Id = p3.Mother_Id)
--          WHERE i2.Person_Id = i1.Person_Id
--            AND p3.Person_Id = p2.Person_Id
--            AND i2.Person_Id < p3.Person_Id
--      );

--	  -- קשרים הפוכים של אחים
--    INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
--    SELECT p2.Person_Id, i1.Person_Id,
--           CASE i1.Gender WHEN 'Male' THEN 'אח' WHEN 'Female' THEN 'אחות' END
--    FROM inserted i1
--    JOIN Persons p2 ON (i1.Father_Id IS NOT NULL AND i1.Father_Id = p2.Father_Id)
--                       OR (i1.Mother_Id IS NOT NULL AND i1.Mother_Id = p2.Mother_Id)
--    WHERE i1.Person_Id <> p2.Person_Id
--      AND EXISTS (SELECT 1 FROM Persons p WHERE p.Person_Id = i1.Person_Id)
--      AND NOT EXISTS (
--          SELECT 1
--          FROM [dbo].[Family_Relationships] fr
--          WHERE fr.Person_Id = p2.Person_Id
--            AND fr.Relative_Id = i1.Person_Id
--      )
--      AND NOT EXISTS ( -- מניעת כפילות באותה פעולה
--          SELECT 1
--          FROM inserted i2
--          JOIN Persons p3 ON (i2.Father_Id IS NOT NULL AND i2.Father_Id = p3.Father_Id)
--                             OR (i2.Mother_Id IS NOT NULL AND i2.Mother_Id = p3.Mother_Id)
--          WHERE p3.Person_Id = i1.Person_Id
--            AND i2.Person_Id = p2.Person_Id
--            AND p3.Person_Id < i2.Person_Id
--      );
--END;


--INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
--VALUES
--(7, 'Dina', 'Klor', 'Female', 1, NULL, 8),
--(8, 'Ytzchak', 'Klor', 'Male', NULL, 2,NULL);


--INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
--VALUES
--(9, 'Ruth', 'Sason', 'Female', 1, NULL, 10),
--(10, 'Daniel', 'Hertz', 'Male', NULL, 2,NULL);




--DELETE FROM [dbo].[Persons]
--WHERE Person_Id = 9 OR Person_Id = 10;


--UPDATE p2
--SET Spouse_Id = p.Person_Id
--FROM Persons p
--JOIN Persons p2 ON p.Spouse_Id = p2.Person_Id
--WHERE p2.Spouse_Id IS NULL;


--select *
--from [dbo].[Persons]

--select *
--from [dbo].[Family_Relationships]


