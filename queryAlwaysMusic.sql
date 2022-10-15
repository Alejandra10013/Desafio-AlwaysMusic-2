create database alwaysMusic;

create table estudiantes (
	id serial primary key ,
	nombre varchar(50) not null,
	rut varchar(12) not null,
	curso varchar(50) not null,
	nivel varchar(2) not null
);