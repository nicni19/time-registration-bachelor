CREATE TABLE users (
	id varchar(50) PRIMARY KEY,
	last_mail_lookup varchar(30) NOT NULL,
	last_calendar_lookup varchar(30) NOT NULL
);

CREATE TABLE log_elements (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
    element_type varchar(20), 
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

CREATE TABLE temp_log_elements (
	id int IDENTITY(1,1) PRIMARY KEY,
    user_id varchar(50) FOREIGN KEY REFERENCES users(id),
    element_type varchar(20), 
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
    get_all_logs BIT NOT NULL,
    delete_log_element_for_current_user BIT NOT NULL,
    delete_timer_element_for_current_user BIT NOT NULL
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

CREATE   PROCEDURE GraphInsert @id int
AS 
BEGIN
	DECLARE
    @user_id Varchar(50),
    @element_type varchar(20),
    @element_description varchar(max),
    @start_timestamp bigint,
    @duration bigint,
    @internal_task bit,
    @unpaid bit,
    @rit_num int,
    @case_num varchar(10),
    @case_task_num int,
	@customer varchar(100),
    @edited bit,
	@book_keep_ready bit,
	@calendar_id varchar(200),
	@mail_id varchar(200);

    SET @user_id = (SELECT user_id FROM [dbo].[temp_log_elements] WHERE id = @id);
	print @user_id;
    SET @element_type = (SELECT element_type FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @element_description = (SELECT element_description FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @start_timestamp = (SELECT start_timestamp FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @duration = (SELECT duration FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @internal_task = (SELECT internal_task FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @unpaid = (SELECT unpaid FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @rit_num = (SELECT rit_num FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @case_num = (SELECT case_num FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @case_task_num = (SELECT case_task_num FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @customer = (SELECT customer FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @edited = (SELECT edited FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @book_keep_ready = (SELECT book_keep_ready FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @calendar_id = (SELECT calendar_id FROM [dbo].[temp_log_elements] WHERE id = @id);
    SET @mail_id = (SELECT mail_id FROM [dbo].[temp_log_elements] WHERE id = @id)

    IF EXISTS (SELECT * FROM log_elements WHERE(calendar_id = @calendar_id AND @calendar_id IS NOT NULL))
    BEGIN
        IF (SELECT edited FROM log_elements WHERE calendar_id = @calendar_id) = 0
            BEGIN
                UPDATE [dbo].[log_elements] SET element_type = @element_type, element_description = @element_description,
                start_timestamp = @start_timestamp, duration = @duration, internal_task = @internal_task, unpaid = @unpaid,
                rit_num = @rit_num, case_num = @case_num, case_task_num = @case_task_num, customer = @customer, book_keep_ready = @book_keep_ready  		
                WHERE calendar_id = @calendar_id
            END
    END
	ELSE IF EXISTS (SELECT * FROM log_elements WHERE(mail_id = @mail_id AND @mail_id IS NOT NULL))
    BEGIN
        IF (SELECT edited FROM log_elements WHERE mail_id = @mail_id) = 0
            BEGIN
                UPDATE [dbo].[log_elements] SET element_type = @element_type, element_description = @element_description,
                start_timestamp = @start_timestamp, duration = @duration, internal_task = @internal_task, unpaid = @unpaid,
                rit_num = @rit_num, case_num = @case_num, case_task_num = @case_task_num, customer = @customer, book_keep_ready = @book_keep_ready  		
                WHERE mail_id = @mail_id
            END
    END

    ELSE IF EXISTS (SELECT * FROM [dbo].[temp_log_elements] t WHERE t.id = @id)
    BEGIN
        INSERT INTO [dbo].[log_elements] (user_id,element_type,element_description,start_timestamp,duration,
		internal_task,unpaid,rit_num,case_num,case_task_num,customer,edited,book_keep_ready,mail_id,calendar_id) 
		VALUES (@user_id,@element_type,@element_description,@start_timestamp,@duration,@internal_task,@unpaid,
                @rit_num,@case_num,@case_task_num,@customer,@edited,@book_keep_ready,@mail_id,@calendar_id)
    END
END

CREATE OR ALTER TRIGGER onGraphInsert
ON [dbo].[temp_log_elements]
AFTER INSERT
AS 
BEGIN
DECLARE @RowCnt INT;
DECLARE @Count INT = 1; 

SELECT @RowCnt = COUNT(*) FROM [dbo].[temp_log_elements]
WHILE @Count <= @RowCnt 
BEGIN
	EXEC GraphInsert @id = @Count;
	SET @Count = @Count + 1;
END
DELETE FROM [dbo].[temp_log_elements];
DBCC CHECKIDENT('[dbo].[temp_log_elements]',RESEED,0);
END
