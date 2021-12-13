use sigorta_db;

/*
CREATE TABLE Companies (
	id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	company_name varchar(255) NOT NULL,
	logo varchar(255)
)


CREATE TABLE Hospitals (
	id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	hospital_name varchar(255) NOT NULL,
	mahalle varchar(50),
	cadde varchar(50),
	sokak varchar(50),
	ilce varchar(30),
	il varchar(30)
)

CREATE TABLE Offer (
	id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	age_start INT NOT NULL,
	age_end INT NOT NULL,
	company_id INT FOREIGN KEY REFERENCES Companies(id),
	price SMALLMONEY NOT NULL
)


CREATE TABLE CompanyHospital (
	id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	company_id INT FOREIGN KEY REFERENCES Companies(id),
	hospital_id INT FOREIGN KEY REFERENCES Companies(id)
)
*/

/*
BEGIN
    DECLARE @sales INT = 1

    IF @sales == 1
    BEGIN
		INSERT INTO Companies (company_name, logo) VALUES 
			('Þeker Sigorta', 'logogogo'),
			('Mafpre Sigorta', 'logogogo'),
			('Allianz Sigorta', 'logogogo'),
			('Abc Sigorta', 'logogogo')
    END
	ELSE
END
*/

/*
INSERT INTO Companies (company_name, logo) VALUES 
	('Þeker Sigorta', 'logogogo'),
	('Mafpre Sigorta', 'logogogo'),
	('Allianz Sigorta', 'logogogo'),
	('Abc Sigorta', 'logogogo')
*/



INSERT INTO Hospitals (hospital_name, mahalle, cadde, sokak, ilce, il) VALUES 
	('Adnan Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul'),
	('Özel Nihat Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul'),
	('Yokuþ Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul'),
	('Tepeören Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul'),
	('Özel Nine Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul');



INSERT INTO Hospitals (hospital_name, mahalle, cadde, sokak, ilce, il) VALUES 
	('Deniz Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul');

INSERT INTO Offer (age_start, age_end, company_id, price) VALUES 
	(0, 12, 1, 456.4),
	(13, 30, 1, 656.4),
	(31, 55, 1, 856.4),
	(56, 65, 1, 1456.4),
	(65, 75, 1, 2456.4);



INSERT INTO Offer (age_start, age_end, company_id, price) VALUES 
	(0, 12, 2, 456.4),
	(13, 30, 2, 656.4),
	(31, 55, 2, 856.4),
	(56, 60, 2, 1056.4),
	(61, 70, 2, 1780.4);



INSERT INTO CompanyHospital (company_id, hospital_id) VALUES 
	(1, 2),
	(1, 1),
	(1, 3),
	(2, 2),
	(2, 4),
	(3, 1);


-- pagination

SELECT * 
FROM Companies
ORDER BY company_name 
LIMIT 3
OFFSET 1;

SELECT * 
FROM Hospitals
WHERE id IN 
(SELECT hospital_id
FROM CompanyHospital
WHERE company_id = 1)
LIMIT 2
OFFSET 2
;



-- SEARCH
SELECT * 
FROM Companies 
WHERE company_name='Axa Sigorta';


SET @inputAge = 15;
SET @hospitalName  = 'Adnan Hastanesi';

-- find offers based on entered age and hospital name
SELECT *, (SELECT id AS hospital_id FROM Hospitals WHERE hospital_name=@hospitalName LIMIT 1)
FROM Offer
JOIN Companies ON Companies.id = company_id
WHERE age_start <= @inputAge AND age_end >= @inputAge AND company_id IN (
	SELECT company_id
	FROM CompanyHospital 
	WHERE hospital_id = (SELECT id FROM Hospitals WHERE hospital_name=@hospitalName)
)
;

SELECT * FROM Hospitals WHERE hospital_name = @hospitalName;


-- company offers
SET @companyName = 'Axa Sigorta';

SELECT * 
FROM Offer 
JOIN Companies
ON Offer.company_id = Companies.id;
-- WHERE Companies.company_name = @companyName;

SELECT * 
FROM Offer
WHERE company_id = (SELECT id
					FROM Companies
					WHERE company_name = @companyName);

-- add offer
INSERT INTO Offer (age_start, age_end, price, company_id) 
VALUES
 (10, 20, 450, (SELECT id
					FROM Companies
					WHERE company_name = @companyName))




/*
SELECT company_id
FROM CompanyHospital 
WHERE hospital_id = (SELECT id FROM Hospitals WHERE hospital_name=@hospitalName)
*/


/*
If Not Exists(select * from Companies where company_name = 'Abc Sigorta')
Begin
insert into tablename (code) values ('1448523')
End
*/