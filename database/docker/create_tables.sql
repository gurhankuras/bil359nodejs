CREATE DATABASE IF NOT EXISTS sigorta_db;

use sigorta_db

-- DROP TABLE Companies

CREATE TABLE Companies (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	company_name varchar(255) NOT NULL,
	image varchar(255)
);


INSERT INTO Companies (company_name, image) VALUES 
	('Seker Sigorta', 'logogogo'),
    ('Axa Sigorta', 'https://pbs.twimg.com/profile_images/1253391920941989890/vF79IkPX_200x200.jpg'),
    ('Ankara Sigorta', 'https://files.sikayetvar.com/lg/cmp/10/1067.svg?1522650125'),
    ('Zurih Sigorta', 'https://www.hesapkurdu.com/Assets/img/insurer/38.png'),
    ('Ergo Sigorta', 'https://media-exp1.licdn.com/dms/image/C560BAQEnh_YIhjYpBg/company-logo_200_200/0/1519900723339?e=2159024400&v=beta&t=lbZJal1tikiVe6-MwE6Wkw6gZp2fNsXPhNCQiIx3RLA'),
    ('Anadolu Sigorta', 'https://www.anadolusigorta.com.tr/i/assets/wunder/assets/logo.png'),
    ('Unico Sigorta', 'https://www.unicosigorta.com.tr/assets/img/unico-logo.webp'),
    ('Ak Sigorta', 'https://www.aksigorta.com.tr/api/uploads/20190201172831648.png'),
	('Mafpre Sigorta', 'logogogo'),
	('Allianz Sigorta', 'logogogo'),
	('Abc Sigorta', 'logogogo'),
    ('Axa Sigorta', 'logo')
;


CREATE TABLE Hospitals (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	hospital_name varchar(255) NOT NULL,
	mahalle varchar(50),
	cadde varchar(50),
	sokak varchar(50),
	ilce varchar(30),
	il varchar(30),
    address_no INT
);


INSERT INTO Hospitals (hospital_name, mahalle, cadde, sokak, ilce, il, address_no) VALUES 
	('Adnan Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 1),
	('Nihat Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
	('Abc Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('Abc Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
	('BB Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 16),
    ('A Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('B Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('C Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('D Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('E Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
    ('F Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 23),
	('Nine Hastanesi', 'Abc Mahallesi', 'Yasa Caddesi', 'Tepe sokak', 'Kartal', 'İstanbul', 35)
;

CREATE TABLE Offer (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	age_start INT NOT NULL,
	age_end INT NOT NULL,
	company_id INT,
	price numeric(19,4) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE
);


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


CREATE TABLE CompanyHospital (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	company_id INT,
	hospital_id INT,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(id) ON DELETE CASCADE
);


INSERT INTO CompanyHospital (company_id, hospital_id) VALUES 
	(1, 2),
	(1, 1),
	(1, 3),
	(2, 2),
	(2, 4),
	(3, 1);
    

INSERT INTO CompanyHospital (company_id, hospital_id) VALUES (1, 6);

INSERT INTO CompanyHospital (company_id, hospital_id) VALUES (4, 5);

DELETE FROM Companies WHERE id = 4;


ALTER TABLE Offer ADD previous_value numeric(19,4);
ALTER TABLE Offer ADD changing int DEFAULT 0;
delimiter //
CREATE TRIGGER before_price_updated BEFORE UPDATE ON Offer
       FOR EACH ROW
       IF(OLD.price <> NEW.price) THEN
			SET NEW.previous_value = (SELECT price FROM Offer WHERE id = NEW.id);
	   END IF//
delimiter ;

delimiter //
CREATE TRIGGER before_delete_discount BEFORE UPDATE ON Offer
       FOR EACH ROW
       IF(NEW.changing = 1 AND OLD.previous_value IS NOT NULL) THEN
			SET NEW.price = OLD.previous_value;
            SET NEW.previous_value = NULL;
            SET NEW.changing = 0;
	   END IF//
delimiter ;

		
-- DROP TRIGGER before_price_updated;
-- SHOW TRIGGERS
-- UPDATE Offer SET Offer.price = 900.0 WHERE id = 10
UPDATE Offer SET price = 800.0 WHERE id = 10 AND price = 900.0;

-- get all company discounts
SELECT * FROM Offer 
JOIN Companies 
ON Offer.company_id = Companies.id
WHERE Offer.price < Offer.previous_value;

-- UPDATE Offer SET previous_value = NULL WHERE company_id = 2;


SELECT * FROM Offer WHERE company_id = (SELECT id FROM Companies WHERE company_name = 'Axa Sigorta' LIMIT 1) AND age_start = 61 AND age_end = 70 LIMIT 1;

SELECT user,authentication_string,plugin,host FROM mysql.user;
/*
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Current-Root-Password';
FLUSH PRIVILEGES;
*/