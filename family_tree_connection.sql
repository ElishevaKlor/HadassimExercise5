--��� �
--����� ������

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
� � Person_Id INT NOT NULL,�
� � Relative_Id INT NOT NULL,� 
� � Connection_Type NVARCHAR(20),
� � CONSTRAINT PK_FamilyRelationships PRIMARY KEY (Person_Id, Relative_Id) ,
� � FOREIGN KEY (Person_Id) REFERENCES Persons(Person_Id)�ON DELETE CASCADE ,
	CONSTRAINT chk_Connection_Type CHECK (Connection_Type IN ('���', '��', '����', '���', '�� ���', '�� ���', '��', '��'))
);


--Persons--��� ������� �� ������ ������ �� ����� ����� 
UPDATE p2
SET Spouse_Id = p.Person_Id
FROM Persons p
JOIN Persons p2 ON p.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id IS NULL;

-- ����� �� ��� ����/�
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Father_Id, p.Person_Id,
       CASE p.Gender
           WHEN 'Male' THEN '��'
           WHEN 'Female' THEN '��'
       END
FROM Persons p
WHERE p.Father_Id IS NOT NULL
AND EXISTS (SELECT 1 FROM Persons WHERE Person_Id = p.Father_Id);


-- ����� �� ���/� ����
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Father_Id, '���'
FROM Persons p
WHERE p.Father_Id IS NOT NULL;

-- ����� �� ��� ����/�
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Mother_Id, p.Person_Id,
       CASE p.Gender
           WHEN 'Male' THEN '��'
           WHEN 'Female' THEN '��'
       END
FROM Persons p
WHERE p.Mother_Id IS NOT NULL
AND EXISTS (SELECT 1 FROM Persons WHERE Person_Id = p.Mother_Id);

-- ����� �� ���/� ����
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Mother_Id, '���'
FROM Persons p
WHERE p.Mother_Id IS NOT NULL;

--����� �� ��� ���
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Spouse_Id, 
       CASE 
           WHEN p.Gender = 'Male' THEN '�� ���' 
           WHEN p.Gender = 'Female' THEN '�� ���' 
       END
FROM Persons p
WHERE p.Spouse_Id IS NOT NULL;

--����� �� ����
INSERT INTO [dbo].[Family_Relationships] (Person_Id, Relative_Id, Connection_Type)
SELECT 
    p1.Person_Id,
    p2.Person_Id,
    CASE p2.Gender
        WHEN 'Male' THEN '��'
        WHEN 'Female' THEN '����'
    END
FROM Persons p1
JOIN Persons p2 ON p1.Person_Id <> p2.Person_Id
WHERE 
    (
        (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
        OR 
        (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
    )


