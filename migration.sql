-- Migration script to rename Razorpay columns to generic payment gateway columns

ALTER TABLE public.donations RENAME COLUMN razorpay_order_id TO pg_order_id;
ALTER TABLE public.donations RENAME COLUMN razorpay_payment_id TO pg_payment_id;
ALTER TABLE public.donations RENAME COLUMN razorpay_signature TO pg_signature;
