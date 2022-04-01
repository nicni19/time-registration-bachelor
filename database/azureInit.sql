CREATE TABLE users (
	id varchar(50) PRIMARY KEY,
	last_mail_lookup bigint NOT NULL,
	last_calendar_lookup bigint NOT NULL
);

CREATE TABLE log_elements (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
	element_description text,
	start_timestamp bigint,
    duration bigint,
    internal_task BIT,
    unpaid BIT,
    rit_num int,
    case_num varchar(10),
    case_task_num int,
    customer varchar(100),
    edited BIT NOT NULL,
    book_keep_ready BIT NOT NULL,
    calendar_id varchar(200),
    mail_id varchar(200)
);

CREATE TABLE preferences (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
	last_mail_lookup bigint NOT NULL,
	last_calendar_lookup bigint NOT NULL
);

CREATE TABLE action_permissions (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
	insert_logs_for_current_user BIT NOT NULL,
    get_logs_for_current_user BIT NOT NULL,
    insert_timer_runs_for_current_user BIT NOT NULL,
    get_timer_runs_for_current_user BIT NOT NULL,
    get_all_logs BIT NOT NULL
);

CREATE TABLE timer_runs (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
	start_time bigint NOT NULL,
	lap_start_time bigint,
    duration bigint NOT NULL
);


CREATE TABLE rit_tasks (
	id int IDENTITY(1,1) PRIMARY KEY,
    rit_task_number varchar(50) NOT NULL
);

CREATE TABLE cases (
	id int IDENTITY(1,1) PRIMARY KEY,
    case_number varchar(50) NOT NULL
);

CREATE TABLE customers (
	id int IDENTITY(1,1) PRIMARY KEY,
    cust_name varchar(50) NOT NULL
);

CREATE TABLE customer_rit (
	id int IDENTITY(1,1) PRIMARY KEY,
    customer_id int FOREIGN KEY REFERENCES customers(id),
    rit_id int FOREIGN KEY REFERENCES rit_tasks(id)
);

CREATE TABLE customer_case (
	id int IDENTITY(1,1) PRIMARY KEY,
    customer_id int FOREIGN KEY REFERENCES customers(id),
    case_id int FOREIGN KEY REFERENCES cases(id)
);

------- INSERT DUMMY DATA

INSERT INTO users(id,last_mail_lookup,last_calendar_lookup) VALUES ('6fc4dcd488b119e7',1648797418621,1648797418621);

INSERT INTO log_elements(user_id,element_description,start_timestamp,duration,internal_task,unpaid,edited,book_keep_ready)
VALUES ('6fc4dcd488b119e7','This is the description of the element',1648797418621,22,1,1,1,0);