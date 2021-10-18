# node-assignment

## Installation
```sh
cd node-assignment
npm i OR yarn install
npm start OR yarn start
```
Create database with following details in db.js
Database Name: assignment
username: Your db username
password: Your db password


Execute following SQL query to create tables
- User 
CREATE TABLE `assignment`.users (
	id INT auto_increment NOT NULL,
	email varchar(100) NULL,
	password varchar(100) NULL,
	token varchar(100) NULL,
	CONSTRAINT users_PK PRIMARY KEY (id),
	CONSTRAINT users_UN UNIQUE KEY (email)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_swedish_ci;

- Buckets
CREATE TABLE `assignment`.buckets (
	id INT auto_increment NOT NULL,
	name varchar(150) NOT NULL,
	CONSTRAINT buckets_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_swedish_ci;

- tasks
CREATE TABLE `assignment`.tasks (
	id INT auto_increment NOT NULL,
	title varchar(200) NULL,
	priority INT NULL,
	status varchar(100) NULL,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
	dueDate DATE NULL,
	bucketId INT NULL,
	CONSTRAINT tasks_PK PRIMARY KEY (id),
	CONSTRAINT tasks_FK FOREIGN KEY (bucketId) REFERENCES `assignment`.buckets(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_swedish_ci;

#### Building for source

```sh
127.0.0.1:3000
```
