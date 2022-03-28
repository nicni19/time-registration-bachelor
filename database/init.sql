CREATE DATABASE time_registration_system;

USE time_registration_system;

CREATE TABLE users (
	id int varchar(50) PRIMARY KEY,
	last_mail_lookup bigint NOT NULL,
	last_calendar_lookup bigint NOT NULL
);

CREATE TABLE log_elements (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id)
	description text,
	start_timestamp bigint,
    duration bignit,
    internal_task boolean,
    unpaid boolean,
    rit_num int,
    case_num varchar(10),
    case_task_num int,
    customer varchar(100),
    edited boolean NOT NULL,
    book_keep_ready boolean NOT NULL,
    calendar_id varchar(200),
    mail_id varchar(200)
);

CREATE TABLE preferences (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id)
	last_mail_lookup bigint NOT NULL,
	last_calendar_lookup bigint NOT NULL
);

CREATE TABLE action_permissions (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id)
	insert_logs_for_current_user boolean NOT NULL,
    get_logs_for_current_user boolean NOT NULL,
    insert_timer_runs_for_current_user boolean NOT NULL,
    get_timer_runs_for_current_user boolean NOT NULL,
    get_all_logs boolean NOT NULL
);

CREATE TABLE timer_runs (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id)
	start_time bigint NOT NULL,
	lap_start_time bigint,
    duration bigint NOT NULL
);


CREATE TABLE rit_tasks (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rit_task_number varchar(50) NOT NULL
);

CREATE TABLE cases (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    case_number varchar(50) NOT NULL
);

CREATE TABLE customers (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cust_name varchar(50) NOT NULL
);

CREATE TABLE customer_rit (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (rit_id) REFERENCES rit_tasks(id)
);

CREATE TABLE customer_case (
	id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (case_id) REFERENCES cases(id)
);

