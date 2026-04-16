create database teste34;
use teste34;

create table teste(
id int primary key auto_increment,
nome varchar(120) not null,
email varchar(120) not null unique,
senha varchar(120) not null unique
);

select * from teste;
drop database teste34;