--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE hotel_admin;
ALTER ROLE hotel_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:S1o7F8MeA04JlEADcFAwQA==$trnH9qj5TMPxvZ57iKTgbYyMi+wr2RctMzuvjm9pcSI=:MkEttnZYU4UiBVXhZg5RUiODg6bsRRxYnuy8it2TzbA=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "hotel_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hotel_db; Type: DATABASE; Schema: -; Owner: hotel_admin
--

CREATE DATABASE hotel_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE hotel_db OWNER TO hotel_admin;

\connect hotel_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: hotel_admin
--

CREATE TABLE public.clients (
    client_id integer NOT NULL,
    client_code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    document character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO hotel_admin;

--
-- Name: clients_client_id_seq; Type: SEQUENCE; Schema: public; Owner: hotel_admin
--

CREATE SEQUENCE public.clients_client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_client_id_seq OWNER TO hotel_admin;

--
-- Name: clients_client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hotel_admin
--

ALTER SEQUENCE public.clients_client_id_seq OWNED BY public.clients.client_id;


--
-- Name: companions; Type: TABLE; Schema: public; Owner: hotel_admin
--

CREATE TABLE public.companions (
    companion_id integer NOT NULL,
    client_id integer NOT NULL,
    reservation_id integer NOT NULL,
    name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    document character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companions OWNER TO hotel_admin;

--
-- Name: companions_companion_id_seq; Type: SEQUENCE; Schema: public; Owner: hotel_admin
--

CREATE SEQUENCE public.companions_companion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companions_companion_id_seq OWNER TO hotel_admin;

--
-- Name: companions_companion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hotel_admin
--

ALTER SEQUENCE public.companions_companion_id_seq OWNED BY public.companions.companion_id;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: hotel_admin
--

CREATE TABLE public.reservations (
    reservation_id integer NOT NULL,
    client_id integer,
    number_room character varying(10) NOT NULL,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    total_guests integer NOT NULL,
    status character varying(20) DEFAULT 'confirmed'::character varying,
    special_requests text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reservations OWNER TO hotel_admin;

--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: hotel_admin
--

CREATE SEQUENCE public.reservations_reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_reservation_id_seq OWNER TO hotel_admin;

--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hotel_admin
--

ALTER SEQUENCE public.reservations_reservation_id_seq OWNED BY public.reservations.reservation_id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: hotel_admin
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    number_room character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    type_room character varying(20) NOT NULL,
    category_room character varying(20) NOT NULL,
    beds integer NOT NULL,
    size character varying(20) NOT NULL,
    options text[],
    status character varying(20) DEFAULT 'available'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rooms_category_room_check CHECK (((category_room)::text = ANY ((ARRAY['Main house'::character varying, 'Garden'::character varying, 'Tower 1'::character varying, 'Tower 2'::character varying])::text[]))),
    CONSTRAINT rooms_type_room_check CHECK (((type_room)::text = ANY ((ARRAY['Single room'::character varying, 'Double room'::character varying, 'Triple room'::character varying, 'Quadruple room'::character varying])::text[])))
);


ALTER TABLE public.rooms OWNER TO hotel_admin;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: hotel_admin
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO hotel_admin;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hotel_admin
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: hotel_admin
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'staff'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO hotel_admin;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: hotel_admin
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO hotel_admin;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hotel_admin
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: clients client_id; Type: DEFAULT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.clients ALTER COLUMN client_id SET DEFAULT nextval('public.clients_client_id_seq'::regclass);


--
-- Name: companions companion_id; Type: DEFAULT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.companions ALTER COLUMN companion_id SET DEFAULT nextval('public.companions_companion_id_seq'::regclass);


--
-- Name: reservations reservation_id; Type: DEFAULT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.reservations ALTER COLUMN reservation_id SET DEFAULT nextval('public.reservations_reservation_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: hotel_admin
--

COPY public.clients (client_id, client_code, name, email, phone, document, created_at, updated_at) FROM stdin;
1	CLI799642	michael	michael@test.com	9827368943	4154616771711	2025-03-30 16:06:39.651743	2025-03-30 16:06:39.651743
2	CLI031070	malu	test@tes.com	148147108571	451481754185	2025-03-30 17:33:51.083077	2025-03-30 17:33:51.083077
3	CLI017035	mavi	mavi@test.com	7156179591	1456378950044	2025-03-30 17:50:17.061498	2025-03-30 17:50:17.061498
4	CLI902505	joao	mfaifha@test.com	09875265982	2166871449849	2025-03-30 18:05:02.531462	2025-03-30 18:05:02.531462
5	CLI291653	matheuis	mat@test.com	9967967551	135618895901	2025-03-30 19:34:51.669554	2025-03-30 19:34:51.669554
6	CLI229148	judas	traiu@jesus.com	983597656	187157891985	2025-03-30 20:57:09.162007	2025-03-30 20:57:09.162007
7	CLI693354	adula	damdk@test.com	1519571515	5261749600	2025-03-30 22:44:53.381586	2025-03-30 22:44:53.381586
8	CLI291459	Evelin	test@oihjohra.com	08915781850	17589399322	2025-04-05 15:34:51.471517	2025-04-05 15:34:51.471517
9	CLI862437	muhdad	mihd@gmail.com	19851785189	151714610451	2025-04-05 17:07:42.449614	2025-04-05 17:07:42.449614
\.


--
-- Data for Name: companions; Type: TABLE DATA; Schema: public; Owner: hotel_admin
--

COPY public.companions (companion_id, client_id, reservation_id, name, date_of_birth, document, created_at, updated_at) FROM stdin;
1	3	7	Michael Vinicius candida	2003-12-30	2212112122112	2025-03-30 17:56:48.201781	2025-03-30 17:56:48.201781
2	7	8	joao	2009-12-22	2212112122112	2025-03-30 22:58:08.295456	2025-03-30 22:58:08.295456
3	1	18	malu	2009-02-22	5261784586858	2025-04-05 15:07:47.431978	2025-04-05 15:07:47.431978
4	1	18	mavi	2001-02-12	789012567812	2025-04-05 15:07:47.482527	2025-04-05 15:07:47.482527
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: hotel_admin
--

COPY public.reservations (reservation_id, client_id, number_room, check_in_date, check_out_date, total_guests, status, special_requests, created_at, updated_at) FROM stdin;
14	6	101	2025-10-29	2025-04-05	1	completed	\N	2025-04-05 13:58:31.065499	2025-04-05 13:58:31.065499
1	1	101	2025-03-30	2025-04-05	1	completed	\N	2025-03-30 17:33:27.886317	2025-03-30 17:33:27.886317
4	1	101	2025-08-26	2025-04-05	2	completed	\N	2025-03-30 17:40:59.08862	2025-03-30 17:40:59.08862
9	1	101	2025-08-26	2025-04-05	1	completed	\N	2025-04-05 13:41:54.958106	2025-04-05 13:41:54.958106
10	1	101	2025-10-26	2025-04-05	1	completed	\N	2025-04-05 13:43:18.154662	2025-04-05 13:43:18.154662
11	1	101	2025-10-26	2025-04-05	1	completed	\N	2025-04-05 13:43:50.67354	2025-04-05 13:43:50.67354
12	1	101	2025-10-26	2025-04-05	1	completed	\N	2025-04-05 13:47:32.254382	2025-04-05 13:47:32.254382
2	2	101	2025-04-02	2025-04-05	1	completed	\N	2025-03-30 17:34:17.064715	2025-03-30 17:34:17.064715
3	2	101	2025-05-19	2025-04-05	1	completed	\N	2025-03-30 17:35:31.86127	2025-03-30 17:35:31.86127
8	7	1	2026-05-28	2025-04-05	2	completed	\N	2025-03-30 22:58:08.23951	2025-03-30 22:58:08.23951
13	7	101	2025-10-28	2025-04-05	1	completed	\N	2025-04-05 13:58:01.197623	2025-04-05 13:58:01.197623
7	3	202	2025-03-30	2025-04-05	2	completed	\N	2025-03-30 17:56:48.150418	2025-03-30 17:56:48.150418
15	3	1	2025-04-05	2025-04-07	1	confirmed	\N	2025-04-05 14:29:52.162482	2025-04-05 14:29:52.162482
17	1	2	2025-04-05	2025-04-07	2	pending	\N	2025-04-05 12:04:56.571113	2025-04-05 12:04:56.571113
19	8	101	2025-04-26	2025-04-29	1	confirmed	\N	2025-04-05 16:04:56.997718	2025-04-05 16:04:56.997718
20	1	202	2025-04-05	2025-04-09	1	confirmed	\N	2025-04-05 17:47:23.819637	2025-04-05 17:47:23.819637
18	1	101	2025-04-23	2025-04-05	3	completed	\N	2025-04-05 15:07:47.38009	2025-04-05 15:07:47.38009
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: hotel_admin
--

COPY public.rooms (id, number_room, name, type_room, category_room, beds, size, options, status, created_at, updated_at) FROM stdin;
1	101	margaridas	Single room	Garden	2	12	{"Double Bed","Lake View","Wireless Internet"}	available	2025-03-30 16:07:30.169148	2025-03-30 16:07:30.169148
2	202	rosa	Single room	Main house	1	12	{"Twin Bed","Bathroom with Bathtub","Hair Dryer"}	available	2025-03-30 17:50:42.685241	2025-03-30 17:50:42.685241
3	121	minerva	Quadruple room	Tower 2	2	21	{"Double Bed","Twin Bed","Garden View","Bathroom with Bathtub"}	available	2025-03-30 21:07:06.679426	2025-03-30 21:07:06.679426
4	1	midas	Single room	Main house	2	31	{"Double Bed","Lake View","Hair Dryer","Twin Bed","Bathroom with Bathtub"}	available	2025-03-30 22:47:49.666883	2025-03-30 22:47:49.666883
5	102	magnolia	Double room	Tower 1	2	12	{"Double Bed","Twin Bed","Living Area",Non-Smoking}	available	2025-04-05 15:43:08.116163	2025-04-05 15:43:08.116163
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hotel_admin
--

COPY public.users (user_id, name, email, password, role, created_at, updated_at) FROM stdin;
1	michael	mciahel@test.com	$2b$10$IEHCSp3yPiQ.a0sjyBoFUesllOSJvtN6RLGtu0/wCckWpmdtO4Pw.	staff	2025-04-05 17:53:11.789485	2025-04-05 17:53:11.789485
\.


--
-- Name: clients_client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hotel_admin
--

SELECT pg_catalog.setval('public.clients_client_id_seq', 9, true);


--
-- Name: companions_companion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hotel_admin
--

SELECT pg_catalog.setval('public.companions_companion_id_seq', 4, true);


--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hotel_admin
--

SELECT pg_catalog.setval('public.reservations_reservation_id_seq', 20, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hotel_admin
--

SELECT pg_catalog.setval('public.rooms_id_seq', 5, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hotel_admin
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- Name: clients clients_client_code_key; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_client_code_key UNIQUE (client_code);


--
-- Name: clients clients_document_key; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_document_key UNIQUE (document);


--
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (client_id);


--
-- Name: companions companions_pkey; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_pkey PRIMARY KEY (companion_id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id);


--
-- Name: rooms rooms_number_room_key; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_number_room_key UNIQUE (number_room);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: companions unique_companion_document; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT unique_companion_document UNIQUE (reservation_id, document);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: companions companions_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(client_id) ON DELETE CASCADE;


--
-- Name: companions companions_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(reservation_id) ON DELETE CASCADE;


--
-- Name: reservations reservations_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hotel_admin
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(client_id);


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

