-- Migration: Add verification methods fields to User table
-- Date: 2024-12-XX
-- Description: Adds phoneNumber, securityQuestion, and securityAnswer fields for additional password recovery methods

-- Add phoneNumber field
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;

-- Add securityQuestion field
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "securityQuestion" TEXT;

-- Add securityAnswer field
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "securityAnswer" TEXT;

-- Note: These fields are optional (nullable) to maintain backward compatibility
-- Users can configure these methods in their profile settings
