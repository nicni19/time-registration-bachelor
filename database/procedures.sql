--- GRAPH FLOW PROCEDURE
CREATE PROCEDURE GraphInsert @id int
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