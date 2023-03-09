create table restaurant
(
    id   varchar(32) primary key,
    name varchar(100) not null
);

create table restaurant_rating
(
    id               varchar(32) primary key,
    restaurant_id    varchar(32)  not null,
    rating           varchar(25)  not null,
    rated_by_user_id varchar(42)  not null,
    city             varchar(100) not null
);

create table "user"
(
    id      varchar(32) primary key,
    name    varchar(100) not null,
    trusted boolean      not null
);

