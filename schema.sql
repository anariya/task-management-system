DROP TABLE IF EXISTS UserItem;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS Columns;
DROP TABLE IF EXISTS UserGroup;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Groups;

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    userpass VARCHAR(255) NOT NULL
);

CREATE TABLE Groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE Columns (
    column_id SERIAL PRIMARY KEY,
    group_id INT,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE
);

INSERT INTO Columns (column_id, name) VALUES
    (1, 'placeholder');

CREATE TABLE UserGroup (
    user_id INT,
    group_id INT,
    role VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE
);

CREATE TABLE Items (
    item_id SERIAL PRIMARY KEY,
    group_id INT,
    column_id INT,
    column_index INT,
    itemindex INT,
    title VARCHAR(255) NOT NULL,
    priority INT,
    due_date DATE,
    FOREIGN KEY (column_id) REFERENCES Columns(column_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE
);

CREATE TABLE UserItem (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);

CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    group_id INT,
    name VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location VARCHAR(255),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE
);



