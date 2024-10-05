DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS [role];
DROP TABLE IF EXISTS user_project;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS meeting;
DROP TABLE IF EXISTS calendar_item;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS task_dependency;
DROP TABLE IF EXISTS user_project_role;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS task_tag;

CREATE TABLE [role] (
    role_id INTEGER GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE project (
    project_id INTEGER GENERATED ALWAYS AS IDENTITY,
    project_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (project_id)
);

CREATE TABLE user (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE user_project (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON DELETE CASCADE
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project (project_id)
        ON DELETE CASCADE
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE user_project_role (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON DELETE CASCADE
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project (project_id)
        ON DELETE CASCADE
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES [role] (role_id)
        ON DELETE CASCADE
    PRIMARY KEY (user_id, project_id, role_id)
);

CREATE TABLE task (
    task_id INTEGER GENERATED ALWAYS AS IDENTITY,
    task_title VARCHAR(255) NOT NULL,
    task_desc VARCHAR(255),
    PRIMARY KEY (task_id)
);

CREATE TABLE task_dependency (
    task_id INTEGER NOT NULL,
    dependency_task_id INTEGER NOT NULL,
    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES task (task_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_dependency FOREIGN KEY (dependency_task_idtask_id) REFERENCES task (task_id),
    PRIMARY KEY (task_id, dependency_task_id)
);

CREATE TABLE task_tag (
    task_id INTEGER NOT NULL,
    tag_name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES task (task_id)
        ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_name)
);

CREATE TABLE comment (
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment_no INTEGER NOT NULL,
    comment_text VARCHAR(255) NOT NULL,
    comment_date DATE NOT NULL,
    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES task (task_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON DELETE CASCADE,
    PRIMARY KEY (task_id, comment_no)
);

CREATE TABLE task_user (
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES task (task_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
        ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
);